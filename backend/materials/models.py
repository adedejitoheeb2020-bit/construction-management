from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
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
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pic', null=True, blank=True)
    ROLE_CHOICES = [
        ('pending', 'Pending Approval'),
        ('admin', 'Admin'),
        ('engineer', 'Engineer'),
        ('junior_engineer', 'Junior Engineer'),
        ('store_keeper', 'Store Keeper'),
        ('surveyor', 'Surveyor'),
        ('manager', 'Project Manager'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='pending')
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"

class Project(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    start_date = models.DateField()
    expected_end_date = models.DateField(null=True, blank=True)
    workers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_projects', blank=True)
    storekeeper = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='store_projects')

    def __str__(self):
        return self.name

class Material(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    cost_per_unit = models.FloatField()
    co2_factor = models.FloatField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='materials', null=True, blank=True)

    def __str__(self):
        return self.name

class MaterialUsage(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    material_supplied = models.FloatField(default=0)
    quantity_used = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return f"{self.project.name} - {self.material.name}"

    @property
    def remaining_material(self):
        return self.material_supplied - self.quantity_used

    @property
    def usage_percentage(self):
        if self.material_supplied == 0:
            return 0
        return (self.quantity_used / self.material_supplied) * 100


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
