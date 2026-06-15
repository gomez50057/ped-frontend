"use client";

import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import SeguimientoShell from "@/components/seguimiento-actividades/SeguimientoShell";
import { confirmAction } from "@/components/seguimiento-actividades/lib/confirmations";
import { ROLES } from "@/components/seguimiento-actividades/lib/constants";
import { canManageUsers } from "@/components/seguimiento-actividades/lib/permissions";
import Button from "@/components/seguimiento-actividades/ui/Button";
import Input from "@/components/seguimiento-actividades/ui/Input";
import Select from "@/components/seguimiento-actividades/ui/Select";
import {
  createUser,
  fetchMe,
  getAssignableUsers,
} from "@/services/seguimientoActividades";
import styles from "./UsersPage.module.css";

const userManagementRoles = Object.entries(ROLES).filter(([key]) => key !== "ADMIN");

export default function SeguimientoUsersPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "EMPLEADO",
    employee_number: "",
    area: "",
    position: "",
  });

  async function loadUsers() {
    setUsers(await getAssignableUsers().catch(() => []));
  }

  useEffect(() => {
    fetchMe().then((user) => {
      setCurrentUser(user);
      if (canManageUsers(user)) {
        loadUsers();
      }
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const accepted = await confirmAction({
      title: "Crear usuario",
      message: "Se creará una cuenta nueva con los datos y rol seleccionados.",
      confirmLabel: "Crear",
      tone: "success",
    });
    if (!accepted) return;
    await createUser(form);
    setForm({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "EMPLEADO",
      employee_number: "",
      area: "",
      position: "",
    });
    await loadUsers();
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <SeguimientoShell canAccess={canManageUsers}>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Usuarios</h1>
          <p className="pageSubtitle">Administración base de responsables, supervisores y encargados.</p>
        </div>
      </div>
      <div className={styles.layout}>
        {canManageUsers(currentUser) ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Nuevo usuario</h2>
            <div className={styles.grid}>
              <Input label="Usuario" value={form.username} onChange={(event) => update("username", event.target.value)} required />
              <Input label="Correo" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
              <Input label="Nombre" value={form.first_name} onChange={(event) => update("first_name", event.target.value)} />
              <Input label="Apellido" value={form.last_name} onChange={(event) => update("last_name", event.target.value)} />
              <Input label="Contraseña" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} required />
              <Select label="Rol" value={form.role} onChange={(event) => update("role", event.target.value)}>
                {userManagementRoles.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
              <Input label="Número de empleado" value={form.employee_number} onChange={(event) => update("employee_number", event.target.value)} />
              <Input label="Área" value={form.area} onChange={(event) => update("area", event.target.value)} />
              <Input label="Puesto" value={form.position} onChange={(event) => update("position", event.target.value)} />
            </div>
            <Button type="submit" icon={UserPlus}>Crear usuario</Button>
          </form>
        ) : null}
        <section className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>No. empleado</th>
                <th>Rol</th>
                <th>Área</th>
                <th>Puesto</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.full_name}</td>
                  <td>{user.employee_number || "Sin número"}</td>
                  <td>{ROLES[user.role] || user.role}</td>
                  <td>{user.area || "Sin área"}</td>
                  <td>{user.position || "Sin puesto"}</td>
                  <td>{user.is_active ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </SeguimientoShell>
  );
}
