import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ChevronLeft, MapPin, Users, Ticket, ArrowRight, CheckCircle2, Tag } from 'lucide-react'
import NetworkCanvas from '../components/NetworkCanvas'
import { EVENTS } from '../data/mockData'

export default function EventDetailPage() {
  const { id } = useParams()
  const event = EVENTS.find(e => e.id === parseInt(id)) || EVENTS[0]
  
  const related = EVENTS.filter(e => e.id !== event.id).slice(0, 2)

  return (
    <>
      {/* ── HERO ── */}
      <section className="page-hero" style={{ minHeight: '300px' }}>
        <NetworkCanvas />
        <div className="container page-hero-content">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            تفاصيل الفعالية
          </motion.h1>
          <motion.nav className="breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link to="/">الرئيسية</Link> <ChevronLeft size={14} />
            <Link to="/events">الفعاليات</Link> <ChevronLeft size={14} />
            <span style={{ color: 'var(--white)' }}>{event.title}</span>
          </motion.nav>
        </div>
      </section>

      {/* ── DETAIL ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '32px', alignItems: 'flex-start' }} className="detail-grid">
            
            {/* Main Content */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="card" style={{ padding: '36px' }}>
                {event.featured && <span className="badge badge-blue" style={{ marginBottom: '16px' }}>فعالية مميزة</span>}
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>{event.title}</h2>
                
                <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.9', marginBottom: '32px' }}>
                  {event.description}
                </p>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--blue-200)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 color="var(--accent)" /> محاور الجلسة
                </h3>
                
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-light)' }}>
                  {event.agenda.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--accent)', marginTop: '6px' }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>فعاليات ذات صلة</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '20px' }}>
                  {related.map(rel => (
                    <Link to={`/events/${rel.id}`} key={rel.id} className="card event-card" style={{ display: 'block' }}>
                      <div className="event-card-img-wrap" style={{ height: '140px' }}>
                        <img src={rel.img} alt={rel.title} className="event-card-img" />
                      </div>
                      <div className="event-card-body">
                        <h4 className="event-card-title" style={{ fontSize: '.9rem' }}>{rel.title}</h4>
                        <div className="event-card-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> {rel.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ position: 'sticky', top: '90px' }}>
              <div className="card" style={{ padding: '28px' }}>
                <img src={event.speakerImg} alt={event.speaker} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '2px solid rgba(74,144,226,.3)', marginBottom: '16px' }} />
                <h3 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>{event.speaker}</h3>
                <p style={{ textAlign: 'center', fontSize: '.85rem', color: 'var(--gray-400)', marginBottom: '24px' }}>{event.speakerTitle}</p>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <MetaRow icon={<Calendar size={16}/>} label="التاريخ" value={event.date} />
                  <MetaRow icon={<Clock size={16}/>} label="الوقت" value={event.time} />
                  <MetaRow icon={<Clock size={16}/>} label="المدة" value={event.duration} />
                  <MetaRow icon={<MapPin size={16}/>} label="المكان" value={event.location} />
                  <MetaRow icon={<Users size={16}/>} label="المشاركون" value={`${event.attendees} مشارك`} />
                  <MetaRow icon={<Tag size={16}/>} label="السعر" value={<span style={{ color: 'var(--success)', fontWeight: 800 }}>{event.price}</span>} border={false} />
                </div>

                <Link to="/auth" className="btn btn-primary" style={{ width: '100%', marginTop: '24px', padding: '14px' }}>
                  <Ticket size={18} /> احجز مقعدك الآن
                </Link>
                <Link to="/events" className="btn btn-ghost" style={{ width: '100%', marginTop: '10px' }}>
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
    </>
  )
}

const MetaRow = ({ icon, label, value, border = true }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: border ? '1px solid rgba(91,155,213,.15)' : 'none', fontSize: '.88rem' }}>
    <span style={{ color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon} {label}
    </span>
    <span style={{ color: 'var(--white)', fontWeight: 600 }}>{value}</span>
  </div>
)
