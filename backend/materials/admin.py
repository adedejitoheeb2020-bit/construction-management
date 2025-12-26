from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (CustomUser, Project, Material, Organization, WasteRecord,
                     Notification, ProjectMaterial, LookAheadItem, LookAheadPlan)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role',)
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Roles and Permissions', {'fields': ('role', 'is_staff', 'is_active')}),
    )

    add_fieldsets = (
    (None, {
        'classes': ('wide',),
        'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active'),
    }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Project)
admin.site.register(Material)
admin.site.register(Organization)
admin.site.register(WasteRecord)
admin.site.register(Notification)
admin.site.register(ProjectMaterial)
admin.site.register(LookAheadItem)
admin.site.register(LookAheadPlan)
# Register your models here.
