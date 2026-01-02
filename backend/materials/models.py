from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    url = models.URLField(null=True, blank=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=100, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title}: {self.user.username}"

class Organization(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, default="A.T Construction Company")
    profile_pic = models.ImageField(upload_to='profile_pic', null=True, blank=True)
    ROLE_CHOICES = [
        ('pending', 'Pending Approval'),
        ('admin', 'Admin'),
        ('engineer', 'Engineer'),
        ('junior_engineer', 'Junior Engineer'),
        ('store_keeper', 'Store Keeper'),
        ('surveyor', 'Surveyor'),
        ('manager', 'Project Manager'),
        ('procurement', 'Procurement'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='pending')
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"

class Project(models.Model):
    workers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_projects', blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, default="A.T CONSTRUCTION COMPANY")
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    start_date = models.DateField()
    expected_end_date = models.DateField(null=True, blank=True)
    materials = models.ManyToManyField("Material", through="ProjectMaterial", related_name='projects')

    def __str__(self):
        return self.name

class Material(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, default="1")
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    co2_factor = models.FloatField()

    def __str__(self):
        return self.name

class ProjectMaterial(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    material_required = models.FloatField(default=0)
    cost_per_unit = models.FloatField()
    material_supplied = models.FloatField(default=0)
    quantity_used = models.FloatField(default=0)

    @property
    def remaining_material(self):
        return self.material_supplied - self.quantity_used

    @property
    def usage_percentage(self):
        if self.material_supplied == 0:
            return 0
        return (self.quantity_used / self.material_supplied) * 100

    def __str__(self):
        return f"{self.material.name} {self.project.name}"

class LookAheadPlan(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="lookahead")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="submitted_lookaheads")
    week_start = models.DateField()
    week_end = models.DateField()
    site_lead_status = models.CharField(max_length=20, choices=[
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ], default="pending")
    site_lead_comment = models.TextField(blank=True)
    procurement_status = models.CharField(max_length=20, choices=[
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ], default="pending")
    procurement_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def is_fully_approved(self):
        return (
            self.site_lead_status == "approved"
            and self.procurement_status == "approved"
        )

    def __str__(self):
        return f"{self.project.name} ({self.week_start} => {self.week_end})"

class LookAheadItem(models.Model):
    lookahead = models.ForeignKey(LookAheadPlan, on_delete=models.CASCADE, related_name="items")
    material_name = models.CharField(max_length=100)
    quantity_needed = models.FloatField()
    unit = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.material_name} - {self.quantity_needed} {self.unit}"



class WasteRecord(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    waste_quantity = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return f"Waste of {self.material.name} in {self.project.name}"

class WeatherAlert(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='weather_alerts')
    message = models.TextField()
    alert_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Alert for {self.project.name} on {self.alert_date}"
