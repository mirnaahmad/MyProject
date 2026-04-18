import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogIn, Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
// حطيت تايم أوت مشان التحديث يتم بعد الرندرة
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location])

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About us', path: '/aboutUs' }
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '68px', display: 'flex', alignItems: 'center', transition: 'var(--transition)',
        ... (scrolled ? {
          background: 'rgba(6,15,30,.92)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(91,155,213,.15)', boxShadow: 'var(--shadow-md)'
        } : {})
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt='logo' style={{ width: '50px',height:'auto'}} />
            
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--blue-200)', lineHeight: 1.3 }}>
              الهيئة الطلابية<br/>كلية الهندسة المعلوماتية
            </div>
          </Link>
        

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="d-none-mobile">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                style={{
                  padding: '7px 16px', borderRadius: '50px', fontSize: '.9rem', fontWeight: 500,
                  transition: 'var(--transition)', position: 'relative',
                  color: isActive(link.path) ? 'var(--white)' : 'var(--text-light)',
                  background: isActive(link.path) ? 'rgba(74,144,226,.15)' : 'transparent'
                }}
              >
                {link.name}
                {isActive(link.path) && (
                  <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', background: 'var(--accent)', borderRadius: '50%' }} />
                )}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/auth" className="btn btn-primary btn-sm d-none-mobile" style={{ marginRight: '8px' }}>
              <LogIn size={16} /> تسجيل الدخول
            </Link>
            
            <button 
              className="d-show-mobile" 
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', color: 'var(--white)' }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0,
          background: 'rgba(6,15,30,.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(74,144,226,.15)', zIndex: 999,
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                color: isActive(link.path) ? 'var(--white)' : 'var(--text-light)',
                background: isActive(link.path) ? 'rgba(74,144,226,.12)' : 'transparent',
                fontWeight: 500
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/auth" style={{ padding: '12px 16px', color: 'var(--blue-300)', fontWeight: 700 }}>
            تسجيل الدخول
          </Link>
        </div>
      )}
      
      <style>{`
        .d-show-mobile { display: none; }
        @media (max-width: 768px) {
          .d-none-mobile { display: none !important; }
          .d-show-mobile { display: flex; }
        }
      `}</style>
    </>
  )
}
