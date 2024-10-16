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

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)