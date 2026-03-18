const TOAST_TYPE_STYLES = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  error: 'border-rose-300 bg-rose-50 text-rose-900',
  info: 'border-sky-300 bg-sky-50 text-sky-900',
}

function ToastStack({ toasts, onDismiss }) {
  if (!toasts?.length) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${
            TOAST_TYPE_STYLES[toast.type] || TOAST_TYPE_STYLES.info
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="leading-5">{toast.message}</p>
            <button
              type="button"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] opacity-70 transition hover:opacity-100"
              onClick={() => onDismiss(toast.id)}
            >
              Cerrar
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ToastStack
