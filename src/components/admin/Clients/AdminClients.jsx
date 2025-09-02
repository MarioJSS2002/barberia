import React, { useMemo, useState } from "react";
import "./AdminClients.css";

const INITIAL_USERS = [
  {
    id: "u1",
    name: "Ricardo Mendoza",
    email: "ricardo.mendoza@email.com",
    status: "Activo",
  },
  {
    id: "u2",
    name: "Sofia Castro",
    email: "sofia.castro@email.com",
    status: "Activo",
  },
  {
    id: "u3",
    name: "Javier Ruiz",
    email: "javier.ruiz@email.com",
    status: "Pendiente",
  },
  {
    id: "u4",
    name: "Isabella Torres",
    email: "isabella.torres@email.com",
    status: "Bloqueado",
    blockedReason: { type: "Moroso", details: "Saldo pendiente por 2 citas." },
    blockedAt: "2024-07-05",
  },
  {
    id: "u5",
    name: "Diego Vargas",
    email: "diego.vargas@email.com",
    status: "Activo",
  },
];

const STATUS = ["Todos", "Activo", "Pendiente", "Bloqueado"];
const REASONS = [
  "Moroso",
  "Mala conducta",
  "Incumplimiento de citas (no-show)",
  "Otro",
];

export default function AdminClients() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");

  // Modal de bloqueo
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null); // usuario a bloquear
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter((u) => {
      const matchQ =
        q === "" || `${u.name} ${u.email}`.toLowerCase().includes(q);
      const matchS = status === "Todos" || u.status === status;
      return matchQ && matchS;
    });
  }, [users, query, status]);

  const openBlock = (u) => {
    setTarget(u);
    setReason(REASONS[0]);
    setDetails("");
    setOpen(true);
  };

  const confirmBlock = () => {
    if (!target) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === target.id
          ? {
              ...u,
              status: "Bloqueado",
              blockedReason: {
                type: reason,
                details: details.trim() || undefined,
              },
              blockedAt: new Date().toISOString().slice(0, 10),
            }
          : u
      )
    );
    setOpen(false);
  };

  const unblock = (u) => {
    setUsers((prev) =>
      prev.map((x) =>
        x.id === u.id
          ? {
              ...x,
              status: "Activo",
              blockedReason: undefined,
              blockedAt: undefined,
            }
          : x
      )
    );
  };

  const viewReason = (u) => {
    if (u.status !== "Bloqueado" || !u.blockedReason) return;
    const extra = u.blockedReason.details
      ? `\nDetalles: ${u.blockedReason.details}`
      : "";
    alert(`Motivo de bloqueo: ${u.blockedReason.type}${extra}`);
  };

  return (
    <div className="clients">
      <div className="clients__top">
        <h1 className="clients__title font-rock">Gestión de Clientes</h1>
      </div>

      <div className="clients__searchbar">
        <span className="search__icon">🔎</span>
        <input
          className="search__input"
          placeholder="Buscar clientes por nombre o email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="clients__filters">
        <label className="f__item">
          <span className="f__label">Estado</span>
          <select
            className="f__control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="clients__tablewrap">
        <table className="clients__table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="cell--strong">{u.name}</td>
                <td>
                  <a href={`mailto:${u.email}`} className="link">
                    {u.email}
                  </a>
                </td>
                <td>
                  <span
                    className={`badge ${
                      u.status === "Activo"
                        ? "is-active"
                        : u.status === "Pendiente"
                        ? "is-pending"
                        : "is-blocked"
                    }`}
                  >
                    {u.status}
                  </span>
                  {u.status === "Bloqueado" && (
                    <button
                      className="link link--muted ml-8"
                      onClick={() => viewReason(u)}
                    >
                      ver motivo
                    </button>
                  )}
                </td>
                <td className="cell--actions">
                  {u.status === "Bloqueado" ? (
                    <button
                      className="btn btn--success"
                      onClick={() => unblock(u)}
                    >
                      Desbloquear
                    </button>
                  ) : (
                    <button
                      className="btn btn--danger"
                      onClick={() => openBlock(u)}
                    >
                      Bloquear
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="cell--empty">
                  Sin resultados para los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Bloquear */}
      {open && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__backdrop" onClick={() => setOpen(false)} />
          <div className="modal__card">
            <h3 className="modal__title">Bloquear usuario</h3>
            <p className="modal__subtitle">
              Selecciona el motivo del bloqueo. Esto **no** es visible para el
              cliente.
            </p>

            <div className="modal__form">
              <label className="f__item">
                <span className="f__label">Motivo</span>
                <select
                  className="f__control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              <label className="f__item">
                <span className="f__label">Detalles (opcional)</span>
                <textarea
                  className="f__control"
                  rows={3}
                  placeholder="Ej.: deuda de ₡15.000 por no-show, o descripción del incidente"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </label>
            </div>

            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn--danger" onClick={confirmBlock}>
                Confirmar bloqueo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
