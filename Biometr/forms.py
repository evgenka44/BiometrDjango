from django import forms 
from Biometr.models import Human
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm 
from django.core.exceptions import ValidationError 
from django.forms.fields import EmailField 
from django.forms.forms import Form

class HumanCreationForm(UserCreationForm):
    username = forms.CharField(label='Логин', min_length=4, max_length=150) 
    email = forms.EmailField(label='Email') 
    password1 = forms.CharField(label='Пароль', widget=forms.PasswordInput) 
    password2 = forms.CharField(label='Подтверждение пароля', widget=forms.PasswordInput)
    type = forms.ChoiceField(label="Кем вы являетесь")
    doctor = forms.ChoiceField(label="Ваш лечащий врач")

    def username_clean(self): 
        username = self.cleaned_data['username'].lower() 
        new = User.objects.filter(username = username) 
        if new.count():
            raise ValidationError("Логин занят") 
        return username 
 
    def email_clean(self): 
        email = self.cleaned_data['email'].lower() 
        new = Human.objects.filter(email=email) 
        if new.count(): 
            raise ValidationError("Email занят") 
        return email 
 
    def clean_password2(self): 
        password1 = self.cleaned_data['password1'] 
        password2 = self.cleaned_data['password2'] 
 
        if password1 and password2 and password1 != password2: 
            raise ValidationError("Пароли не совпадают") 
        return password2 
 
    def save(self, commit = True): 
        user = User.objects.create_user( 
            self.cleaned_data['username'], 
            self.cleaned_data['email'], 
            self.cleaned_data['password1'] 
        )
        human = Human.objects.create(
            user = user,
            type = self.type,
            doctor = self.doctor,
        )
        
        return human 
