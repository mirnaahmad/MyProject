import React, { useEffect } from "react";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    backgroundColor: "var(--navy-800)",
    border: `1px solid ${type === "success" ? "var(--success)" : "var(--danger)"}`,
    color: "var(--white)",
    padding: "15px 20px",
    borderRadius: "var(--radius-md)",
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "max-content",
    maxWidth: "90vw",
    zIndex: 1000,
    boxShadow: "var(--shadow-md)",
    fontFamily: "var(--font)",
  };

  return <div style={styles}>{message}</div>;
};

export default Notification;
