import { useState } from "react";

export const useModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "موافق",
    cancelText: "إلغاء",
    showCancel: false,
    onConfirm: null,
  });

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const showAlert = (message, type = "info", title = "") => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      confirmText: "موافق",
      cancelText: "إلغاء",
      showCancel: true, // Always show cancel button
      onConfirm: null,
    });
  };

  const showSuccess = (message, title = "نجح العملية") => {
    showAlert(message, "success", title);
  };

  const showError = (message, title = "خطأ") => {
    showAlert(message, "error", title);
  };

  const showWarning = (message, title = "تحذير") => {
    showAlert(message, "warning", title);
  };

  const showConfirm = (
    message,
    onConfirm,
    title = "تأكيد العملية",
    confirmText = "تأكيد",
    cancelText = "إلغاء"
  ) => {
    setModalState({
      isOpen: true,
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText,
      showCancel: true,
      onConfirm,
    });
  };

  return {
    modalState,
    closeModal,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
};

export default useModal;