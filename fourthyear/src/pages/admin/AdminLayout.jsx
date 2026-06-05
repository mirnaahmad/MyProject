import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import "../../styles/AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout" dir="rtl">
      <header className="admin-top-navbar">
        <div className="nav-right-side">
          <span className="admin-nav-brand">لوحة التحكم</span>
          <nav className="admin-nav-links">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `nav-tab-item ${isActive ? "active" : ""}`
              }
            >
              الرئيسية والإحصائيات
            </NavLink>

            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                `nav-tab-item ${isActive ? "active" : ""}`
              }
            >
              إدارة الفعاليات
            </NavLink>
          </nav>
        </div>

        <div className="nav-left-side">
          <Link to="/" className="exit-admin-btn">
            العودة للموقع ⬅
          </Link>
        </div>
      </header>

      <main className="admin-content-viewport">
        <Outlet />
      </main>
    </div>
  );
}
