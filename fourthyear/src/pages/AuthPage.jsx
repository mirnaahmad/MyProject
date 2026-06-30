import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import axios from "axios";
import api from "../api";
import Notification from "../components/Notification";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  // الـ States الخاصة بالمدخلات
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // دالة موحدة للتبديل بين التابس وتنظيف الحقول لمنع الـ Cascading Renders
  const handleTabChange = (loginState) => {
    setIsLogin(loginState);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  // تأثير الخلفية المتحركة (Canvas)
  useEffect(() => {
    const c = document.getElementById("auth-bg-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    let nodes = [];
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 40; i++)
      nodes.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });

    let id;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > c.width) n.vx *= -1;
        if (n.y < 0 || n.y > c.height) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(90,155,213,.7)";
        ctx.fill();
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x,
            dy = nodes[i].y - nodes[j].y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(74,144,226,${1 - d / 150})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(id);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/users/login" : "/users/register";
      const payload = isLogin
        ? { email, password }
        : { name: fullName, email, password };

      const response = await api.post(endpoint, payload);

      // حفظ التوكن في الـ localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        //حفظ بيانات المستخدم
        const userRole = response.data.user?.role || response.data.role;
        localStorage.setItem("role", userRole);

        setNotification({ message: "تمت العملية بنجاح!", type: "success" });

        // التوجيه بناءً على الدور (Role)
        setTimeout(() => {
          if (response.data.user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 1500);
      }
    } catch (error) {
      console.log("Full Error Object:", error.response);
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "حدث خطأ غير متوقع";
      setNotification({ message: serverMessage, type: "error" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px",
        background:
          "radial-gradient(ellipse 80% 100% at 50% 0%, var(--navy-600) 0%, var(--navy-900) 80%)",
      }}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <canvas
        id="auth-bg-canvas"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <Link
        to="/"
        style={{
          position: "absolute",
          top: "24px",
          right: "32px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-light)",
          fontSize: ".88rem",
          fontWeight: 500,
          transition: "var(--transition)",
        }}
        className="hover-white"
      >
        <ArrowRight size={16} /> العودة للرئيسية
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "560px",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,.6)",
          border: "1px solid rgba(74,144,226,.2)",
          position: "relative",
          zIndex: 1,
        }}
        className="auth-split"
      >
        {/* تابس الموبايل */}
        <div
          className="auth-mobile-tabs d-none d-show-mobile"
          style={{
            gridColumn: "1 / -1",
            background: "var(--navy-800)",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,.05)",
              borderRadius: "50px",
              padding: "4px",
            }}
          >
            <button
              onClick={() => handleTabChange(true)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "50px",
                background: isLogin ? "var(--accent)" : "transparent",
                color: isLogin ? "#fff" : "var(--gray-400)",
                fontWeight: 700,
              }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => handleTabChange(false)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "50px",
                background: !isLogin ? "var(--accent)" : "transparent",
                color: !isLogin ? "#fff" : "var(--gray-400)",
                fontWeight: 700,
              }}
            >
              إنشاء حساب
            </button>
          </div>
        </div>

        {/* القسم الجانبي اللوحي (الشاشات الكبيرة) */}
        <div
          style={{
            background:
              "linear-gradient(145deg, var(--navy-600) 0%, var(--navy-800) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
            textAlign: "center",
            position: "relative",
          }}
          className="d-none-mobile"
        >
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "300px",
              height: "300px",
              background: "radial-gradient(var(--accent-glow),transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="info-login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <Logo />
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    marginBottom: "14px",
                  }}
                >
                  مرحباً بك!
                </h2>
                <p
                  style={{
                    color: "var(--text-light)",
                    marginBottom: "32px",
                    lineHeight: 1.8,
                  }}
                >
                  ليس لديك حساب؟
                  <br />
                  أنشئ حساباً الآن وانضم
                  <br />
                  إلى مجتمعنا الطلابي.
                </p>
                <button
                  onClick={() => handleTabChange(false)}
                  className="btn btn-outline"
                  style={{ direction: "rtl" }}
                >
                  إنشاء حساب
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="info-reg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <Logo />
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    marginBottom: "14px",
                  }}
                >
                  لديك حساب؟
                </h2>
                <p
                  style={{
                    color: "var(--text-light)",
                    marginBottom: "32px",
                    lineHeight: 1.8,
                  }}
                >
                  سجّل الدخول ليستمر
                  <br />
                  معك إلى رحلتك
                  <br />
                  في مجتمعنا.
                </p>
                <button
                  onClick={() => handleTabChange(true)}
                  className="btn btn-outline"
                  style={{ direction: "rtl" }}
                >
                  تسجيل الدخول
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* قسم الفورم الفعلي */}
        <div
          style={{
            background: "var(--white)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="form-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "var(--navy-800)",
                    marginBottom: "30px",
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  تسجيل الدخول
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-input form-input-light"
                      placeholder="البريد الإلكتروني"
                      required
                      value={email}
                      style={{ color: "black" }}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail size={18} className="form-icon" />
                  </div>
                  <div className="form-group">
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-input form-input-light"
                      placeholder="كلمة المرور"
                      required
                      value={password}
                      style={{ color: "black" }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock size={18} className="form-icon" />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "300px",
                        background: "none",
                        color: showPass ? "var(--accent)" : "var(--gray-400)",
                        display: "flex",
                        cursor: "pointer",
                        padding: 0,
                        alignItems: "center",
                      }}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", marginTop: "6px" }}
                  >
                    تسجيل الدخول
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="form-reg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "var(--navy-800)",
                    marginBottom: "30px",
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  إنشاء حساب
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      style={{ color: "black" }}
                      className="form-input form-input-light"
                      placeholder="الاسم الكامل"
                      required
                      pattern="^[a-zA-Z\u0600-\u06FF\s]{3,30}$"
                      title="الاسم الكامل يجب أن يحتوي على حروف فقط وبطول يتراوح بين 3 و20 حرفاً."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <User size={18} className="form-icon" />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-input form-input-light"
                      placeholder="البريد الإلكتروني"
                      required
                      style={{ color: "black" }}
                      // pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      title="يرجى إدخال بريد إلكتروني صالح (مثال: name@example.com)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail size={18} className="form-icon" />
                  </div>
                  <div className="form-group">
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-input form-input-light"
                      placeholder="كلمة المرور"
                      required
                      style={{ color: "black" }}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                      title="يجب أن تتكون كلمة المرور من 8 خانات على الأقل، وتحتوي على حرف كبير، حرف صغير، ورقم."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock size={18} className="form-icon" />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "300px",
                        background: "none",
                        color: showPass ? "var(--accent)" : "var(--gray-400)",
                      }}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "14px",
                    }}
                  >
                    إنشاء الحساب
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .hover-white:hover { color: #fff !important; }
        .d-show-mobile { display: none; }
        @media (max-width: 768px) {
          .auth-split { grid-template-columns: 1fr !important; max-width: 440px !important; }
          .d-none-mobile { display: none !important; }
          .d-show-mobile { display: block; }
        }
      `}</style>
    </div>
  );
}

const Logo = () => (
  <div
    style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}
  >
    <motion.img
      src={logo}
      alt="logo"
      style={{ width: "150px", height: "auto" }}
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);
