"use client";

import { CheckCircle2, Clock, Pencil } from "lucide-react";
import { ACTIVITY_STATUS, PRIORITIES } from "../lib/constants";
import { canExtendActivity, canManageActivities } from "../lib/permissions";
import Button from "../ui/Button";
import ActivityComments from "./ActivityComments";
import BossObservations from "./BossObservations";
import ChangeHistory from "../history/ChangeHistory";
import styles from "./ActivityDetail.module.css";

export default function ActivityDetail({
  activity,
  currentUser,
  onExtend,
  onEdit,
  onComplete,
  onAddComment,
  onAddBossObservation,
  onUpdateBossObservation,
  onDeleteBossObservation
}) {
  if (!activity) return null;
  const isCompleted = activity.status === "completed";

  return (
    <div className={styles.stack}>
      <section className={styles.hero}>
        <div>
          <span className={`status ${activity.status}`}>
            {ACTIVITY_STATUS[activity.status] || activity.status}
          </span>
          <h1>{activity.title}</h1>
          <p>{activity.description || "Sin descripcion registrada."}</p>
        </div>
        <div className={styles.actions}>
          {canManageActivities(currentUser) && !isCompleted ? (
            <Button variant="secondary" icon={Pencil} onClick={onEdit}>
              Editar
            </Button>
          ) : null}
          {canExtendActivity(currentUser) && !isCompleted ? (
            <Button variant="gold" icon={Clock} onClick={onExtend}>
              Aplazar fecha
            </Button>
          ) : null}
          {canManageActivities(currentUser) && !isCompleted ? (
            <Button icon={CheckCircle2} onClick={onComplete}>
              Marcar concluida
            </Button>
          ) : null}
        </div>
      </section>

      <section className={styles.infoGrid}>
        <div>
          <span>Responsable</span>
          <strong>{activity.assigned_to_name}</strong>
        </div>
        <div>
          <span>Proyecto</span>
          <strong>{activity.project_name || "Sin proyecto"}</strong>
        </div>
        <div>
          <span>Fecha de inicio</span>
          <strong>{activity.start_date || "Sin fecha"}</strong>
        </div>
        <div>
          <span>Fecha final propuesta</span>
          <strong>{activity.due_date || "Sin fecha"}</strong>
        </div>
        <div>
          <span>Prioridad</span>
          <strong>{PRIORITIES[activity.priority] || activity.priority}</strong>
        </div>
        <div>
          <span>Ultima modificacion</span>
          <strong>{new Date(activity.updated_at).toLocaleString("es-MX")}</strong>
        </div>
      </section>

      <section className={styles.observations}>
        <h2>Observaciones generales</h2>
        <p>{activity.general_observations || "Sin observaciones generales."}</p>
      </section>

      <section className={styles.extensions}>
        <h2>Aplazamientos</h2>
        {activity.extensions?.length ? (
          activity.extensions.map((extension) => (
            <article key={extension.id}>
              <strong>
                {extension.previous_due_date || "Sin fecha"} → {extension.new_due_date}
              </strong>
              <p>{extension.reason}</p>
              <span>
                {extension.created_by_name} · {new Date(extension.created_at).toLocaleString("es-MX")}
              </span>
            </article>
          ))
        ) : (
          <p>Sin aplazamientos registrados.</p>
        )}
      </section>

      <ActivityComments comments={activity.comments || []} onAdd={onAddComment} disabled={isCompleted} />
      <BossObservations
        observations={activity.boss_observations || []}
        currentUser={currentUser}
        onAdd={onAddBossObservation}
        onUpdate={onUpdateBossObservation}
        onDelete={onDeleteBossObservation}
        disabled={isCompleted}
      />
      <ChangeHistory history={activity.history || []} />
    </div>
  );
}
