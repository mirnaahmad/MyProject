import { Link } from 'react-router-dom'
import { Facebook, Send, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy-900)', borderTop: '1px solid rgba(91,155,213,.15)', padding: '50px 0 30px', justifyContent:'center'}}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
     

         

           <div>
             <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(91,155,213,.2)' }}>تواصل معنا</div>
             <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <ul style={{listStyle:'none', padding:0,margin:0,display:'flex',flexDirection:'column',gap:'20px'}}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', }}> <a href="https://www.facebook.com/share/1K538jgAMs/https://www.facebook.com/share/1K538jgAMs/" style={socialStyle}><Facebook size={18} /></a> <span style={{ color: 'var(--white)', fontSize: '1rem' }}>الهيئة الطلابية في كلية الهندسة المعلوماتية في جامعة حمص</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', }}>  <a href="https://t.me/ITE_N_HOMS" style={socialStyle}><Send size={18} /></a><span style={{ color: 'var(--white)', fontSize: '1rem' }}>it.homs.uni</span> </li> 
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px', }}>  <a href="https://www.instagram.com/it.homs.uni?igsh=b3ZtODF4NmNjNWNw" style={socialStyle}><Instagram size={18} /></a><span style={{ color: 'var(--white)', fontSize: '1rem',direction:'ltr' }}>IT Homs | الهيئة الطلابية</span> </li>
                </ul>
             </div>
          </div>
{/*  */}
           <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(91,155,213,.2)' }}>روابط سريعة</div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ color: 'var(--gray-400)', fontSize: '.88rem'}}>Home</Link></li>
              <li><Link to="/events" style={{ color: 'var(--gray-400)', fontSize: '.88rem' }}>Events</Link></li>
              <li><Link to="/AboutUs" style={{ color: 'var(--gray-400)', fontSize: '.88rem' }}>About us</Link></li>
            </ul>
          </div>

         
        </div>

        <div style={{ borderTop: '1px solid rgba(91,155,213,.1)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <p style={{ fontSize: '.82rem', color: 'var(--gray-600)' }}>© {new Date().getFullYear()} الهيئة الطلابية — كلية الهندسة المعلوماتية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

const socialStyle = {
  width: '38px', height: '38px', borderRadius: '50%',
  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(91,155,213,.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--gray-400)', transition: 'var(--transition)'
}
