from django.db import models

class Station(models.Model):
    name = models.CharField(max_length=100)
    volume = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

class PickupRequest(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='pickup_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido de coleta para {self.station.name} - Confirmado: {self.confirmed}"

class ActionHistory(models.Model):
    ACTIONS = [
        ('FILL', 'Preenchimento'),
        ('REQUEST', 'Pedido de Coleta'),
        ('CANCEL', 'Cancelamento de Coleta'),
        ('CONFIRM', 'Confirmação de Coleta'),
    ]
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='histories')
    action = models.CharField(max_length=10, choices=ACTIONS)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.station.name} - {self.get_action_display()} - {self.timestamp}"
