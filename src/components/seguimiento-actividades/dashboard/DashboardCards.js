import {
  AlertTriangle,
  CalendarOff,
  CheckCircle2,
  Clock3,
  ListChecks,
  PauseCircle,
  Timer
} from "lucide-react";
import styles from "./DashboardCards.module.css";

const cards = [
  { key: "total", label: "Total", icon: ListChecks },
  { key: "pending", label: "Pendientes", icon: Clock3 },
  { key: "in_progress", label: "En proceso", icon: Timer },
  { key: "postponed", label: "Aplazadas", icon: PauseCircle },
  { key: "completed", label: "Concluidas", icon: CheckCircle2 },
  { key: "overdue", label: "Vencidas", icon: AlertTriangle },
  { key: "no_due_date", label: "Sin fecha", icon: CalendarOff }
];

export default function DashboardCards({ summary = {} }) {
  return (
    <section className={styles.grid}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className={styles.card}>
            <div className={styles.icon}>
              <Icon size={20} aria-hidden="true" />
            </div>
            <span>{card.label}</span>
            <strong>{summary[card.key] ?? 0}</strong>
          </article>
        );
      })}
    </section>
  );
}
