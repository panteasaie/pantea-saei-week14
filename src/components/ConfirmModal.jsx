import React from "react";
import styles from "./ConfirmModal.module.css";
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.edit}>
      <div role="dialog" aria-modal="true" className={styles.modal}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onCancel} className={styles.cancel}>Cancel</button>
          <button onClick={onConfirm} className={styles.confirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
