from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Project

class IsStorekeeperOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.project.storekeeper == request.user
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        project_id = request.data.get('project')
        if not project_id:
            return False
        try:
            project = Project.objects.get(id=project_id)
            return project.storekeeper == request.user
        except Project.DoesNotExist:
            return False

