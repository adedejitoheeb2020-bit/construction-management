from rest_framework import serializers
from .models import Project, Material, MaterialUsage, WasteRecord, Organization, CustomUser, Notification, WeatherAlert
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .open_meteo import get_weather

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'created_at', 'is_read']

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
    weather = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['id', 'name', 'location', 'start_date', 'expected_end_date', 'latitude', 'longitude', 'weather']
        read_only_fields = ['weather']

    def get_weather(self, obj):
        try:
            return get_weather(obj.latitude, obj.longitude)
        except Exception:
            return None

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class MaterialUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialUsage
        fields = '__all__'

class WasteRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteRecord
        fields = '__all__'

class WeatherAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherAlert
        fields = ['id', 'project', 'message', 'alert_date']

