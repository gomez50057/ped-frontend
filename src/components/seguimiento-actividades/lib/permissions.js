export function canManageActivities(user) {
  return ["ADMIN", "ENCARGADO"].includes(user?.role);
}

export function hasSeguimientoAccess(user) {
  return ["ADMIN", "ENCARGADO", "EMPLEADO", "SUPERVISOR"].includes(user?.role);
}

export function canManageUsers(user) {
  return user?.role === "ADMIN";
}

export function canManageProjects(user) {
  return ["ADMIN", "ENCARGADO"].includes(user?.role);
}

export function canViewProjectsTab(user) {
  return ["ADMIN", "ENCARGADO", "SUPERVISOR"].includes(user?.role);
}

export function canAddBossObservation(user) {
  return ["ADMIN", "SUPERVISOR"].includes(user?.role);
}

export function canExtendActivity(user) {
  return ["ADMIN", "ENCARGADO"].includes(user?.role);
}
