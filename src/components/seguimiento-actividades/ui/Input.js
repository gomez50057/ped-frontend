import styles from "./Input.module.css";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className={`${styles.field} ${className}`}>
      {label ? <span>{label}</span> : null}
      <input className={styles.input} {...props} />
      {error ? <small>{error}</small> : null}
    </label>
  );
}
