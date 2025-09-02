import React, { useMemo, useState, useEffect } from "react";
import "./Booking.css";

const SERVICES = [
  {
    id: "svc1",
    name: "Corte de Pelo",
    desc: "Un corte de pelo  a tu estilo.",
    price: 5000,
  },
  {
    id: "svc2",
    name: "Afeitado de Barba",
    desc: "Afeitado con toalla caliente.",
    price: 2500,
  },
  {
    id: "svc3",
    name: "Corte de Pelo y Afeitado de Barba",
    desc: "Corte de cabello y afeitado de barba con toalla caliente.",
    price: 8500,
  },
  {
    id: "svc4",
    name: "Paquete Completo",
    desc: "Corte de pelo y arreglo de barba.",
    price: 6000,
  },
];

const BARBERS = [
  { id: "b1", name: "Yiyo Blade" },
  { id: "b2", name: "Douglas Steel" },
  { id: "b3", name: "Ace Scissors" },
];

const TIMES = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

function useCalendar(initial = new Date()) {
  const [cursor, setCursor] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1)
  );
  const goPrev = () =>
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () =>
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const { cells, label } = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const firstDow = first.getDay(); // 0=Domingo
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < firstDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(y, m, d));
    while (arr.length % 7 !== 0) arr.push(null);
    const monthLabel = cursor.toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });
    return {
      cells: arr,
      label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    };
  }, [cursor]);

  return { cursor, goPrev, goNext, cells, label };
}

export default function Booking() {
  const [serviceId, setServiceId] = useState("svc3");
  const [barberId, setBarberId] = useState(BARBERS[0].id);
  const [time, setTime] = useState(TIMES[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { goPrev, goNext, cells, label } = useCalendar();

  // formatter for Costa Rican colón
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0,
      }),
    []
  );

  // start of today (00:00) used to disable past dates
  const todayStart = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // helper: parse time like "09:00 AM" into 24h {h,m}
  const parseTime = (timeStr) => {
    const [timePart, ampm] = timeStr.split(" ");
    const [hh, mm] = timePart.split(":").map(Number);
    let h = hh % 12;
    if (ampm && ampm.toUpperCase() === "PM") h += 12;
    return { h, m: mm };
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // when user picks a date, if it's today pick the first future time automatically
  useEffect(() => {
    if (!selectedDate) return;
    const sel = new Date(selectedDate);
    const now = new Date();
    if (!isSameDay(sel, now)) return;
    const firstAvailable = TIMES.find((t) => {
      const { h, m } = parseTime(t);
      const dt = new Date(sel);
      dt.setHours(h, m, 0, 0);
      return dt > now;
    });
    if (firstAvailable) setTime(firstAvailable);
  }, [selectedDate]);

  const confirm = (e) => {
    e.preventDefault();
    if (!serviceId || !selectedDate) {
      alert("Debes elegir servicio y fecha.");
      return;
    }

    // prevent confirming a past datetime
    const sel = new Date(selectedDate);
    const { h, m } = parseTime(time);
    sel.setHours(h, m, 0, 0);
    if (sel <= new Date()) {
      alert("No puedes reservar en una fecha u hora pasada.");
      return;
    }

    const svc = SERVICES.find((s) => s.id === serviceId)?.name;
    const barb = BARBERS.find((b) => b.id === barberId)?.name;
    const dt = new Date(selectedDate);
    alert(
      `Reserva confirmada: ${svc} con ${barb} el ${dt.toLocaleDateString()} a las ${time}`
    );
  };

  return (
    <div className="booking">
      <h1 className="booking__title font-rock">RESERVA TU CITA</h1>
      <p className="booking__subtitle">
        Elige el servicio, la fecha y hora que te venga mejor.
      </p>

      <div className="booking__grid">
        {/* Servicios */}
        <section className="panel services">
          <h2 className="panel__title font-rock">ELIGE TU SERVICIO</h2>
          <ul className="service__list">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`service__item ${
                    serviceId === s.id ? "is-active" : ""
                  }`}
                  onClick={() => setServiceId(s.id)}
                >
                  <div className="service__meta">
                    <div className="service__name">{s.name}</div>
                    <div className="service__desc">{s.desc}</div>
                  </div>
                  <div className="service__price">
                    {formatter.format(s.price)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Calendario + selects */}
        <section className="panel calendar">
          <div className="cal__header">
            <button
              className="cal__nav"
              onClick={goPrev}
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <div className="cal__label">{label}</div>
            <button
              className="cal__nav"
              onClick={goNext}
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>

          <div className="cal__grid cal__week">
            {["DO", "LU", "MA", "MI", "JU", "VI", "SA"].map((d) => (
              <div key={d} className="cal__dow">
                {d}
              </div>
            ))}
          </div>

          <div className="cal__grid cal__days">
            {cells.map((d, idx) => {
              const isSelected =
                d &&
                selectedDate &&
                new Date(selectedDate).toDateString() === d.toDateString();

              // determine if the date is in the past (before today)
              const isPast =
                d &&
                new Date(d.getFullYear(), d.getMonth(), d.getDate()) <
                  todayStart;

              const isEmpty = !d;
              return (
                <button
                  type="button"
                  key={idx}
                  disabled={isEmpty || isPast}
                  onClick={() =>
                    d && !isPast && setSelectedDate(d.toISOString())
                  }
                  className={`cal__day ${isEmpty ? "is-empty" : ""} ${
                    isSelected ? "is-selected" : ""
                  } ${isPast ? "is-past" : ""}`}
                >
                  {d ? d.getDate() : ""}
                </button>
              );
            })}
          </div>

          <div className="selectors">
            <label className="sel">
              <span className="sel__label">Barbero</span>
              <select
                className="sel__control"
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
              >
                {BARBERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="sel">
              <span className="sel__label">Hora disponible</span>
              <select
                className="sel__control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {TIMES.map((t) => {
                  const now = new Date();
                  const isToday =
                    selectedDate && isSameDay(new Date(selectedDate), now);
                  const { h, m } = parseTime(t);
                  const optDate = selectedDate
                    ? new Date(selectedDate)
                    : new Date();
                  optDate.setHours(h, m, 0, 0);
                  const disabled = isToday && optDate <= now;
                  return (
                    <option key={t} value={t} disabled={disabled}>
                      {t}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <button className="btn btn--primary btn--confirm" onClick={confirm}>
            Confirmar Reserva
          </button>
        </section>
      </div>
    </div>
  );
}
