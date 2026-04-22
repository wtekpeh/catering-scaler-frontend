import React from "react";

const ConfirmActionModal = ({
  isOpen,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal__backdrop"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className={`confirm-modal__icon ${variant}`}>
          {variant === "warning" ? "!" : "i"}
        </div>

        <h3 id="confirm-modal-title" className="confirm-modal__title">
          {title}
        </h3>

        {message ? <p className="confirm-modal__message">{message}</p> : null}

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="btn ghost"
            disabled={loading}
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`btn ${variant === "warning" ? "warning" : "primary"}`}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
