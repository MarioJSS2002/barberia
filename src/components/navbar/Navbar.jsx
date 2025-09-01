import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="nav__container">
        <div className="nav__brand">
          <span className="brand__icon" aria-hidden="true" />
          <span className="brand__text font-rock">Rock Barbershop</span>
        </div>
        <ul className="nav__links" role="list">
          <li>
            <a href="#inicio">Inicio</a>
          </li>
          <li>
            <a href="#servicios">Servicios</a>
          </li>
          <li>
            <a href="#galeria">Galería</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>
        <button className="nav__menu" aria-label="Abrir menú">
          Menú
        </button>
      </nav>
    </header>
  );
}
