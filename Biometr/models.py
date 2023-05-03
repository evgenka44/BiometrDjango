from django.db import models
from django.core import validators
from django.contrib.auth.models import User as DjangoUser

class Human(models.Model):
    CHOICES = [
        ("doctor", "Доктор"),
        ("patient", "Пациент"),
    ]
    
    # password = models.CharField(max_length=255, verbose_name="Пароль", validators=[validators.MinLengthValidator(4)])
    # username = models.CharField(max_length=255, verbose_name="Логин", unique=True, validators=[
    #     validators.MinLengthValidator(4),
    # ])
    # created_at = models.DateTimeField(verbose_name="Когда создан", auto_now_add=True)
    # email = models.EmailField(max_length=255, verbose_name="Электронная почта", unique=True)
    # firstname = models.CharField(max_length=255, verbose_name="Имя", default="Имя")
    # surname = models.CharField(max_length=255, verbose_name="Фамилия", default="Фамилия")
    user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE)
    type = models.CharField(
        max_length=255,
        verbose_name="Тип пользователя",
        choices=CHOICES,
    )
    middlename = models.CharField(max_length=255, verbose_name="Отчество", default="Отчество")
    date_of_birth = models.DateField(verbose_name="Дата рождения", null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars", verbose_name="Аватарка", default='../static/image/no_photography.png')
    equipments = models.ManyToManyField("Equipment", verbose_name="Оборудование", null=True, blank=True)
    anamnesis = models.TextField(verbose_name="Анамнез", null=True, blank=True)
    diagnosis = models.TextField(verbose_name="Диагноз", null=True, blank=True)
    address = models.CharField(max_length=512, verbose_name="Адрес", null=True, blank=True)
    doctor = models.ForeignKey(
        verbose_name="Лечащий врач",
        to="self", 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True)
    def __str__(self):
        return f"{self.user} {self.type}"


class Equipment(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название оборудования")

    def __str__(self):
        return f"{self.name}"


class Storage(models.Model):
    id_equipment = models.OneToOneField("Equipment", primary_key=True, verbose_name="Тип оборудования",
                                     on_delete=models.DO_NOTHING)
    count = models.IntegerField(verbose_name="Количество")

    def __str__(self):
        return f"{self.count}"


class Values(models.Model):
    id_type = models.ForeignKey("Equipment", verbose_name="Тип оборудования", on_delete=models.DO_NOTHING)
    id_user = models.ForeignKey("Human", verbose_name="Пользователь", on_delete=models.CASCADE)
    time = models.DateTimeField(verbose_name="Время измерения")
    value = models.CharField(max_length=255, verbose_name="Значение")

    def __str__(self):
        return f"{self.id_type.name}, {self.id_user.surname}, {self.time},{self.value}"
