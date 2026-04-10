import React, { useRef } from 'react'; 
import '../styles/Aboutus.css';
import NetworkCanvas from '../components/NetworkCanvas';
import { Users, ShieldCheck, Briefcase, Rocket, Cpu, UserSquare, Zap, CalendarDays, LibraryBig, Award, ArrowDown } from 'lucide-react';

const teamMembersData = [
  { id: 1, name: "عبد السلام الصوان", role: "رئيس الهيئة الطلابية",info:"tgdtdtdoohop;ppuirfd", icon: <Users size={32} /> },
  { id: 2, name: "شهد عبّارة", role: "نائب الرئيس / مسؤول مكتب التدريب",info:"tgdtdtdoohop;ppuirfd", icon: <ShieldCheck size={32} /> },
  { id: 3, name: "رقية الأبرش", role: "مسؤول المكتب الأكاديمي", info:"tgdtdtdoohop;ppuirfd",icon: <Briefcase size={32} /> },
  { id: 4, name: "هبه شيخ السوق", role: "معاون المكتب الأكاديمي",info:"tgdtdtdoohop;ppuirfd", icon: <Rocket size={32} /> },
  { id: 5, name: "همام الصّافي", role: "مسؤول مكتب التنظيم",info:"tgdtdtdoohop;ppuirfd", icon: <Cpu size={32} /> },
  { id: 6, name: "مريم عبد المولى", role: "مسؤول الإعلام", info:"tgdtdtdoohop;ppuirfd",icon: <UserSquare size={32} /> },
  { id: 7, name: "عفاف شاهين", role: "معاون في مكتب التنظيم", info:"tgdtdtdoohop;ppuirfd",icon: <Zap size={32} /> },
  { id: 8, name: "أسامة دعبوس", role: "مسؤوول مكتب التقييم والمتابعة", info:"tgdtdtdoohop;ppuirfd",icon: <CalendarDays size={32} /> },
  { id: 9, name: "أنطون عازار", role: "معاون مكتب التدريب",info:"tgdtdtdoohop;ppuirfd" ,icon: <LibraryBig size={32} /> },
  { id: 10, name: "نسمة الحصرية", role: "مسؤوول مكتب الفعاليات",info:"tgdtdtdoohop;ppuirfd" ,icon: <Award size={32} /> },
];

const AboutUs = () => {
  const teamSectionRef = useRef(null);

  const scrollToTeam = () => {
    if (teamSectionRef.current) {
      teamSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="about-us-container">
      <NetworkCanvas />

      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">فريق واحد لخدمة الجميع</h1>
          <p className="hero-description">
            نعمل بشغف لخلق بيئة طلابية نشطة، تساهم في تطوير مهاراتكم وتحسين تجربتكم الجامعية.
          </p>
          
          <div className="hero-team-badge">
            <div className="avatar-group">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mini-avatar"><Users size={16} /></div>
              ))}
              <div className="avatar-more">+5</div>
            </div>
            <span style={{fontSize:'20px'}}>نحنُ 10 أعضاء نعمل لأجلكم</span>
          </div>

          <div className="scroll-hint" onClick={scrollToTeam}>
            <p>اكتشف أعضاء الهيئة</p>
            <ArrowDown className="bounce-icon" size={20} />
          </div>
        </div>
      </section>

      <div className="section-divider">
        <h2 className="main-title">أعضاء الهيئة الطلابية</h2>
      </div>

   <section ref={teamSectionRef} className="team-grid-section">
        <div className="team-grid">
          {teamMembersData.map((member) => (
            <div key={member.id} className="member-card">
              
              {/* الطبقة 1: المحتوى الأساسي (يختفي عند الهوفر) */}
              <div className="card-front">
                <div className="member-avatar">{member.icon}</div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>

              {/* الطبقة 2: المعلومات الإضافية (تظهر عند الهوفر) */}
              <div className="card-back">
                <h4 className="info-title">أبرز المهام</h4>
                <p className="member-info">{member.info}</p>
              </div>

            </div>
          ))}
        
        </div>
      </section>
    </div>
  );
};

export default AboutUs;