import React, { useRef } from 'react'; 
import '../styles/Aboutus.css';
import NetworkCanvas from '../components/NetworkCanvas';
import { Users, ShieldCheck, Briefcase, Rocket, Cpu, UserSquare, Zap, CalendarDays, LibraryBig, Award, ArrowDown } from 'lucide-react';

const teamMembersData = [
  { id: 1, name: "عبد السلام الصوان", role: "رئيس الهيئة الطلابية",info:"تمثيل الطلاب أمام الإدارة والإشراف العام على كافة المكاتب والأنشطة لضمان سير العمل الطلابي بفعالية", icon: <Users size={32} /> },
  { id: 2, name: "شهد عبّارة", role: "نائب الرئيس / مسؤول مكتب التدريب",info:"تنظيم الدورات التدريبية والورشات اعلمية لتطوير مهارات الطلاب الاكاديمية والمهنية وبطهم بسوق العمل", icon: <ShieldCheck size={32} /> },
  { id: 3, name: "رقية الأبرش", role: "مسؤول المكتب الأكاديمي", info:"متابعة الشؤون الدراسية للطلاب، وتوفير المصادر العلمية والتنسيق مع الأقسام الأكاديمية لحل المشكلات التعليمية",icon: <Briefcase size={32} /> },
  { id: 4, name: "هبه شيخ السوق", role: "معاون المكتب الأكاديمي",info:"دعم المكتب الأكاديمي في تنظيم المحاضرات الإضافية وتنسيق الملحقات الدراسية وتسهيل التواصل مع الطلاب", icon: <Rocket size={32} /> },
  { id: 5, name: "همام الصّافي", role: "مسؤول مكتب التنظيم",info:"الإشراف على التنظيم اللوجستي للفعاليات، وإدارة الموارد البشرية وتنسيق الجهود بين أعضاء الهيئة", icon: <Cpu size={32} /> },
  { id: 6, name: "مريم عبد المولى", role: "مسؤول الإعلام", info:"إدارة المنصات الرقمية، تغطية النشاطات، وصياغة المحتوى الإعلامي الذي يعبر عن صوت الطلاب وأنشطتهم",icon: <UserSquare size={32} /> },
  { id: 7, name: "عفاف شاهين", role: "معاون في مكتب التنظيم", info:"المساهمة في تخطيط الفعاليات الميدانية وضمان التزام الفرق التنفيذية بالخطة الموضوعة والجدول الزمني",icon: <Zap size={32} /> },
  { id: 8, name: "أسامة دعبوس", role: "مسؤوول مكتب التقييم والمتابعة", info:"قياس أداء المكاتب والأنشطة، وجمع ملاحظات الطلاب لتحسين جودة الخدمات المقدمة من الهيئة",icon: <CalendarDays size={32} /> },
  { id: 9, name: "أنطون عازار", role: "معاون مكتب التدريب",info:"التنسيق مع المدربين والجهات الخارجية لتجهيز اللوازم اللوجستية والتقنية الخاصة بالجلسات التدريبية" ,icon: <LibraryBig size={32} /> },
  { id: 10, name: "نسمة الحصرية", role: "مسؤوول مكتب الفعاليات",info:"بتكار وتنظيم المهرجانات، المسابقات، والفعاليات الاجتماعية والترفيهية التي تعزز الروح الجماعية في الكلية" ,icon: <Award size={32} /> },
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