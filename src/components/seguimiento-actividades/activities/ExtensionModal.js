"use client";

import { CalendarClock, Save } from "lucide-react";
import { useState } from "react";
import { confirmAction } from "../lib/confirmations";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";
import styles from "./ExtensionModal.module.css";

export default function ExtensionModal({ open, activity, onClose, onSave }) {
  const [newDueDate, setNewDueDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const accepted = await confirmAction({
      title: "Guardar aplazamiento",
      message: "Se actualizara la fecha propuesta de entrega y quedara registrado el motivo.",
      confirmLabel: "Guardar",
      tone: "warning"
    });
    if (!accepted) return;
    setSaving(true);
    await onSave({ new_due_date: newDueDate, reason });
    setSaving(false);
    setNewDueDate("");
    setReason("");
  }

  return (
    <Modal open={open} title="Registrar aplazamiento" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.current}>
          <CalendarClock size={18} />
          <span>Fecha actual</span>
          <strong>{activity?.due_date || "Sin fecha definida"}</strong>
        </div>
        <Input
          label="Nueva fecha"
          type="date"
          value={newDueDate}
          onChange={(event) => setNewDueDate(event.target.value)}
          required
        />
        <Textarea
          label="Motivo del aplazamiento"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
        />
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" icon={Save} disabled={saving}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
