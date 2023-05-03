from django.http import HttpResponse
from django.shortcuts import render, redirect
import Biometr.models as models
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
import Biometr.serializers as serializers
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
import json
from django.db.models import Q
from rest_framework.decorators import action
from Biometr.forms import HumanCreationForm
from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout


def patient_list(request):
    users = models.Human.objects.all()
    if request.user.is_authenticated:
        user_id = request.user.id
        current_user = users.get(id=user_id)
        context = {
            "current_user": current_user,
            "patient_list": current_user if (current_user.type == "Patient") else users.filter(doctor=current_user.id)
        }
        return render(request, "patient_list.html", context)
    else:
        return redirect("login")


def index_view(request):
    if request.user.is_authenticated:
        user_id = request.user.id
        current_user = models.Human.objects.get(id=user_id)
    else:
        current_user = None
    context = {
        "current_user": current_user,
    }
    return render(request, "index.html", context)


@csrf_exempt
def login(request):
    if request.method == "GET":
        return render(request, "login.html")
    else:
        json_dict = json.loads(request.body.decode('utf-8'))
        username = json_dict['username']
        password = json_dict['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            try:
                models.Human.objects.get(id=user.id)
            except ObjectDoesNotExist:
                return HttpResponse(json.dumps(False))
            django_login(request, user)
            return HttpResponse(json.dumps(True))
        else:
            return HttpResponse(json.dumps(False))

def update_password(request):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps(False))
    if request.method == "POST":
        user: models.DjangoUser = request.user
        request_body = json.loads(request.body)
        print(request_body)
        new_password = request_body["new_password"]
        old_password = request_body["old_password"]
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            django_login(request, user)
            return HttpResponse(json.dumps(True))
        else:
            return HttpResponse(json.dumps(False))

@csrf_exempt
def registration(request):
    if request.method == "GET":
        form = HumanCreationForm()
        context = {
            "form": form
        }
        return render(request, "registration.html", context)
    elif request.method == "POST":
        request_body = json.loads(request.body)
        doctor_id = request_body.pop("doctor")
        doctor = None
        if doctor_id != None:
            doctor = models.Human.objects.get(id=doctor_id)

        username = request_body.pop("username")
        email = request_body.pop("email")
        password = request_body.pop("password")
        try:
            new_django_user = models.DjangoUser.objects.create_user(
                username=username,
                email=email,
                password=password,
            )

            models.Human.objects.create(
                **request_body,
                doctor=doctor,
                user=new_django_user,
                id=new_django_user.id,
            )
        except:
            return HttpResponse(json.dumps(False))

        user = authenticate(username=username, password=password)
        if user is not None:
            django_login(request, user)
        else: raise ValueError("User is None")

        return HttpResponse(json.dumps(True))


def lk(request):
    if request.user.is_anonymous:
        return redirect("login")
    
    users = models.Human.objects.all()

    user_id = request.user.id
    current_user = users.get(id=user_id)
    context = {
        "current_user": current_user,
    }
    return render(request, "lk.html", context)

def logout(request):
    if request.user.is_anonymous:
        return redirect("login")
    django_logout(request)
    return HttpResponse(json.dumps(True))


class HumanViewSet(viewsets.ModelViewSet):
    queryset = models.Human.objects.all()
    serializer_class = serializers.HumanSerializer

    @action(detail=True, methods=['post'])
    def upload_avatar(self, request, pk):
        try:
            print(request.data)
            image = request.data['image']
            current_user = models.Human.objects.get(id=pk)
            current_user.avatar = image
            current_user.save()
            return Response(json.dumps("Аватарка успешно изменена"))
        except KeyError:
            raise Exception('Request has no resource file attached with name "image"')
        
        

    def partial_update(self, request, *args, **kwargs):
        body = json.loads(request.body)
        if "firstname" in body:
            firstname = body.pop("firstname")
            current_user: models.Human = self.get_object()
            current_django_user = current_user.user
            current_django_user.first_name = firstname
            current_django_user.save()
        
        if "surname" in body:
            surname = body.pop("surname")
            current_user: models.Human = self.get_object()
            current_django_user = current_user.user
            current_django_user.last_name = surname
            current_django_user.save()

        if "email" in body:
            email = body.pop("email")
            current_user: models.Human = self.get_object()
            current_django_user = current_user.user
            current_django_user.email = email
            current_django_user.save()

        if "equipment_id" in body:
            equipment_id = body.pop("equipment_id")
            current_user: models.Human = self.get_object()
            if equipment_id >= 0:
                current_user.equipments.add(models.Equipment.objects.get(id=equipment_id))
            else:
                current_user.equipments.remove(models.Equipment.objects.get(id=-equipment_id))
            current_user.save()

        print(body)
        return super().partial_update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        filter = {}
        type = self.request.query_params.get("type")
        patients_of = self.request.query_params.get("patients_of")
        second_filter = None
        if type is not None:
            filter["type"] = type

        if patients_of is not None:
            filter["doctor"] = models.Human.objects.get(id=patients_of)
            second_filter = filter.copy()
            second_filter["doctor"] = None
        if second_filter is None:
            self.queryset = models.Human.objects.filter(Q(**filter))
        else:
            self.queryset = models.Human.objects.filter(
                Q(**filter) | Q(**second_filter))
        return super().list(request, *args, **kwargs)

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = models.Equipment.objects.all()
    serializer_class = serializers.EquipmentSerializer


class ValuesViewSet(viewsets.ModelViewSet):
    queryset = models.Values.objects.all()
    serializer_class = serializers.Values

    @action(detail=True, methods=['get'])
    def search(self, request):
        user_id = self.request.query_params.get("user_id")
        equipment_id = self.request.query_params.get("equipment_id")

        searched_values = models.Values.objects.filter(
            id_type=equipment_id, id_user=user_id)

        serializer = self.get_serializer(searched_values, many=True)
        return Response(serializer.data)
