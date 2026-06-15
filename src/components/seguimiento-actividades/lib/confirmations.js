const CONFIRM_EVENT = "activity-platform:confirm";

export function confirmAction(options) {
  if (typeof window === "undefined") {
    return Promise.resolve(true);
  }

  const config = typeof options === "string" ? { message: options } : options;
  if (!window.__activityPlatformConfirmReady) {
    return Promise.resolve(window.confirm(config.message));
  }

  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent(CONFIRM_EVENT, {
        detail: {
          title: "Confirmar accion",
          confirmLabel: "Confirmar",
          cancelLabel: "Cancelar",
          tone: "default",
          ...config,
          resolve
        }
      })
    );
  });
}

export { CONFIRM_EVENT };
