from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "REDOPLY API is running"
    })


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/health/",
        health_check
    ),

    path(
        "api/users/",
        include("users.urls")
    ),

    path(
        "api/products/",
        include("products.urls")
    ),

    path(
        "api/cart/",
        include("cart.urls")
    ),

    path(
        "api/orders/",
        include("orders.urls")
    ),
]


# Media files - Development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )