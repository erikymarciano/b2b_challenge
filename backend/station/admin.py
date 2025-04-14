from django.contrib import admin
from .models import Station, PickupRequest, ActionHistory

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'volume', 'last_updated')
    list_filter = ('last_updated',)
    search_fields = ('name',)
    

@admin.register(PickupRequest)
class PickupRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'station', 'confirmed', 'created_at')
    list_filter = ('confirmed', 'created_at')
    search_fields = ('station__name',)

@admin.register(ActionHistory)
class ActionHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'station', 'action', 'description', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('station__name',)
