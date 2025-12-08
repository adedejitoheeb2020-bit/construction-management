from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Project, Material, Organization, MaterialUsage, WasteRecord, Notification

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

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
admin.site.register(MaterialUsage)
admin.site.register(WasteRecord)
admin.site.register(Notification)
# Register your models here.
