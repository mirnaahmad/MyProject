import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import "../styles/Event.css";

export default function RegistrationModal({
  setIsOpen,
  isSuccess,
  setIsSuccess,
  inputsData,
  setInputsData,
  selectedEventTitle,
  eventLink,
  setRegisteredEvents,
  eventId,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputsData.name && inputsData.email && inputsData.contact) {
      setRegisteredEvents((prev) => [...prev, eventId]);
      setIsSuccess(true);
      setInputsData({
        name: "",
        email: "",
        contact: "",
      });
    }
  };
  return (
    <div className="mainCon">
      <motion.h2
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          // padding: "7px",
          borderBottom: "1px solid #e1e2e4",
          marginBottom: "10px",
          color: "rgba(202, 203, 216, 1)",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "23px",
        }}
      >
        {selectedEventTitle}
      </motion.h2>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          background: "none",
          top: "15px",
          left: "15px",
          border: "none",
          color: "#bbd4ebff",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <X size={15} strokeWidth={3} />
      </motion.button>
      <motion.div layout className="internalCon">
        {!isSuccess ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div className="fieldGroup">
              <label className="fieldLabel">الاسم الثلاثي:</label>
              <input
                className="inputs"
                type="text"
                value={inputsData.name}
                onChange={(e) => {
                  setInputsData({ ...inputsData, name: e.target.value });
                }}
                required
              />
            </div>
            <div className="fieldGroup">
              <label className="fieldLabel">الايميل:</label>
              <input
                className="inputs"
                type="email"
                value={inputsData.email}
                onChange={(e) => {
                  setInputsData({ ...inputsData, email: e.target.value });
                }}
                required
              />
            </div>
            <div className="fieldGroup">
              <label className="fieldLabel">رقم التواصل:</label>
              <input
                className="inputs"
                type="text"
                value={inputsData.contact}
                onChange={(e) => {
                  setInputsData({ ...inputsData, contact: e.target.value });
                }}
                required
              />
            </div>
            <div className="fieldGroup">
              <label className="fieldLabel">انضم لمجموعة التدريب:</label>
              <a
                className="but"
                href={eventLink}
                target="_blank"
                rel="noreferrer"
              >
                اضغط هنا
              </a>
            </div>
            <button
              className="check"
              type="submit"
              style={{
                display: "block",
                color: "#252a3fff",
                padding: "2px",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "5px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#1c284aff",
                boxShadow: "2px 2px 2px 2px #1b6fc8ff ",
                marginTop: "3px",
                width: "40px",
              }}
            >
              <Check
                size={20}
                style={{ color: "#0f63beff", strokeWidth: "4" }}
              />
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "20px",
              width: "100%",
              height: "100%",
              padding: "20px 0",
            }}
          >
            <p
              style={{
                color: "#bbd4ebff",
                fontSize: "30px",
                fontWeight: "bold",
                // marginBottom: "-30px",
              }}
            >
              تم بنجاح
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "190px",
                height: "135px",
                backgroundColor: "#bbd4ebff",
                borderRadius: "80px",
                boxShadow: "0 7px 10px rgba(0,0,0,0.5)",
              }}
            >
              <Check size={"100px"} color="#12549cff" strokeWidth={5} />
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            background: "none",
            marginTop: "30px",
            paddingTop: "20px",
            gap: "5px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textALign: "center",
              gap: "5px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                display: "block",
                // fontWeight: "550",
                marginTop: "5px",
              }}
            >
              كلية الهندسة المعلوماتية
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "-8px",
              }}
            >
              <div
                style={{
                  flex: "1",
                  height: "1px",
                  background: "linear-gradient(to right,transparent,#00b4d8)",
                  minWidth: "30px",
                }}
              />
              <span
                style={{
                  color: "#346ba6ff",
                  fontSize: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                الهيئة الطلابية
              </span>
              <div
                style={{
                  flex: "1",
                  height: "1px",
                  background: "linear-gradient(to left,transparent,#00b4d8)",
                  minWidth: "30px",
                }}
              />
            </div>
          </div>
          <img
            src={logo}
            alt="logo"
            style={{
              width: "30px",
              height: "30px",
              background: "none",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
