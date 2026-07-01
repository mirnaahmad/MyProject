import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  MapPin,
  Users,
  Ticket,
  ArrowRight,
  CheckCircle2,
  Tag,
  Contact,
} from "lucide-react";
// ايقونات
import NetworkCanvas from "../components/NetworkCanvas";
import { useState, useEffect, useCallback } from "react";
import RegistrationModal from "../components/RegistrationModal";
import api from "../api";
import Notification from "../components/Notification";
import "../styles/Event.css";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    console.log("الـ ID الذي نحاول استخدامه هو:", id);
    if (!id) {
      console.error("خطأ: لا يوجد ID للفعالية!");
      return;
    }
    try {
      setLoading(true);
      const [resEvent, resActive] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/active`),
      ]);
      const eventData = resEvent.data.event || resEvent.data;
      setEvent(eventData);
      setRelatedEvents(
        resActive.data.filter((e) => e.id !== Number(id)).slice(0, 2),
      );
      try {
        const resStatus = await api.get(`/events/status/${id}`);
        setStatus({ [id]: resStatus.data });
      } catch (statusErr) {
        console.warn(
          "فشل طلب الـ status، السيرفر لا يجد الـ ID أو هناك خلل في الباك:",
          statusErr.response?.data || statusErr,
        );
      }
      setLoading(false);
    } catch (err) {
      console.error("خطأ:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      await fetchData();
    };

    if (isMounted) {
      loadData();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchData]);
  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        جاري تحميل التفاصيل...
      </div>
    );
  if (!event)
    return (
      <div
        className="container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        الفعالية غير موجودة أو حدث خطأ.
      </div>
    );
  const handleRegisterClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }
    setIsOpen(true);
  };
  const handleCancelRegistration = async (eventId) => {
    console.log("ID المبعوث هو:", eventId);
    try {
      await api.post("/events/cancel", { event_id: eventId });
      await fetchData();
      setNotification({
        message: "تم إلغاء التسجيل بنجاح",
        type: "success",
      });
    } catch (err) {
      console.error("خطأ في إلغاء التسجيل:", err);
      setNotification({
        message: "خطأ في إلغاء التسجيل ",
        type: "error",
      });
    }
  };
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <section className="page-hero" style={{ minHeight: "300px" }}>
        <NetworkCanvas />
        <div className="container page-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            تفاصيل الفعالية
          </motion.h1>
          <motion.nav
            className="breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/">الرئيسية</Link> <ChevronLeft size={14} />
            <Link to="/events">الفعاليات</Link> <ChevronLeft size={14} />
            <span style={{ color: "var(--white)" }}>{event.title}</span>
          </motion.nav>
        </div>
      </section>

      {/* DETAIL*/}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) 340px",
              gap: "32px",
              alignItems: "flex-start",
            }}
            className="detail-grid"
          >
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card" style={{ padding: "36px" }}>
                <h2
                  style={{
                    color: "#769bd4ff",
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    marginBottom: "20px",
                  }}
                >
                  {event.title}
                </h2>

                <p
                  style={{
                    color: "var(--text-light)",
                    fontSize: "1.2rem",
                    lineHeight: "1.9",
                    marginBottom: "32px",
                  }}
                >
                  {event.description}
                </p>

                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "var(--blue-200)",
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CheckCircle2 color="var(--accent)" /> محاور الجلسة
                </h3>

                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    color: "var(--text-light)",
                  }}
                >
                  {Array.isArray(event.agenda) &&
                    event.agenda.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{ color: "var(--accent)", marginTop: "6px" }}
                        >
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Related */}
              <div style={{ marginTop: "40px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    marginBottom: "20px",
                  }}
                >
                  فعاليات ذات صلة
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
                    gap: "20px",
                  }}
                >
                  {relatedEvents.map((rel) => (
                    <Link
                      to={`/events/${rel.id}`}
                      key={rel.id}
                      className="card event-card"
                      style={{ display: "block" }}
                    >
                      <div
                        className="event-card-img-wrap"
                        style={{ height: "140px" }}
                      >
                        <img
                          src={rel.img}
                          alt={rel.title}
                          className="event-card-img"
                        />
                      </div>
                      <div className="event-card-body">
                        <h4
                          className="event-card-title"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {rel.title}
                        </h4>
                        <div className="event-card-meta">
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Calendar size={12} /> {rel.date}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ position: "sticky", top: "90px" }}
            >
              <div className="card" style={{ padding: "28px" }}>
                <img
                  src={event.speakerImg}
                  alt={event.speaker}
                  style={{
                    width: "300px",
                    height: "220px",
                    marginRight: "auto",
                    marginLeft: "auto",
                    objectFit: "cover",
                    borderRadius: "20px",
                    border: "2px solid rgba(74,144,226,.3)",
                    marginBottom: "16px",
                  }}
                />
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                  }}
                >
                  {event.speaker}
                </h3>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: ".85rem",
                    color: "var(--gray-400)",
                    marginBottom: "24px",
                  }}
                >
                  {event.speakerTitle}
                </p>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <MetaRow
                    icon={<Calendar size={16} />}
                    label="التاريخ"
                    value={event.date}
                  />
                  <MetaRow
                    icon={<Clock size={16} />}
                    label="الوقت"
                    value={event.time}
                  />
                  <MetaRow
                    icon={<Clock size={16} />}
                    label="المدة"
                    value={event.duration}
                  />
                  <MetaRow
                    icon={<MapPin size={16} />}
                    label="المكان"
                    value={event.location}
                  />
                  <MetaRow
                    icon={<Users size={16} />}
                    label="المشاركون"
                    value={`${event.attendees} مشارك`}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  disabled={
                    status[event.id]?.isFull && !status[event.id]?.isRegistered
                  }
                  style={{
                    width: "100%",
                    marginTop: "24px",
                    padding: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (status[event.id]?.isRegistered) {
                      handleCancelRegistration(event.id);
                    } else {
                      handleRegisterClick(event);
                    }
                  }}
                >
                  {status[event.id]?.isRegistered
                    ? " انسحاب"
                    : status[event.id]?.isFull
                      ? "ممتلئة"
                      : "احجز"}
                </button>
                <Link
                  to="/events"
                  className="btn btn-ghost"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  العودة للفعاليات <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 992px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {isOpen && (
        <RegistrationModal
          setIsOpen={setIsOpen}
          onSuccess={() => {
            setIsOpen(false);
            fetchData();
          }}
          selectedEventTitle={event.title}
          eventId={event.id}
        />
      )}
    </>
  );
}

const MetaRow = ({ icon, label, value, border = true }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: border ? "1px solid rgba(91,155,213,.15)" : "none",
      fontSize: ".88rem",
    }}
  >
    <span
      style={{
        color: "var(--gray-400)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {icon} {label}
    </span>
    <span style={{ color: "var(--white)", fontWeight: 600 }}>{value}</span>
  </div>
);
