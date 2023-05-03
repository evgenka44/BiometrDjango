"""BiometrDjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
import Biometr.views as views
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'users', views.HumanViewSet)
router.register(r'equipments', views.EquipmentViewSet)
router.register(r'values', views.ValuesViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("users/", views.patient_list, name="patient_list"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("registration/", views.registration, name="registration"),
    path("lk/", views.lk, name="lk"),
    path("", views.index_view, name="index"),
    path('api/v1/', include(router.urls)),
    path('api/v1/update_password/', views.update_password, name="update_password"),
    path('api/v1/', include('rest_framework.urls', namespace='rest_framework')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
