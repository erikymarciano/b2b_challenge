import {
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import {
  updateStationVolume,
  confirmStationPickup,
  fetchStationHistory,
} from "../services/stationService";
import { Station, ActionHistory } from "../types";
import HistoryModal from "./HistoryModal";


interface Props {
  station: Station;
  onVolumeUpdated: () => void;
}

export default function StationCard({ station, onVolumeUpdated }: Props) {
  const [newVolume, setNewVolume] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const hasPendingPickup = station.volume >= 80;

  useEffect(() => {
    setNewVolume("");
  }, [station.volume]);

  const fetchHistory = async () => {
    const data = await fetchStationHistory(station.id);
    setHistory(data);
    setOpenHistory(true);
  };

  const handleUpdate = async () => {
    if (
      newVolume === "" ||
      newVolume === station.volume ||
      newVolume < 0 ||
      newVolume > 100
    ) {
      return;
    }

    setLoading(true);
    try {
      await updateStationVolume(station.id, newVolume);
      setNewVolume("");
      onVolumeUpdated();
      setSnackbarOpen(true);
    } finally {
      setSnackbarMessage("Volume atualizado com sucesso!");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleConfirmPickup = async () => {
    setLoading(true);
    try {
      await confirmStationPickup(station.id);
      onVolumeUpdated();
    } finally {
      setSnackbarMessage("Coleta confirmada com sucesso!");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: "450px",
          m: 2,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{station.name}</Typography>
            <IconButton onClick={fetchHistory}>
              <InfoIcon color="primary" />
            </IconButton>
          </Stack>

          {hasPendingPickup && (
            <Alert
              icon={<WarningAmberIcon />}
              severity="warning"
              sx={{ my: 2 }}
            >
              A estação possui um pedido de coleta pendente!
            </Alert>
          )}

          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Volume Atual:</strong> {station.volume}%
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <TextField
              type="number"
              size="small"
              label="Novo Volume"
              value={newVolume}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setNewVolume(val);
              }}
              inputProps={{ min: 0, max: 100 }}
              fullWidth
            />
            <LoadingButton
              onClick={handleUpdate}
              loading={loading}
              variant="contained"
              disabled={
                newVolume === "" ||
                newVolume === station.volume ||
                newVolume < 0 ||
                newVolume > 100
              }
              sx={{ minWidth: "120px" }}
            >
              Atualizar
            </LoadingButton>
          </Stack>

          {newVolume !== "" && (newVolume < 0 || newVolume > 100) && (
            <Alert severity="error" sx={{ mt: 1 }}>
              O volume inserido deve estar entre 0 e 100.
            </Alert>
          )}

          {hasPendingPickup && (
            <LoadingButton
              onClick={handleConfirmPickup}
              loading={loading}
              variant="outlined"
              color="success"
              sx={{ mt: 2 }}
              fullWidth
            >
              Confirmar Coleta
            </LoadingButton>
          )}
        </CardContent>
      </Card>

      <HistoryModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        history={history}
        stationName={station.name}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
