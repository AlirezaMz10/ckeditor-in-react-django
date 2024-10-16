# Integrating CKeditor with Django and React
## Introduction

This project demonstrates how to seamlessly incorporate the powerful CKeditor rich text editor into a web application built with Django on the backend and React on the frontend. CKeditor offers a versatile and user-friendly text editing experience, making it a popular choice for applications that require rich content creation.

Let's dive in.

## Installation  

To set up the project, you'll need to install the following dependencies:  

- **Django:**  
  `pip install django`  
  Django is a high-level Python web framework that enables rapid development of secure and maintainable websites. It follows the model-template-views (MTV) architectural pattern and includes various built-in features for handling user authentication, database management, and web routing.  

- **django-ckeditor:**  
  `pip install django-ckeditor`  
  This is a Django application that integrates the CKEditor rich text editor into your Django project, allowing for enhanced text editing capabilities. In this project, we will utilize this package to provide a user-friendly interface for content creation, leveraging its wide array of formatting tools and features.  

- **django-cors-headers:**  
  `pip install django-cors-headers`  
  This package is used to handle Cross-Origin Resource Sharing (CORS) in Django applications. It enables your Django backend to accept requests from different origins, which is essential when your frontend (built with React) and backend (Django) are hosted on different domains or ports during development.
<br />
 
## Configuration  

To properly configure your Django application for integrating TinyMCE and ensuring seamless communication with the React frontend, you'll need to make several adjustments in the `settings.py` file. Below is the breakdown of the necessary configurations:  

### settings.py 
<br/>

**Installed Applications**:  
   In the `INSTALLED_APPS` section, include necessary packages:  
   - `"app"`: This refers to your custom Django application where your models and views will reside.  
   - `"corsheaders"`: Required for handling Cross-Origin Resource Sharing, allowing your React app to communicate with the Django backend.  
   - `"ckeditor"` and `"ckeditor_uploader"`: These are essential for enabling the CKEditor functionalities, allowing rich text editing and file uploads.  
   - `"rest_framework"`: If you’re using Django Rest Framework to build your API, it needs to be included here.  

```python
INSTALLED_APPS = [
    ...
    "app",
    "corsheaders",
    "ckeditor",
    "ckeditor_uploader",
    "rest_framework"
]
```
<br/>

**Middleware**:  
   The `MIDDLEWARE` section needs to include `corsheaders.middleware.CorsMiddleware` to ensure that CORS is processed correctly. This allows the Django server to accept requests from your React frontend running on a different port.  

```python
MIDDLEWARE = [
    ...
    # 'django.middleware.csrf.CsrfViewMiddleware',
    ...
    'corsheaders.middleware.CorsMiddleware',
]
```
<br/>

**CORS Configuration**:  
   - `CORS_ORIGIN_ALLOW_ALL = True`: This setting allows all origins to make requests to your Django backend. For production environments, it is advisable to specify allowed origins more restrictively.  
   - `CORS_ALLOWED_ORIGINS`: This list includes the origins from which your frontend is allowed to access the backend, specifically allowing connections from `http://127.0.0.1:3000` and `http://localhost:3000` for local development.  

```python
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]
```
<br/>


**Media Configuration**:  
   - `MEDIA_ROOT`: This specifies the directory where uploaded media files will be stored. In this case, it is set to a `media` folder located in the base directory of your project.  
   - `MEDIA_URL`: This sets the base URL for accessing the uploaded media files. The `/media/` URL prefix is commonly used in Django applications.  

```python
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
```
<br/>


**Data Upload Settings**:  
   - `DATA_UPLOAD_MAX_MEMORY_SIZE`: This defines the maximum size (in bytes) that a request's body can be for data uploads. Here, it is configured to allow up to 10 MB of data.  

```python
DATA_UPLOAD_MAX_MEMORY_SIZE = 10000000
```
<br/>


**CKEditor Configuration**:  
   - `CKEDITOR_UPLOAD_PATH`: Defines the upload path for files uploaded through the CKEditor, set to an `"uploads/"` directory.  
   - `CKEDITOR_IMAGE_BACKEND`: This specifies the library backend to be used for image uploads, with `pillow` being a widely-used choice.  
   - `CKEDITOR_STORAGE_BACKEND`: Specifies `FileSystemStorage` to store files on the filesystem.  
   - `CKEDITOR_CONFIGS`: This dictionary allows for custom configurations for the CKEditor. In this example, the `filebrowserImageUploadUrl` parameter is set to route image uploads to the `/ckeditor/upload/` endpoint.  

```python
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_IMAGE_BACKEND = "pillow"
CKEDITOR_STORAGE_BACKEND = 'django.core.files.storage.FileSystemStorage'
CKEDITOR_CONFIGS = {
    "default": {
        "filebrowserImageUploadUrl": "/ckeditor/upload/",
    },
}
```
<br/>

By setting up these configurations, you ensure that your Django backend is properly equipped to handle requests from your React frontend, manage media files, and provide functionalities required for rich text editing using CKeditor.

## BackEnd

### urls.py (project)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include("app.urls")),
]
```
### urls.py (app)

```python
from django.contrib import admin
from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('item/create/', views.create_item),
    path('item/edit/<int:id>/', views.edit_item),
    path('items/view/', views.view_items),
    path('upload/', views.upload_image, name='upload_image'),  
]
```
We need to add the static urls to our urlpatterns so we can access the static folder using our http://127.0.0.1:8000/
```python
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```