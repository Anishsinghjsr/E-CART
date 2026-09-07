from django.urls import path

from .views import (
    CheckoutView,
    MyOrdersView,
    OrderDetailView,
)


urlpatterns = [

    path(
        "checkout/",
        CheckoutView.as_view(),
        name="checkout"
    ),

    path(
        "",
        MyOrdersView.as_view(),
        name="my-orders"
    ),

    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail"
    ),

]