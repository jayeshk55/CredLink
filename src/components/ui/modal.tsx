import * as React from "react"
import styles from "./modal.module.css"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: React.ReactNode
  primaryText?: string
  onPrimary?: () => void
  children?: React.ReactNode
  showActions?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  primaryText,
  onPrimary,
  children,
  showActions = true,
}: ModalProps) {
  if (!isOpen) return null

  const handlePrimary = () => {
    if (onPrimary) onPrimary()
    else onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.box}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title ? <h3 className={styles.title}>{title}</h3> : null}
          <button aria-label="Close" onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        {message ? (
          <div className={styles.body}>{message}</div>
        ) : null}

        {children}

        {showActions && (
          <div className={styles.actions}>
            <button onClick={handlePrimary} className={styles.primaryBtn}>
              {primaryText ?? "Close"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
