import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ChevronLeft, MapPin, Users, Info, Ticket } from 'lucide-react'
import NetworkCanvas from '../components/NetworkCanvas'
import { EVENTS, ARCHIVE_EVENTS } from '../data/mockData'

export default function EventsPage() {
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...new Set(EVENTS.map(e => e.category))]

  const filteredEvents = EVENTS.filter(e => filter === 'all' || e.category === filter)
  const featuredEvent = EVENTS.find(e => e.featured)

  return (
    <>
      {/* ── HERO ── */}
      <section className="page-hero">
        <NetworkCanvas />
        <div className="container page-hero-content">
          <motion.h1 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            جميع الفعاليات
          </motion.h1>
          <motion.nav 
            className="breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <Link to="/">الرئيسية</Link>
            <ChevronLeft size={14} />
            <span>الفعاليات</span>
          </motion.nav>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="section">
        <div className="container">
          
          <h2 className="section-title">الفعاليات القادمة</h2>

          {/* Featured */}
          {featuredEvent && (
            <motion.div 
              className="card" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '30px', alignItems: 'center', padding: '36px 40px', marginBottom: '36px', background: 'linear-gradient(135deg, var(--navy-700), var(--navy-600))', position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ position: 'absolute', top: '-60px', right: '200px', width: '200px', height: '200px', background: 'radial-gradient(var(--accent-glow),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              
              <span className="badge badge-blue" style={{ position: 'absolute', top: '18px', left: '18px', background: 'linear-gradient(135deg,var(--blue-400),var(--accent))', color: '#fff', border: 'none' }}>مميز</span>
              
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>{featuredEvent.title}</h3>
                <p style={{ color: 'var(--blue-200)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.9rem' }}>
                  <Users size={16} /> المحاضر: {featuredEvent.speaker}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px', fontSize: '.85rem', color: 'var(--text-light)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} color="var(--accent)"/> {featuredEvent.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} color="var(--accent)"/> {featuredEvent.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--accent)"/> {featuredEvent.location}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to={`/events/${featuredEvent.id}`} className="btn btn-primary">
                    <Ticket size={16} /> احجز مقعدك
                  </Link>
                  <Link to={`/events/${featuredEvent.id}`} className="btn btn-outline-blue">
                    <Info size={16} /> تفاصيل
                  </Link>
                </div>
              </div>
              <img src={featuredEvent.speakerImg} alt={featuredEvent.speaker} style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(74,144,226,.5)', boxShadow: '0 0 30px rgba(74,144,226,.3)', display: 'block' }} className="d-none-mobile" />
            </motion.div>
          )}

          {/* Filter */}
          <div className="filter-bar">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setFilter(cat)}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                style={{ padding: '6px 16px', borderRadius: '50px' }}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence>
              {filteredEvents.map(event => (
                <motion.div 
                  key={event.id} layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                  className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'center', padding: '22px 28px' }}
                >
                  <img src={event.speakerImg} alt={event.speaker} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '2px solid rgba(74,144,226,.3)' }} className="d-none-mobile" />
                  
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{event.title}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '.82rem', color: 'var(--gray-400)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} color="var(--accent)" /> {event.speaker}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Info size={14} color="var(--blue-300)" /> {event.category}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="row-to-col">
                    <div style={{ textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontSize: '.7rem', fontWeight: 700, background: 'var(--accent)', color: '#fff', padding: '3px 10px', borderRadius: '8px 8px 0 0' }}>
                        {event.date.split(' ')[1]}
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--navy-600)', borderRadius: '0 0 8px 8px', lineHeight: 1, padding: '6px 0' }}>
                        {event.date.split(' ')[0]}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="actions-group">
                      <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm" style={{ width: '100px' }}>احجز</Link>
                      <Link to={`/events/${event.id}`} className="btn btn-ghost btn-sm" style={{ width: '100px' }}>تفاصيل</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredEvents.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>لا توجد فعاليات في هذا التصنيف حالياً.</p>
            )}
          </div>

        </div>
      </section>

      {/* ── ARCHIVE ── */}
      <section className="section section-dark" id="archive">
        <div className="container">
          <h2 className="section-title">أرشيف الفعاليات</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '20px' }}>
            {ARCHIVE_EVENTS.map((item, i) => (
              <motion.div 
                key={item.id} className="card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover', filter: 'brightness(.8) saturate(.8)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '6px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.title}</h4>
                  <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', display: 'flex', justifyContent: 'space-between' }}>
                    <span><Calendar size={12} style={{marginRight:3}} /> {item.date}</span>
                    <span className="badge badge-navy" style={{ padding: '1px 8px', fontSize: '.65rem' }}>{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .d-none-mobile { display: none !important; }
          .row-to-col { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .actions-group { flex-direction: row !important; }
        }
      `}</style>
    </>
  )
}
