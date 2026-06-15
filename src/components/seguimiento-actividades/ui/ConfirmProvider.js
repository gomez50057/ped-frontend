"use client";

import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { CONFIRM_EVENT } from "../lib/confirmations";
import Button from "./Button";
import styles from "./ConfirmProvider.module.css";

const toneConfig = {
  default: { icon: Info, className: styles.defaultIcon, buttonVariant: "primary" },
  danger: { icon: ShieldAlert, className: styles.dangerIcon, buttonVariant: "danger" },
  warning: { icon: AlertTriangle, className: styles.warningIcon, buttonVariant: "gold" },
  success: { icon: CheckCircle2, className: styles.successIcon, buttonVariant: "primary" }
};

export default function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);

  useEffect(() => {
    window.__activityPlatformConfirmReady = true;

    function handleConfirm(event) {
      setRequest(event.detail);
    }

    window.addEventListener(CONFIRM_EVENT, handleConfirm);
    return () => {
      window.removeEventListener(CONFIRM_EVENT, handleConfirm);
      window.__activityPlatformConfirmReady = false;
    };
  }, []);

  function close(accepted) {
    request?.resolve(Boolean(accepted));
    setRequest(null);
  }

  const tone = toneConfig[request?.tone] || toneConfig.default;
  const Icon = tone.icon;

  return (
    <>
      {children}
      {request ? (
        <div className={styles.backdrop} role="presentation">
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className={`${styles.iconWrap} ${tone.className}`}>
              <Icon size={24} aria-hidden="true" />
            </div>
            <div className={styles.content}>
              <h2 id="confirm-title">{request.title}</h2>
              <p>{request.message}</p>
            </div>
            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={() => close(false)}>
                {request.cancelLabel}
              </Button>
              <Button type="button" variant={tone.buttonVariant} onClick={() => close(true)}>
                {request.confirmLabel}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
