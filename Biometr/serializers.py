from django.urls import path, include
import Biometr.models as models
from rest_framework import serializers

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Equipment
        fields = "__all__"

class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DjangoUser
        fields = "__all__"

class HumanSerializer(serializers.ModelSerializer):
    user = DjangoUserSerializer(many=False)
    class Meta:
        model = models.Human
        fields = "__all__"
    
    

class Values(serializers.ModelSerializer):
    class Meta:
        model = models.Values
        fields = "__all__"