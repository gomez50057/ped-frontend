import styles from "./Button.module.css";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon size={17} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
