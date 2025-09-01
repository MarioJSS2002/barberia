import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Login.css";
import { useNavigate } from 'react-router-dom';
export default function Login() {

  const [params] = useSearchParams();
  const justRegistered = params.get("registered") === "1";
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = (form.get("username") || "").toString().trim();
    const password = (form.get("password") || "").toString().trim();
    if (!username || !password) {
      alert("Por favor completa usuario y contraseña.");
      return;
    }
    alert(`Entrando como ${username}…`);
    navigate("/book", { replace: true });
  };

  return (
    <div className="login">
      <div className="login__card">
        {justRegistered && (
          <div className="login__alert" role="status">
            ¡Cuenta creada! Ahora inicia sesión.
          </div>
        )}
        <h1 className="login__title font-rock">
          INICIAR
          <br />
          SESIÓN
        </h1>
        <p className="login__subtitle">
          Accede a tu cuenta para agendar tu cita.
        </p>
        <form onSubmit={onSubmit} className="login__form">
          <label className="field">
            <span className="field__label">Usuario</span>
            <input
              name="username"
              placeholder="Usuario"
              className="field__input"
            />
          </label>
          <label className="field">
            <span className="field__label">Contraseña</span>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="field__input"
            />
          </label>
          <button type="submit" className="btn btn--primary">
            ENTRAR
          </button>
        </form>
        <p className="login__footer">
          ¿Nuevo en Rock Barbershop?{" "}
          <Link className="link-red" to="/register">
            Crea una cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
