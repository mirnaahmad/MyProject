import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Heart,
  Calendar,
  GraduationCap,
  Clock,
  Activity,
} from "lucide-react";
import "../../styles/Admin.css";

// استيراد البيانات
import {
  STATS,
  CHART_DATA,
  ACTIVITY_FEED,
  LATEST_EVENTS,
} from "../../data/mockData";

export default function AdminDashboard() {
  const PIE_COLORS = ["var(--accent)", "var(--info)"];

  return (
    <div className="dashboard-container" dir="rtl">
      {/* هيدر الصفحة */}
      <header className="dashboard-header">
        <h1>لوحة التحكم الإحصائية</h1>
        <p>نظرة عامة على أداء المنصة والنشاطات الأخيرة.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>الأعضاء</p>
            <h3>{STATS.members}</h3>
          </div>
          <div className="stat-icon unified-neon-icon">
            <Users size={22} strokeWidth={3} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>المستفيدين</p>
            <h3>{STATS.beneficiaries}</h3>
          </div>
          <div className="stat-icon unified-neon-icon">
            <Heart size={22} strokeWidth={3} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>الفعاليات</p>
            <h3>{STATS.events}</h3>
          </div>
          <div className="stat-icon unified-neon-icon">
            <Calendar size={22} strokeWidth={3} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>التدريبات</p>
            <h3>{STATS.training}</h3>
          </div>
          <div className="stat-icon unified-neon-icon">
            <GraduationCap size={22} strokeWidth={3} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>الساعات التدريبية</p>
            <h3>{STATS.hours}</h3>
          </div>
          <div className="stat-icon unified-neon-icon">
            <Clock size={22} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* القسم الرئيسي للرسوم والنشاطات */}
      <div className="charts-activity-grid">
        {/* 2. الرسم البياني الخطي */}
        <div className="main-card">
          <h2>حركة التسجيل السنوية</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={CHART_DATA.registrations}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.03)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--text-light)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-light)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--navy-900)",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    textAlign: "right",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--accent)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--navy-950)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="عدد التسجيلات"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. الدائرة */}
        <div className="main-card pie-card-container">
          <h2>حالة الفعاليات </h2>
          <div className="pie-chart-wrapper">
            <div className="pie-responsive-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CHART_DATA.eventStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={0} /* صفر تعني دائرة مغلقة وممتلئة بالكامل */
                    outerRadius={80}
                    dataKey="value"
                  >
                    {CHART_DATA.eventStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="var(--card-bg)" /* فاصل لوني ناعم بلون الكرت الأساسي */
                        strokeWidth={2}
                        style={{ outline: "none" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="custom-legend">
              {CHART_DATA.eventStatus.map((item, i) => (
                <div key={i} className="legend-item">
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                  <span className="legend-text">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="main-card" style={{ gridColumn: "1 / -1" }}>
          <h2>نظرة تحليلية على الفعاليات الحالية</h2>
          <div className="two-columns-container">
            <div className="column-side">
              <h3 className="column-title">تفاصيل الفعاليات</h3>
              <div className="events-cards-list">
                {LATEST_EVENTS.map((event) => (
                  <div key={event.id} className="modern-row-card">
                    <div className="row-card-right">
                      <div className={`status-indicator-dot ${event.status}`} />
                      <div>
                        <h4>{event.title}</h4>
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <span className={`status-text-badge ${event.status}`}>
                      {event.statusText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="column-side">
              <h3 className="column-title">معدلات الإقبال والتسجيل</h3>
              <div className="progress-bars-list">
                {LATEST_EVENTS.map((event) => (
                  <div key={event.id} className="progress-metric-item">
                    <div className="metric-info">
                      <span>{event.title}</span>
                      <strong>{event.registered} مشترك</strong>
                    </div>
                    <div className="metric-bar-bg">
                      <div
                        className={`metric-bar-fill ${event.status}`}
                        style={{
                          width: `${Math.min((event.registered / 250) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="main-card"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="card-header-with-icon">
            <div className="card-title-flex">
              <span className="title-icon">
                <Activity size={18} />
              </span>
              <h2>سجل الأنشطة والعمليات الحالية</h2>
            </div>
          </div>

          <div
            className="timeline-container"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            {ACTIVITY_FEED.map((activity) => (
              <div
                key={activity.id}
                className="timeline-item"
                style={{ marginBottom: "0px" }}
              >
                <div className="timeline-badge-zone">
                  <div className={`timeline-dot dot-${activity.type}`} />
                  <div className="timeline-connect-line" />
                </div>

                <div
                  className="timeline-content-box"
                  style={{ padding: "12px", width: "100%" }}
                >
                  <p
                    className="timeline-text"
                    style={{ fontSize: "13.5px", lineHeight: "1.4", margin: 0 }}
                  >
                    {activity.text}
                  </p>
                  <span
                    className="timeline-time"
                    style={{
                      fontSize: "11px",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="main-card">
          <div className="card-header-with-icon">
            <div className="card-title-flex">
              <span className="title-icon" style={{ color: "var(--info)" }}>
                <Users size={18} />
              </span>
              <h2>نسبة تفاعل الطلاب حسب السنوات الدراسية</h2>
            </div>
          </div>

          <div className="geo-distribution-list">
            {[
              {
                label: "السنة الأولى",
                percentage: 15,
                color: "var(--warning)",
              },
              { label: "السنة الثانية", percentage: 20, color: "var(--info)" },
              {
                label: "السنة الثالثة",
                percentage: 25,
                color: "var(--accent)",
              },
              {
                label: "السنة الرابعة",
                percentage: 22,
                color: "var(--success)",
              },
              {
                label: "السنة الخامسة",
                percentage: 18,
                color: "var(--purple, #a855f7)",
              },
            ].map((year, index) => (
              <div className="geo-item" key={index}>
                <div className="geo-meta">
                  <div className="geo-identity">
                    <span>{year.label}</span>
                    <small className="geo-count-badge">
                      {((STATS.beneficiaries * year.percentage) / 100).toFixed(
                        0,
                      )}{" "}
                      طالب
                    </small>
                  </div>
                  <strong>{year.percentage}%</strong>
                </div>
                <div className="geo-bar-bg">
                  <div
                    className="geo-bar-fill"
                    style={{
                      width: `${year.percentage}%`,
                      backgroundColor: year.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
