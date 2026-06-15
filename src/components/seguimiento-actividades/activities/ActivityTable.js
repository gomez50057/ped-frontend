import { Clock, Eye, History, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ACTIVITY_STATUS, PRIORITIES } from "../lib/constants";
import { canExtendActivity } from "../lib/permissions";
import Button from "../ui/Button";
import styles from "./ActivityTable.module.css";

const BASE_PATH = "/seguimiento-actividades";

export default function ActivityTable({ activities = [], currentUser, onExtend }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Actividad</th>
            <th>Responsable</th>
            <th>Proyecto</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Fecha final</th>
            <th>Ultima modificacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activities.length === 0 ? (
            <tr>
              <td colSpan="8" className={styles.empty}>
                Sin actividades para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            activities.map((activity) => (
              <tr key={activity.id}>
                <td>
                  <strong>{activity.title}</strong>
                  <span>{activity.description || "Sin descripcion"}</span>
                </td>
                <td>{activity.assigned_to_name}</td>
                <td>{activity.project_name || "Sin proyecto"}</td>
                <td>
                  <span className={`status ${activity.status}`}>
                    {ACTIVITY_STATUS[activity.status] || activity.status}
                  </span>
                </td>
                <td>{PRIORITIES[activity.priority] || activity.priority}</td>
                <td>{activity.due_date || "Sin fecha"}</td>
                <td>{new Date(activity.updated_at).toLocaleString("es-MX")}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`${BASE_PATH}/actividades/${activity.id}`} title="Ver detalle">
                      <Eye size={18} />
                    </Link>
                    {activity.status !== "completed" ? (
                      <Link href={`${BASE_PATH}/actividades/${activity.id}#comments`} title="Agregar observacion">
                        <MessageSquare size={18} />
                      </Link>
                    ) : null}
                    <Link href={`${BASE_PATH}/actividades/${activity.id}#history`} title="Ver historial">
                      <History size={18} />
                    </Link>
                    {canExtendActivity(currentUser) && activity.status !== "completed" ? (
                      <Button variant="ghost" size="sm" icon={Clock} onClick={() => onExtend(activity)}>
                        Aplazar
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
