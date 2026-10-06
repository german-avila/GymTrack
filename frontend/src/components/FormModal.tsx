import {
  useEffect,
  type ReactNode
} from "react";

type FormModalProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
};

function FormModal({
  title,
  eyebrow,
  children,
  onClose,
  wide = false
}: FormModalProps) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  return (
    <div
      className="form-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className={
          wide
            ? "form-modal form-modal-wide"
            : "form-modal"
        }
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="form-modal-header">
          <div>
            {eyebrow && (
              <span className="page-kicker">
                {eyebrow}
              </span>
            )}

            <h2>
              {title}
            </h2>
          </div>

          <button
            type="button"
            className="form-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="form-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default FormModal;