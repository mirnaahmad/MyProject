import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  MapPin,
  Users,
  Info,
  Ticket,
} from "lucide-react";
import NetworkCanvas from "../components/NetworkCanvas";
import Notification from "../components/Notification";
import RegistrationModal from "../components/RegistrationModal";
import api from "../api";
import "../styles/Event.css";

export default function EventsPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [events, setEvents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [archiveEvents, setArchiveEvents] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    const fetchAllEventsWithStatus = async () => {
      try {
        const res = await api.get("/events/active");
        const eventsData = res.data;
        setEvents(res.data);

        console.log("Events data being processed:", eventsData);
        const statusRequests = eventsData.map(async (event) => {
          try {
            const statusRes = await api.get(`/events/status/${event.id}`);
            return { id: event.id, status: statusRes.data };
          } catch (err) {
            console.log("Error ", err);
            return { id: event.id, status: null }; // في حال فشل طلب حالة واحدة
          }
        });
        const results = await Promise.all(statusRequests);

        const newStatusMap = {};

        results.forEach((item) => {
          newStatusMap[item.id] = item.status;
        });

        setStatusMap(newStatusMap);
      } catch (err) {
        console.error("خطأ في جلب بيانات الفعاليات", err);
      }
    };

    const fetchArchive = async () => {
      try {
        const res = await api.get("/events/archive");

        setArchiveEvents(res.data);
      } catch (err) {
        console.log("خطأ في جلب الأرشيف:", err);
      }
    };
    fetchAllEventsWithStatus();
    fetchArchive();
  }, [navigate, refreshTrigger]);

  const handleDetailsClick = (e) => {
    if (!localStorage.getItem("token")) {
      e.preventDefault();
      navigate("/auth");
    }
  };
  const handleRegisterClick = (event) => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }
    setSelectedEventTitle(event.title);
    setSelectedEventId(event.id);
    setIsOpen(true);
  };
  const handleCancelRegistration = async (eventId) => {
    console.log("ID المبعوث هو:", eventId);
    try {
      await api.post("/events/cancel", { event_id: eventId });
      setRefreshTrigger((prev) => prev + 1);
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
  const handleRegistrationSuccess = () => {
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 500);
  };
  const featuredEvent = events.find((e) => e.featured);
  return (
    <>
      {/* ── HERO ── */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <section className="page-hero" style={{ height: "300px" }}>
        <NetworkCanvas />
        <div className="container page-hero-content">
          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            جميع الفعاليات
          </motion.h1>
          <motion.nav
            className="breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/">الرئيسية</Link>
            <ChevronLeft size={14} />
            <span>الفعاليات</span>
            {/* الكلمة اللي واقفة عليها حاليا */}
          </motion.nav>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title"> الفعاليات القادمة</h2>

          {/* Featured */}
          {featuredEvent && (
            // هون منفحص العنصر اليساري اذا كان موجود منسمح للديف بالظهور واذا مو موجود لا ترسم شي ابدا
            <motion.div
              className="card cardit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    marginBottom: "10px",
                  }}
                >
                  {featuredEvent.title}
                </h3>

                <p
                  style={{
                    color: "var(--blue-200)",
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "1rem",
                  }}
                >
                  <Users size={16} /> المحاضر: {featuredEvent.speaker}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginBottom: "24px",
                    fontSize: ".85rem",
                    color: "var(--text-light)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Calendar size={16} color="var(--accent)" />{" "}
                    {featuredEvent.date}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Clock size={16} color="var(--accent)" />{" "}
                    {featuredEvent.time}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <MapPin size={16} color="var(--accent)" />{" "}
                    {featuredEvent.location}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  {!statusMap[featuredEvent.id]?.isExpired && (
                    <button
                      className="btn btn-primary"
                      disabled={
                        statusMap[featuredEvent.id]?.isFull &&
                        !statusMap[featuredEvent.id]?.isRegistered
                      }
                      onClick={() => {
                        if (statusMap[featuredEvent.id]?.isRegistered) {
                          handleCancelRegistration(featuredEvent.id);
                        } else {
                          handleRegisterClick(featuredEvent);
                        }
                      }}
                      style={{ borderRadius: "11px" }}
                    >
                      <Ticket size={16} />
                      {statusMap[featuredEvent.id]?.isRegistered
                        ? "انسحاب"
                        : statusMap[featuredEvent.id]?.isFull
                          ? "ممتلئة"
                          : "تسجيل الآن"}
                    </button>
                  )}
                  <Link
                    to={`/events/${featuredEvent.id}`}
                    onClick={(e) => handleDetailsClick(e)}
                    style={{ borderRadius: "11px" }}
                    className="btn btn-outline-blue"
                  >
                    <Info size={16} /> تفاصيل
                  </Link>
                </div>
              </div>
              <img
                src={`http://localhost:4000${featuredEvent.speakerImg}`}
                alt={`http://localhost:4000${featuredEvent.img}`}
                className="d-none-mobile speakerImage"
              />
            </motion.div>
          )}

          {/* List */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {events
              .filter((e) => !statusMap[e.id]?.isExpired)
              .map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 30px rgba(255, 255,255,0.05)",
                  }}
                  transition={{ duration: 0.2 }}
                  className="card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "24px",
                    alignItems: "center",
                    padding: "22px 28px",
                  }}
                >
                  <img
                    src={`http://localhost:4000${event.speakerImg}`}
                    alt={`http://localhost:4000${event.Img}`}
                    className="d-none-mobile speakerImage"
                  />

                  <div>
                    <h4
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        marginBottom: "8px",
                      }}
                    >
                      {event.title}
                    </h4>
                    <div
                      style={{
                        display: "flex",

                        fontSize: ".9rem",
                        color: "var(--gray-400)",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Users size={14} color="var(--accent)" />{" "}
                        {event.speaker}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                    }}
                    className="row-to-col"
                  >
                    <div style={{ textAlign: "center", minWidth: "70px" }}>
                      <div
                        style={{
                          fontSize: ".7rem",
                          fontWeight: 700,
                          background: "var(--accent)",
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "8px 8px 0 0",
                        }}
                      >
                        {event.date.split(" ")[1]}
                      </div>
                      <div
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: 900,
                          background: "var(--navy-600)",
                          borderRadius: "0 0 8px 8px",
                          lineHeight: 1,
                          padding: "6px 0",
                        }}
                      >
                        {event.date.split(" ")[0]}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                      className="actions-group"
                    >
                      {statusMap[event.id]?.isExpired ? null : (
                        <button
                          className="btn btn-primary"
                          disabled={
                            statusMap[event.id]?.isFull &&
                            !statusMap[event.id]?.isRegistered
                          }
                          onClick={() => {
                            if (statusMap[event.id]?.isRegistered) {
                              handleCancelRegistration(event.id);
                            } else {
                              handleRegisterClick(event);
                            }
                          }}
                        >
                          {statusMap[event.id]?.isRegistered
                            ? " انسحاب"
                            : statusMap[event.id]?.isFull
                              ? "ممتلئة"
                              : "احجز"}
                        </button>
                      )}
                      <Link
                        to={`/events/${event.id}`}
                        onClick={(e) => handleDetailsClick(e)}
                        className="btn btn-ghost btn-sm"
                        style={{ width: "100px" }}
                      >
                        تفاصيل
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

            {events.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--gray-500)",
                }}
              >
                لا توجد فعاليات حالياً.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── ARCHIVE ── */}
      <section className="section section-dark" id="archive">
        <div className="container">
          <h2 className="section-title">أرشيف الفعاليات</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))",
              gap: "20px",
            }}
          >
            {archiveEvents.length > 0 ? (
              archiveEvents.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.05 }}
                >
                  <img
                    src={`http://localhost:4000${item.img}`}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      filter: "brightness(.8) saturate(.8)",
                      borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                    }}
                  />
                  <div style={{ padding: "16px" }}>
                    <h4
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 700,
                        marginBottom: "6px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        // بحط تلت نقاط
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </h4>
                    <div
                      style={{
                        fontSize: ".75rem",
                        color: "var(--gray-400)",
                      }}
                    >
                      <span>
                        <Calendar size={12} style={{ marginRight: 3 }} />{" "}
                        {item.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: "white" }}>لا توجد فعاليات في الأرشيف.</p>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .d-none-mobile { display: none !important;  }
          .section {padding:40px 0;}
          .card {
          grid-template-columns: 1fr auto !important;
          gap:12px !important;
          padding:12px 16px !important;
          margin-bottom:12px;
          }
          .card h4{
          font-size:1rem !important;
          margin-bottom:4px !important;}
          .row-to-col { flex-direction: column !important;
          //  align-items: center
            min-width:60px ;
           gap: 8px !important; }
           .row-to-col div:first-child {
           scale:0.8;
           margin:-5px 0;
           }
          .actions-group { flex-direction: row !important;
          gap:5px !important; }
        
          .actions-group .btn {
          padding:4px 10px !important;
          font-size:0.75rem !important;
          height:auto !important;
          width:auto !important;
          }
          .cardit {
          padding:20px !important;
          margin-bottom:20px !important;
          }
          .cardit h3 {
          font-size:1.2rem !important;
      }}
      `}</style>

      {isOpen && (
        <RegistrationModal
          setIsOpen={setIsOpen}
          onSuccess={handleRegistrationSuccess}
          selectedEventTitle={selectedEventTitle}
          eventId={selectedEventId}
        />
      )}
    </>
  );
}
