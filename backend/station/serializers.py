from rest_framework import serializers
from .models import Station, PickupRequest, ActionHistory

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'

class PickupRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupRequest
        fields = '__all__'

class ActionHistorySerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source="station.name", read_only=True)
    
    class Meta:
        model = ActionHistory
        fields = '__all__'