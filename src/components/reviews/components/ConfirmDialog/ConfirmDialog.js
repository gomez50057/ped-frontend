import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        background: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(18px) saturate(1.6)',
        borderRadius: '2rem',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px 0 rgba(160, 33, 67, 0.15), 0 1.5px 16px 0 rgba(160, 33, 67, 0.14)',
        minWidth: 340,
        maxWidth: 420,
        p: 2,
      },
    }}
  >
    <DialogTitle
      sx={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: "1.3rem",
        color: "#24292f",
        letterSpacing: ".5px",
        pb: 0,
        pt: 2
      }}
    >
      {title}
    </DialogTitle>
    <DialogActions
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        pb: 2,
        pt: 2
      }}
    >
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{
          color: "#691B32",
          borderColor: "#A02142",
          borderRadius: '1rem',
          borderWidth: 2,
          fontWeight: 500,
          textTransform: 'none',
          bgcolor: alpha('#f6f7fb', 0.45),
          boxShadow: 'none',
          transition: 'all .18s',
          ':hover': {
            bgcolor: alpha('#A02142', 0.10),
            borderColor: "#691B32",
          }
        }}
      >
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: '1rem',
          fontWeight: 700,
          px: 3,
          textTransform: 'none',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,.06)',
          background: 'linear-gradient(90deg,#691B32,#A02142 120%)',
          color: "#fff",
          transition: 'all .18s',
          ':hover': {
            background: 'linear-gradient(90deg,#A02142,#691B32 120%)',
            color: "#F5F3F5",
          }
        }}
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
