import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import styles from './InputModal.module.css';

const InputModal = ({ open, title, defaultValue = '', onClose, onConfirm }) => {
  const [input, setInput] = useState(defaultValue);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) setShouldRender(true);
  }, [open]);

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    setSnackbar({ open: true, message: 'Operación cancelada', severity: 'warning' });
    onClose();
  };

  const handleAccept = () => {
    const trimmed = input.trim();
    if (trimmed) {
      const isEdit = !!defaultValue;
      setSnackbar({
        open: true,
        message: isEdit ? 'Contenido actualizado exitosamente' : 'Contenido agregado exitosamente',
        severity: 'success',
      });
      onConfirm(trimmed);
    }
  };

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // delay pequeño para permitir animaciones de salida si lo deseas
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      {shouldRender && open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.titule}>{title}</h3>
            <textarea
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
              placeholder="Escribe aquí..."
            />
            <div className={styles.actions}>
              <button onClick={handleCancel}>Cancelar</button>
              <button onClick={handleAccept} disabled={!input.trim()}>Aceptar</button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InputModal;
