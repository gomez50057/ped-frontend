import styles from "./Select.module.css";

export default function Select({ label, children, className = "", ...props }) {
  return (
    <label className={`${styles.field} ${className}`}>
      {label ? <span>{label}</span> : null}
      <select className={styles.select} {...props}>
        {children}
      </select>
    </label>
  );
}
