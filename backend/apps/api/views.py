from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema


class HelloView(APIView):
    """
    Public hello endpoint - accessible without authentication
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        description="Public hello endpoint",
        responses={200: {"description": "Success", "example": {"message": "Hello, World!"}}},
    )
    def get(self, request):
        return Response({"message": "Hello, World!"}, status=status.HTTP_200_OK)


class HelloDearView(APIView):
    """
    Authenticated hello endpoint - requires authentication
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        description="Authenticated hello endpoint",
        responses={200: {"description": "Success", "example": {"message": "Hello, dear user!"}}},
    )
    def get(self, request):
        return Response({
            "message": f"Hello, dear {request.user.username}!",
            "user": request.user.username
        }, status=status.HTTP_200_OK)
