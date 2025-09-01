import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirm) {
      alert("Por favor complete todos los campos");
      return;
    }
    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // TODO: conectar con API real
    alert(`Cuenta creada para ${form.fullName}`);

    // 1) limpiar campos
    setForm({ fullName: "", email: "", password: "", confirm: "" });

    // 2) redirigir a login con bandera de éxito
    navigate("/login?registered=1", { replace: true });
  };

  return (
    <div className="register">
      <div className="register__card">
        <h1 className="register__title font-rock">
          CREAR
          <br />
          CUENTA
        </h1>

        <form className="register__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Nombre completo</span>
            <input
              className="field__input"
              name="fullName"
              placeholder="Ingresa tu nombre completo"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
          </label>

          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__input"
              name="email"
              type="email"
              placeholder="Ingresa tu email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="field__label">Contraseña</span>
            <input
              className="field__input"
              name="password"
              type="password"
              placeholder="Crea una contraseña"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </label>

          <label className="field">
            <span className="field__label">Confirmar contraseña</span>
            <input
              className="field__input"
              name="confirm"
              type="password"
              placeholder="Confirma tu contraseña"
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </label>

          <button className="btn btn--primary" type="submit">
            REGISTRARSE
          </button>
        </form>

        <p className="register__footer">
          ¿Ya tienes una cuenta?{" "}
          <Link className="link-red" to="/login">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
