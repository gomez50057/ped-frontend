import styles from "./ChangeHistory.module.css";

export default function ChangeHistory({ history = [] }) {
  return (
    <section id="history" className={styles.section}>
      <h2>Historial de cambios</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Antes</th>
              <th>Ahora</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.empty}>
                  Sin cambios registrados.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id}>
                  <td>{item.field_name}</td>
                  <td>{item.old_value || "Vacio"}</td>
                  <td>{item.new_value || "Vacio"}</td>
                  <td>{item.changed_by_name || "Sistema"}</td>
                  <td>{new Date(item.changed_at).toLocaleString("es-MX")}</td>
                  <td>{item.reason || "Sin motivo"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
