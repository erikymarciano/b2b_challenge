import { useEffect, useState } from "react";
import { fetchStations } from "../services/stationService";
import StationCard from "../components/StationCard";
import { Container, Grid, Typography } from "@mui/material";

interface Station {
  id: number;
  name: string;
  volume: number;
}

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);

  const reloadStations = async () => {
    const data = await fetchStations();
    setStations(data);
  };

  useEffect(() => {
    const loadStations = async () => {
      const data = await fetchStations();
      setStations(data);
    };
    loadStations();
  }, []);

  return (
    <Container maxWidth={false} sx={{ px: 4 }}>
      <Typography marginY={4} variant="h4">Estações de Armazenamento</Typography>

      <Grid container spacing={2}>
        {stations.map((station) => (
          <Grid item xs={12} sm={6} md={4} key={station.id}>
            <StationCard station={station} onVolumeUpdated={reloadStations} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
