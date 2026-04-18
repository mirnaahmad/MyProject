import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/logo.png";
import "../styles/Event.css";

export default function RegistrationModal({
  setIsOpen,
  isSuccess,
  setIsSuccess,
  inputsData,
  setInputsData,
  selectedEventTitle,
  setRegisteredEvents,
  eventId,
}) {
  const [countdown, setCountdown] = useState(3);
  const [preventForm, setPreventForm] = useState(false);
  const TOTAL_DURATION = 3;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputsData.name && inputsData.email && inputsData.contact) {
      setRegisteredEvents((prev) => [...prev, eventId]);
      setPreventForm(true);
      setIsSuccess(true);
      setInputsData({
        name: "",
        email: "",
        contact: "",
      });
    }
  };
  useEffect(() => {
    let timer;
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        setCountdown(TOTAL_DURATION);
        setPreventForm(true);
      }, 0);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSuccess(false);
            setTimeout(() => {
              setIsOpen(false);
              setPreventForm(false);
            }, 400);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(timer);
      };
    }
  }, [isSuccess, setIsOpen, setIsSuccess]);
  const progressPercentage = (countdown / TOTAL_DURATION) * 100;
  return (
    <div
      className="mainCon"
      style={{ pointerEvents: isSuccess ? "none" : "all" }}
    >
      <AnimatePresence mode="wait">
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: "-50%", y: 40, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.5,
              x: "-50%",
              y: -120,
              transition: { duration: 0.6, ease: "backIn" },
            }}
            className="success"
          >
            {/* النصوص والشريط */}
            <div
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "25px",
                  marginBottom: "4px",
                  color: "var(--blue-200)",
                }}
              >
                تم التسجيل !
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--blue-100)",
                  marginBottom: "12px",
                }}
              >
                لقد تم تسجيلك في الفعالية بنجاح
              </div>
              {/* حاوية الشريط والعداد */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "170px",
                    flex: "1",
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: "4px",
                    backgroundColor: "rgba(85, 107, 121, 0.8)", // خلفية الشريط
                  }}
                >
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: `${progressPercentage}% ` }}
                    transition={{ duration: 1, ease: "linear" }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(135deg,#537fb0 ,#346ba6 )",
                      // لون الشريط الأزرق
                      boxShadow: "0 0 10px rgba(83,127,176,0.5",
                      borderRadius: "0 5px",
                    }}
                  />
                </div>
                {/* العداد التنازلي */}
                <div style={{ minWidth: "25px" }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={countdown}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      style={{
                        fontSize: "12px",
                        color: "#b8c7da",
                        display: "block",
                      }}
                    >
                      {countdown}s
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            {/* ايقونة الصح */}
            <div className="trueIcon">
              <Check size={30} color="var(--blue-200)" strokeWidth={4} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isSuccess && !preventForm && (
        <>
          <motion.h2
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
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
            onClick={() => {
              setIsOpen(false);
              setIsSuccess(false);
            }}
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
                  placeholder="الاسم"
                  minLength={3}
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
                  placeholder="name@example.com"
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
                  placeholder="09xxxxxxxx"
                  pattern="[0-9]{10}"
                  title="يجب إدخال رقم هاتف صالح "
                  value={inputsData.contact}
                  onChange={(e) => {
                    setInputsData({ ...inputsData, contact: e.target.value });
                  }}
                  required
                />
              </div>

              <button className="check" type="submit">
                <Check
                  size={20}
                  style={{ color: "#0f63beff", strokeWidth: "4" }}
                />
              </button>
            </motion.form>
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
                      background:
                        "linear-gradient(to right,transparent,#00b4d8)",
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
                      background:
                        "linear-gradient(to left,transparent,#00b4d8)",
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
        </>
      )}
    </div>
  );
}
