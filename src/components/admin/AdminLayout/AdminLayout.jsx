import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const isActive = (p) => pathname.startsWith(p);

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <span className="brand__dot" />
          <span className="brand__text font-rock">Barbería Rock</span>
        </div>
        <nav className="admin__nav">
          <Link
            className={`nav__item ${
              isActive("/admin/dashboard") ? "is-active" : ""
            }`}
            to="/admin/dashboard"
          >
            <span className="nav__icon">🏠</span> Dashboard
          </Link>
          <Link
            className={`nav__item ${
              isActive("/admin/appointments") ? "is-active" : ""
            }`}
            to="/admin/appointments"
          >
            <span className="nav__icon">📅</span> Citas
          </Link>
          <Link
            className={`nav__item ${
              isActive("/admin/clients") ? "is-active" : ""
            }`}
            to="/admin/clients"
          >
            <span className="nav__icon">👤</span> Clientes
          </Link>
          <Link
            className={`nav__item ${
              isActive("/admin/services") ? "is-active" : ""
            }`}
            to="/admin/services"
          >
            <span className="nav__icon">✂️</span> Servicios
          </Link>
        </nav>
        <div className="admin__footer">
          <Link className="nav__item nav__settings" to="/admin/settings">
            ⚙️ Ajustes
          </Link>
        </div>
      </aside>

      <section className="admin__content">{children}</section>
    </div>
  );
}
