from decimal import Decimal

from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        # Get user's cart
        try:
            cart = Cart.objects.get(
                user=request.user
            )
        except Cart.DoesNotExist:
            return Response(
                {
                    "detail": "Cart not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Get cart items
        cart_items = cart.items.select_related(
            "product"
        ).all()

        # Check empty cart
        if not cart_items.exists():
            return Response(
                {
                    "detail": "Your cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total and check stock
        total_amount = Decimal("0.00")

        for item in cart_items:

            # Check product active
            if not item.product.is_active:
                return Response(
                    {
                        "detail": (
                            f"{item.product.name} "
                            "is no longer available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check stock
            if item.quantity > item.product.stock:
                return Response(
                    {
                        "detail": (
                            f"Only {item.product.stock} "
                            f"{item.product.name} available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate total
            total_amount += (
                item.product.price * item.quantity
            )

        # Create order
        order = Order.objects.create(
            user=request.user,
            status="PENDING",
            total_amount=total_amount
        )

        # Create order items and reduce stock
        for item in cart_items:

            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
                subtotal=(
                    item.product.price * item.quantity
                )
            )

            # Reduce product stock
            item.product.stock -= item.quantity

            item.product.save(
                update_fields=["stock"]
            )

        # Empty cart
        cart_items.delete()

        # Return order
        return Response(
            {
                "message": "Order created successfully.",
                "order": OrderSerializer(order).data
            },
            status=status.HTTP_201_CREATED
        )


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).prefetch_related(
            "items__product"
        ).order_by(
            "-created_at"
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            order = Order.objects.prefetch_related(
                "items__product"
            ).get(
                id=pk,
                user=request.user
            )

        except Order.DoesNotExist:
            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )