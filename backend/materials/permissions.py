from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Project

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsStorekeeperOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.project.storekeeper == request.user

def user_has_role(user, role_name):
    return user.groups.filter(name=role_name).exists()

class IsAssistantEngineer(BasePermission):
    def has_permission(self, request, view):
        return user_has_role(request.user, 'AssistantEngineer')

