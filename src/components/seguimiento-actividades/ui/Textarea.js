import styles from "./Textarea.module.css";

export default function Textarea({ label, className = "", ...props }) {
  return (
    <label className={`${styles.field} ${className}`}>
      {label ? <span>{label}</span> : null}
      <textarea className={styles.textarea} {...props} />
    </label>
  );
}
