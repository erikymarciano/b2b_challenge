import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ActionHistory } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  history: ActionHistory[];
  stationName: string;
}

export default function HistoryModal({
  open,
  onClose,
  history,
  stationName,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Histórico da {stationName}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <List>
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhuma ação registrada até o momento.
            </Typography>
          ) : (
            history.map((h) => (
              <ListItem key={h.id} divider>
                <ListItemText
                  primary={h.description}
                  secondary={new Date(h.timestamp).toLocaleString()}
                />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
