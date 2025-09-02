import React, { useMemo, useState } from "react";
import "./AdminAppointments.css";

// Mock de datos hasta conectar backend
const APPTS = [
  {
    date: "2025-09-02",
    time: "12:00 PM",
    client: "Ricardo",
    barber: "Axel",
    service: "Corte de cabello",
  },
  {
    date: "2025-09-02",
    time: "11:30 AM",
    client: "Alejandro",
    barber: "Vince",
    service: "Afeitado de barba",
  },
  {
    date: "2025-09-08",
    time: "01:00 PM",
    client: "Carlos",
    barber: "Slash",
    service: "Corte y peinado",
  },
  {
    date: "2025-09-10",
    time: "09:00 AM",
    client: "Daniel",
    barber: "Axel",
    service: "Corte de cabello",
  },
  {
    date: "2025-09-04",
    time: "10:30 AM",
    client: "Eduardo",
    barber: "Vince",
    service: "Afeitado de barba",
  },
];

const BARBERS = ["Todos", "Axel", "Vince", "Slash"];
const SERVICES = [
  "Todos",
  "Corte de cabello",
  "Afeitado de barba",
  "Corte y peinado",
];

export default function AdminAppointments() {
  const [q, setQ] = useState("");
  const [barber, setBarber] = useState("Todos");
  const [service, setService] = useState("Todos");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    const now = new Date();

    // enrich with Date object and delta from now
    const enriched = APPTS.map((a) => {
      const [y, m, d] = a.date.split("-").map(Number);
      const [timePart, ampm] = a.time.split(" ");
      const [hh, mm] = timePart.split(":").map(Number);
      let h = hh % 12;
      if (ampm && ampm.toUpperCase() === "PM") h += 12;
      const dt = new Date(y, m - 1, d, h, mm || 0, 0, 0);
      const delta = dt - now;
      return { ...a, dt, delta };
    });

    // apply filters
    const filteredList = enriched.filter((a) => {
      const matchQ =
        q.trim() === "" ||
        `${a.client} ${a.service}`.toLowerCase().includes(q.toLowerCase());
      const matchBarber = barber === "Todos" || a.barber === barber;
      const matchService = service === "Todos" || a.service === service;
      const matchDate = !date || a.date === date;
      return matchQ && matchBarber && matchService && matchDate;
    });

    // sort so upcoming (delta >= 0) come first ordered by soonest, then past ones
    filteredList.sort((a, b) => {
      const pa = a.delta >= 0 ? 0 : 1;
      const pb = b.delta >= 0 ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return a.delta - b.delta;
    });

    return filteredList;
  }, [q, barber, service, date]);

  const createNew = () => {
    // Aquí puedes abrir modal o navegar a /book
    alert('Abrir flujo "Nueva Cita"');
  };

  return (
    <div className="appts">
      <div className="appts__top">
        <div>
          <h1 className="appts__title font-rock">Citas</h1>
          <p className="appts__subtitle">
            Aquí puedes ver y gestionar todas tus citas programadas.
          </p>
        </div>
        <button className="btn btn--primary" onClick={createNew}>
          + Nueva Cita
        </button>
      </div>

      <div className="appts__searchbar">
        <span className="search__icon">🔎</span>
        <input
          type="text"
          className="search__input"
          placeholder="Buscar por cliente, servicio..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="appts__filters">
        <label className="f__item">
          <span className="f__label">Fecha</span>
          <input
            type="date"
            className="f__control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="f__item">
          <span className="f__label">Barbero</span>
          <select
            className="f__control"
            value={barber}
            onChange={(e) => setBarber(e.target.value)}
          >
            {BARBERS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="f__item">
          <span className="f__label">Servicio</span>
          <select
            className="f__control"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="appts__tablewrap">
        <table className="appts__table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicio</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={idx}>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td className="cell--strong">{a.client}</td>
                <td>{a.barber}</td>
                <td>{a.service}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="cell--empty">
                  Sin resultados para los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
