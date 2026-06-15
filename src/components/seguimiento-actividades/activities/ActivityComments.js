"use client";

import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { confirmAction } from "../lib/confirmations";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import styles from "./ActivityComments.module.css";

export default function ActivityComments({ comments = [], onAdd, disabled = false }) {
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (disabled) return;
    const accepted = await confirmAction({
      title: "Agregar comentario",
      message: "El comentario quedara registrado en el historial de seguimiento de la actividad.",
      confirmLabel: "Agregar",
      tone: "success"
    });
    if (!accepted) return;
    setSaving(true);
    await onAdd(comment);
    setComment("");
    setSaving(false);
  }

  return (
    <section id="comments" className={styles.section}>
      <div className={styles.header}>
        <h2>Comentarios y observaciones generales</h2>
      </div>
      <div className={styles.list}>
        {comments.length === 0 ? (
          <p className={styles.empty}>Sin comentarios registrados.</p>
        ) : (
          comments.map((item) => (
            <article key={item.id} className={styles.item}>
              <p>{item.comment}</p>
              <span>
                {item.created_by_name} · {new Date(item.created_at).toLocaleString("es-MX")}
              </span>
            </article>
          ))
        )}
      </div>
      {disabled ? (
        <p className={styles.empty}>La actividad ya fue concluida y no permite nuevos comentarios.</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <Textarea
            label="Nuevo comentario"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
          />
          <Button type="submit" icon={MessageSquarePlus} disabled={saving}>
            Agregar comentario
          </Button>
        </form>
      )}
    </section>
  );
}
