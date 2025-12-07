from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, MaterialViewSet, MaterialUsageViewSet, WasteRecordViewSet, pdf_report, OrganizationalViewSet, register_user, LoginView, UserViewSet, NotificationViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import project_summary, cost_report, material_alerts, ProjectWeatherView, ProjectWeatherAlertView, RefreshTokenView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='Users')
router.register(r'organizational', OrganizationalViewSet, basename='Organizational')
router.register(r'projects', ProjectViewSet, basename='Projects')
router.register(r'materials', MaterialViewSet, basename='Materials')
router.register(r'materialUsage', MaterialUsageViewSet, basename='MaterialUsage')
router.register(r'wasteRecords', WasteRecordViewSet, basename='WasteRecords')
router.register(r'notifications', NotificationViewSet, basename='Notifications')

urlpatterns = [
    path('auth/register/', register_user, name='register-user'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
    path('summary/<int:project_id>/', project_summary, name='project-summary'),
    path('report/cost/<int:project_id>/', cost_report, name='cost-report'),
    path('report/pdf/<int:project_id>/', pdf_report, name='pdf-report'),
    path('report/alerts/<int:project_id>/', material_alerts, name='material-alerts'),
    path('projects/<int:pk>/weather/', ProjectWeatherView.as_view(), name='project-weather'),
    path('projects/<int:pk>/weather-alert/', ProjectWeatherAlertView.as_view(), name='weather-alert'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh-token'),
]

urlpatterns += router.urls