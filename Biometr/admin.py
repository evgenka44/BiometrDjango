from django.contrib import admin
import Biometr.models as models

# Register your models here.
admin.site.register(models.Human)
admin.site.register(models.Equipment)
admin.site.register(models.Values)
admin.site.register(models.Storage)
