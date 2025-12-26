from rest_framework import serializers
from .models import Project, Material, WasteRecord, Organization, CustomUser, Notification, WeatherAlert, \
    ProjectMaterial, LookAheadItem, LookAheadPlan
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .open_meteo import get_weather

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'url', 'created_at', 'is_read', 'related_object_id', 'related_object_type']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']
        read_only_fields = ['role']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class OrganizationalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    workers_count = serializers.IntegerField(source='workers.count', read_only=True)
    weather = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['id', 'name', 'location', 'start_date', 'expected_end_date', 'latitude', 'longitude', 'weather', 'workers_count']
        read_only_fields = ['weather']

    def get_weather(self, obj):
        try:
            return get_weather(obj.latitude, obj.longitude)
        except Exception:
            return None

class ProjectMaterialSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source='material.name', read_only=True)
    remaining_material = serializers.SerializerMethodField()
    usage_percentage = serializers.SerializerMethodField()
    class Meta:
        model = ProjectMaterial
        fields = ['material_required', 'cost_per_unit', 'material_supplied',
                  'quantity_used', 'remaining_material', 'usage_percentage', 'material_name']

    def get_remaining_material(self, obj):
        return obj.remaining_material

    def get_usage_percentage(self, obj):
        return obj.usage_percentage


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class LookAheadItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LookAheadItem
        fields = ["id", "material_name", "quantity_needed", "unit", "remarks"]

class LookAheadPlanSerializer(serializers.ModelSerializer):
    items = LookAheadItemSerializer(many=True)
    created_by_name = serializers.CharField(source='created_by.get_name', read_only=True)

    class Meta:
        model = LookAheadPlan
        fields = ["id", "project", "created_by", "created_by_name", "items", "week_start", "week_end",
                  "site_lead_status", "procurement_status", "procurement_comment", "created_at"]
        read_only_fields = ["created_by", "site_lead_status", "procurement_status"]

    def validate(self, data):
        user = self.context['request'].user
        project = data.get('project')

        if not project.workers.filter(id=user.id).exists():
            raise serializers.ValidationError("Access Denied: You are not assigned to this project's team.")
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        lookahead = LookAheadPlan.objects.create(created_by=user, **validated_data)

        for item in items_data:
            LookAheadItem.objects.create(lookahead=lookahead, **item)
        return lookahead




class WasteRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteRecord
        fields = '__all__'

class WeatherAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherAlert
        fields = ['id', 'project', 'message', 'alert_date']

