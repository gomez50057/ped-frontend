"use client";

import { Pencil, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { confirmAction } from "../lib/confirmations";
import { canAddBossObservation } from "../lib/permissions";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import styles from "./BossObservations.module.css";

export default function BossObservations({
  observations = [],
  currentUser,
  onAdd,
  onUpdate,
  onDelete,
  disabled = false
}) {
  const [observation, setObservation] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  async function handleAdd(event) {
    event.preventDefault();
    if (disabled) return;
    const accepted = await confirmAction({
      title: "Agregar observacion",
      message: "La observacion quedara visible en el seguimiento de esta actividad.",
      confirmLabel: "Agregar",
      tone: "success"
    });
    if (!accepted) return;
    await onAdd(observation);
    setObservation("");
  }

  function canEdit(item) {
    return !disabled && (currentUser?.role === "ADMIN" || item.created_by === currentUser?.id);
  }

  return (
    <section className={styles.section}>
      <h2>Observaciones de jefe</h2>
      <div className={styles.list}>
        {observations.length === 0 ? (
          <p className={styles.empty}>Sin observaciones de jefe.</p>
        ) : (
          observations.map((item) => (
            <article key={item.id} className={styles.item}>
              {editingId === item.id ? (
                <div className={styles.editForm}>
                  <Textarea
                    label="Editar observacion"
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                  <Button
                    icon={Save}
                    size="sm"
                    onClick={async () => {
                      const accepted = await confirmAction({
                        title: "Guardar observacion",
                        message: "Se reemplazara el texto actual de esta observacion.",
                        confirmLabel: "Guardar",
                        tone: "success"
                      });
                      if (!accepted) return;
                      await onUpdate(item.id, editingText);
                      setEditingId(null);
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              ) : (
                <>
                  <p>{item.observation}</p>
                  <span>
                    {item.created_by_name} · {new Date(item.created_at).toLocaleString("es-MX")}
                  </span>
                  {canEdit(item) ? (
                    <div className={styles.actions}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Pencil}
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingText(item.observation);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={async () => {
                          const accepted = await confirmAction({
                            title: "Eliminar observacion",
                            message: "La observacion dejara de mostrarse en la actividad.",
                            confirmLabel: "Eliminar",
                            tone: "danger"
                          });
                          if (!accepted) return;
                          onDelete(item.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
            </article>
          ))
        )}
      </div>
      {disabled ? (
        <p className={styles.empty}>La actividad ya fue concluida y no permite nuevas observaciones.</p>
      ) : canAddBossObservation(currentUser) ? (
        <form className={styles.form} onSubmit={handleAdd}>
          <Textarea
            label="Nueva observacion de jefe"
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            required
          />
          <Button type="submit" icon={Save}>
            Agregar observacion
          </Button>
        </form>
      ) : null}
    </section>
  );
}
