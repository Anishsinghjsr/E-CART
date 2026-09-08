
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse

from django.conf import settings
from django.views.static import serve


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


# =========================================================
# MEDIA FILES
# =========================================================

urlpatterns += [
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {
            "document_root": settings.MEDIA_ROOT,
        },
    ),
]

