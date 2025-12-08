from rest_framework import viewsets, permissions, authentication, status, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView

from .models import Project, Material, MaterialUsage, WasteRecord, Organization, CustomUser, Notification, WeatherAlert
from .permissions import IsStorekeeperOrReadOnly
from .open_meteo import get_weather, generate_weather_alert
from .serializers import ProjectSerializer, MaterialSerializer, MaterialUsageSerializer, WasteRecordSerializer, \
    OrganizationalSerializer, CustomTokenObtainPairSerializer, UserSerializer, NotificationSerializer, \
    WeatherAlertSerializer

from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum
from django.contrib.auth import get_user_model

from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.http import FileResponse

from .pagination import ProjectPagination

class NotificationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign_role(self, request, pk=None):
        user = self.get_object()
        role = request.data.get('role')

        if role not in dict(CustomUser.ROLE_CHOICES):
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        user.save()

        Notification.objects.create(user=user, title='Role Updated', message=f"Your role has been updated to {role} by an administrator")

        return Response({"message": f"Role updated to {role}"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    User = get_user_model()
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)

    res = Response({'access': str(refresh.access_token)}, status=status.HTTP_201_CREATED)
    res.set_cookie(key='refresh', value=str(refresh), secure=False, httponly=True, samesite='Lax', max_age=60 * 60 * 24 * 7)
    return res



class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data

        refresh = data.get('refresh')
        access = data.get('access')

        res = Response({"access": access}, status=status.HTTP_200_OK)
        res.set_cookie(key='refresh', value=refresh, secure=False, httponly=True, samesite='Lax', max_age=60*60*24*7)
        return res

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({"detail": "Refresh token missing"}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
            return Response({"access": str(new_access)}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def material_alerts(request, project_id):
    usages = MaterialUsage.objects.filter(project_id = project_id)
    alert_threshold = 80
    alerts = []

    for u in usages:
        if u.material_supplied > 0:
            usage_percent = (u.quantity_used / u.material_supplied) * 100
            if usage_percent >= alert_threshold:
                alerts.append({
                    'material': u.material.name,
                    'usage_percentage': round(usage_percent, 2),
                    'remaining': round(u.material_supplied - u.quantity_used, 2),
                    'message': f"{u.material.name} usage has reached {round(usage_percent, 1)}% of supply!"
                })

    return Response({
        'project_id': project_id,
        'total_alerts': len(alerts),
        'alerts': alerts,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cost_report(request, project_id):
    usages = MaterialUsage.objects.filter(project_id=project_id)
    wastes = WasteRecord.objects.filter(project_id=project_id)
    total_cost = 0
    waste_cost = 0

    for usage in usages:
        material_cost = usage.quantity_used * usage.material.cost_per_unit
        total_cost += material_cost

    for waste in wastes:
        material_waste_cost = waste.waste_quantity * waste.material.cost_per_unit
        waste_cost += material_waste_cost

    report = {
        'project_id': project_id,
        'total_cost': total_cost,
        'waste_cost': waste_cost,
    }

    return Response(report)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def carbon_report(request, project_id):
    usages = MaterialUsage.objects.filter(project_id=project_id)
    wastes = WasteRecord.objects.filter(project_id=project_id)
    total_co2 = 0
    waste_co2 = 0
    for usage in usages:
        used_co2 = usage.quantity_used * usage.material.co2_factor
        total_co2 += used_co2
    for waste in wastes:
        waste_co2_value = waste.waste_quantity * waste.material.co2_factor
        waste_co2 += waste_co2_value

    environmental_efficiency = (((total_co2 - waste_co2) / total_co2) * 100) if total_co2 > 0 else 0
    report = {
        'project_id': project_id,
        'total_co2_emission': round(total_co2, 2),
        'waste_co2_emission': round(waste_co2, 2),
        'environmental_efficiency': f"{round(environmental_efficiency, 2)}%"
    }
    return Response(report)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_summary(request, project_id):
    total_used = MaterialUsage.objects.filter(project_id=project_id).aggregate(Sum('quantity_used'))['quantity_used__sum'] or 0
    total_waste = WasteRecord.objects.filter(project_id=project_id).aggregate(Sum('waste_quantity'))['waste_quantity__sum'] or 0

    summary = {
        "project_id": project_id,
        "total_material_used": total_used,
        "total_material_waste": total_waste,
    }
    return Response(summary)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pdf_report(request, project_id):
    project = Project.objects.get(id=project_id)
    usages = MaterialUsage.objects.filter(project_id=project_id)
    wastes = WasteRecord.objects.filter(project_id=project_id)

    total_cost = sum(u.quantity_used * u.material.cost_per_unit for u in usages)
    waste_cost = sum(w.waste_quantity * w.material.cost_per_unit for w in wastes)
    total_co2 = sum(u.quantity_used * u.material.co2_factor for u in usages)
    waste_co2 = sum(w.waste_quantity * w.material.co2_factor for w in wastes)
    environmental_efficiency = (((total_co2 - waste_co2) / total_co2) * 100) if total_co2 > 0 else 0

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    p.setFont("Helvetica", 12)

    p.drawString(100, 800, f"Project Report - {project.name}")
    p.drawString(100, 780, f"Location: {project.location}")
    p.drawString(100, 760, f"Date: {project.start_date}")

    p.drawString(100, 730, f"Total Material Cost: ₦{total_cost:.2f}")
    p.drawString(100, 710, f"Waste Cost: ₦{waste_cost:.2f}")

    p.drawString(100, 660, f"Total_co2 Emission: {total_co2:.2f} kg")
    p.drawString(100, 640, f"Waste Co2 Emission: {waste_co2:.2f} kg")
    p.drawString(100, 620, f"Environmental Efficiency: {environmental_efficiency:.2f} %")
    p.showPage()
    p.save()

    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"project_{project_id}_report.pdf")

class OrganizationalViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationalSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = ProjectPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return Project.objects.all()
        return Project.objects.filter(workers=user)

class ProjectWeatherView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        weather_data = get_weather(project.latitude, project.longitude)

        return Response({
            "project": project.name,
            "location": project.location,
            "weather": weather_data,
        })

class ProjectWeatherAlertView(APIView):
    def post(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        alert_message = generate_weather_alert(project.latitude, project.longitude)

        created_alerts = []
        for alert in alert_message:
            obj = WeatherAlert.objects.create(project=project, message=alert)
            created_alerts.append(obj)

        serializer = WeatherAlertSerializer(created_alerts, many=True)
        return Response({
            "project": project.name,
            "alerts_generated": serializer.data
        })

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated, IsStorekeeperOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return Material.objects.all()
        return Material.objects.filter(project__workers=user)

class MaterialUsageViewSet(viewsets.ModelViewSet):
    queryset = MaterialUsage.objects.all()
    serializer_class = MaterialUsageSerializer

class WasteRecordViewSet(viewsets.ModelViewSet):
    queryset = WasteRecord.objects.all()
    serializer_class = WasteRecordSerializer

