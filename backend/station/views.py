from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Station, PickupRequest, ActionHistory
from .serializers import StationSerializer, ActionHistorySerializer

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        volume = instance.volume

        ActionHistory.objects.create(
            station=instance,
            action='FILL',
            description=f"Volume atualizado para {volume}%"
        )

        pending_request = PickupRequest.objects.filter(station=instance, confirmed=False).first()

        if volume >= 80 and not pending_request:
            PickupRequest.objects.create(station=instance)
            ActionHistory.objects.create(
                station=instance,
                action='REQUEST',
                description="Pedido de coleta gerado automaticamente."
            )

        elif volume < 80 and pending_request:
            pending_request.delete()
            ActionHistory.objects.create(
                station=instance,
                action='CANCEL',
                description="Pedido de coleta excluído automaticamente."
            )

    @action(detail=True, methods=['post'])
    def confirm_pickup(self, request, pk=None):
        station = self.get_object()
        pending = PickupRequest.objects.filter(station=station, confirmed=False).first()

        if not pending:
            return Response({'detail': 'Nenhum pedido de coleta pendente.'}, status=400)

        pending.confirmed = True
        pending.save()

        station.volume = 0
        station.save()

        ActionHistory.objects.create(
            station=station,
            action='CONFIRM',
            description="Coleta confirmada e volume resetado para 0%"
        )

        return Response({'detail': 'Coleta confirmada com sucesso.'})
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        histories = ActionHistory.objects.filter(station_id=pk).order_by('-timestamp')
        serializer = ActionHistorySerializer(histories, many=True)
        return Response(serializer.data)

