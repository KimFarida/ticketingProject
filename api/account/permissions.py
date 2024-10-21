from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser

class IsMerchant(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'Merchant'

class IsAgent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'Agent'