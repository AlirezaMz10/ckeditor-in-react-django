from django.http import JsonResponse
from . import models
import json
from django.core.files.storage import FileSystemStorage  


def create_item(request):
    # if not request.user.is_authenticated or not request.user.is_superuser:   
    #     return JsonResponse({"message":"user is not authenticated"})
    
    data = json.loads(request.body.decode("utf-8"))

    name = data["name"]
    description = data["description"]

    models.Item.objects.create(
        name = name,
        description = description
    )
    
    return JsonResponse({"error":0, "message":"created succesfully"})

def edit_item(request,id):
    # if not request.user.is_authenticated or not request.user.is_superuser:   
    #     return JsonResponse({"message":"user is not authenticated"})
    
    data = json.loads(request.body.decode("utf-8"))

    name = data["name"]
    description = data["description"]

    models.Item.objects.filter(id=id).update(
        name = name,
        description = description
    )
    
    return JsonResponse({"error":0, "message":"edited succesfully"})


def view_items(request):
    return JsonResponse({"error":0, "message":"created succesfully", "data":[{"id":item.id, "name":item.name, "description":item.description} for item in models.Item.objects.all()]})

def upload_image(request):  

    if request.method == 'POST' and request.FILES['upload']:  
        upload_file = request.FILES['upload']  
        fs = FileSystemStorage()  
        filename = fs.save(upload_file.name, upload_file) 
        file_url = fs.url(filename)  

        return JsonResponse({'url': file_url})  
    return JsonResponse({'error': 'Invalid request'}, status=400)