import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";
import { motion, useInView, wrap } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Info,
  ChevronDown,
  User,
  Star,
} from "lucide-react";
import NetworkCanvas from "../components/NetworkCanvas";
import logo from "../assets/logo.png";
import Notification from "../components/Notification";
import api from "../api";
import "../styles/home.css";

const Counter = ({ from, to, prefix = "" }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  const [count, setCount] = useState(from);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeOut * to));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [inView, to]);

  return (
    <div ref={nodeRef} className="stat-num">
      <span className="plus">{prefix}</span>
      {count}
    </div>
  );
};

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [notification, setNotification] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes, goalsRes] = await Promise.all([
          api.get("/home/stats"),
          api.get("/events/latest"),
          api.get("/home/goals"),
        ]);
        console.log("Stats Data:", statsRes.data);
        console.log("Goals Data:", goalsRes.data);
        console.log("Events Data:", eventsRes.data);
        setStats(statsRes.data.data);
        setRecentEvents(eventsRes.data);
        setGoals(goalsRes.data);
      } catch (err) {
        console.error("خطأ التحميل:", err.response?.data || err.message);
        setNotification({
          message:
            "فشل في تحميل البيانات: " +
            (err.response?.data?.message || "خطأ غير معروف"),
          type: "error",
        });
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="homecontainer">
        <section
          className="page-hero"
          style={{
            minHeight: "10vh",
            padding: 0,
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <NetworkCanvas />
          <section
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              padding: "20px",
            }}
          >
            <div
              className="container"
              style={{ position: "relative", zIndex: 2 }}
            >
              <div style={{ maxWidth: "600px", paddingTop: "180px" }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(74,144,226,.15)",
                    border: "1px solid rgba(74,144,226,.4)",
                    borderRadius: "50px",
                    padding: "6px 16px",
                    fontSize: ".82rem",
                    fontWeight: 600,
                    color: "var(--blue-200)",
                    marginBottom: "24px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: "var(--accent)",
                      borderRadius: "50%",
                      animation: "pulseDot 2s infinite",
                    }}
                  />
                  مجتمع طلابي نشط ومتميز
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="gradient-text"
                  style={{
                    fontSize: "clamp(2rem, 2.5vw, 4rem)",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    marginBottom: "24px",
                  }}
                >
                  الهيئـة الطـلابية
                  <br />
                  في كليـة الهندسةالمعلوماتية
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    fontSize: "1.1rem",
                    color: "var(--text-light)",
                    lineHeight: 1.9,
                    marginBottom: "40px",
                    maxWidth: "540px",
                  }}
                >
                  مجموعة من الطلاب يعملون لخدمة زملائهم ورفاهيتهم في الكلية
                  وتسهيل حياتهم الجامعية من خلال تنظيم الفعاليات والتدريبات
                  لتعود بالفائدة عليهم.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
                >
                  <Link to="/events" className="btn btn-primary btn-lg">
                    <Calendar size={18} /> استعرض الفعاليات
                  </Link>
                  <a href="#about" className="btn btn-outline btn-lg">
                    <Info size={18} /> اعرف المزيد
                  </a>
                </motion.div>
              </div>
            </div>
            <div
              style={{
                flex: "1 1 300px", // بيسمح للوغو يتمدد ويتقلص، وبس يصير العرض أقل من 300px بينزل لسطر جديد
                maxWidth: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img className="herologo" src={logo} alt="Logo" />
            </div>
          </section>
        </section>

        <section className="section " id="events">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">أبرز الفعاليات القادمة</h2>
              <Link to="/events" className="see-more">
                الكل <ArrowLeft size={16} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {recentEvents.map((act, i) => (
                <motion.div
                  key={act.id}
                  className="event-card card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="event-card-img-wrap">
                    <img
                      src={`http://localhost:4000${act.img}`}
                      alt={act.title}
                      className="event-card-img"
                    />
                  </div>
                  <div className="event-card-body">
                    <h3 className="event-card-title">{act.title}</h3>
                    <div className="event-card-meta">
                      <div className="event-card-meta-item">
                        <Calendar size={14} color="var(--accent)" /> {act.date}
                      </div>
                      <div className="event-card-meta-item">
                        <Clock size={14} color="var(--accent)" /> {act.time}
                      </div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <Link
                        to={`/events/${act.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ width: "100%" }}
                      >
                        التفاصيل <ArrowLeft size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── STATS & ABOUT ── */}
      <section className="section section-dark" id="about">
        <div className="container">
          <h2 className="section-title">من نحن</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
              marginBottom: "60px",
            }}
          >
            <motion.div
              className="card stat-card-inner"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="stat-icon">
                <User size={24} color="#fff" />
              </div>
              <Counter
                from={0}
                to={stats?.activeMembers ? Number(stats.activeMembers) : 0}
                prefix="+"
              />
              <div className="stat-label">عضو فاعل</div>
            </motion.div>

            <motion.div
              className="card stat-card-inner"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="stat-icon">
                <Star size={24} color="#fff" />
              </div>
              <Counter
                from={0}
                to={
                  stats?.totalBeneficiaries
                    ? Number(stats.totalBeneficiaries)
                    : 0
                }
                prefix="+"
              />
              <div className="stat-label">مستفيد</div>
            </motion.div>

            <motion.div
              className="card stat-card-inner"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="stat-icon">
                <Calendar size={24} color="#fff" />
              </div>
              <Counter
                from={0}
                to={stats?.totalEvents ? Number(stats.totalEvents) : 0}
                prefix="+"
              />
              <div className="stat-label">فعالية</div>
            </motion.div>

            <motion.div
              className="card stat-card-inner"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="stat-icon">
                <Clock size={24} color="#fff" />
              </div>
              <Counter
                from={0}
                to={stats?.volunteerHours ? Number(stats.volunteerHours) : 0}
                prefix="+"
              />
              <div className="stat-label">ساعة عمل تطوعي</div>
            </motion.div>
          </div>

          <h3
            className="section-title"
            style={{ fontSize: "2rem", marginBottom: "28px" }}
          >
            أبرز أهدافنا
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {goals.map((goal, i) => (
              <motion.div
                key={goal.id}
                className="card"
                style={{
                  padding: "24px",
                  position: "relative",
                  overflow: "hidden",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                      "linear-gradient(90deg,var(--blue-400),var(--accent))",
                  }}
                />
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(74,144,226,.15)",
                    border: "1px solid rgba(74,144,226,.3)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "var(--blue-300)",
                  }}
                >
                  <Target size={20} />
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    color: "var(--blue-200)",
                    marginBottom: "10px",
                  }}
                >
                  {goal.content}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
