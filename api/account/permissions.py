from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_admin

class IsMerchant(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Merchant').exists()

class IsAgent(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Agent').exists()