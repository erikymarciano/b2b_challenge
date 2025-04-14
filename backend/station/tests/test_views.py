from django.test import TestCase
from rest_framework.test import APIClient
from station.models import Station, PickupRequest, ActionHistory

class StationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_criar_estacao(self):
        station = Station.objects.create(name="Estação A", volume=10)
        self.assertEqual(station.name, "Estação A")
        self.assertEqual(station.volume, 10)

    def test_gera_pedido_automatico(self):
        station = Station.objects.create(name="Estação B", volume=50)
        response = self.client.patch(f"/api/stations/{station.id}/", {"volume": 85}, format="json")
        self.assertEqual(response.status_code, 200)

        self.assertTrue(PickupRequest.objects.filter(station=station).exists())
        self.assertTrue(ActionHistory.objects.filter(station=station, action="REQUEST").exists())

    def test_cancela_pedido_automatico(self):
        station = Station.objects.create(name="Estação C", volume=85)
        PickupRequest.objects.create(station=station, confirmed=False)
        response = self.client.patch(f"/api/stations/{station.id}/", {"volume": 60}, format="json")
        self.assertEqual(response.status_code, 200)

        self.assertFalse(PickupRequest.objects.filter(station=station).exists())
        self.assertTrue(ActionHistory.objects.filter(station=station, action="CANCEL").exists())

    def test_confirmar_coleta(self):
        station = Station.objects.create(name="Estação D", volume=90)
        pickup = PickupRequest.objects.create(station=station)

        response = self.client.post(f"/api/stations/{station.id}/confirm_pickup/")
        self.assertEqual(response.status_code, 200)

        pickup.refresh_from_db()
        self.assertIsNotNone(pickup.created_at)
        self.assertTrue(ActionHistory.objects.filter(station=station, action="CONFIRM").exists())
