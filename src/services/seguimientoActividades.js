import { fetchWithAuth } from "@/utils/auth";

const BASE_URL = "/api/seguimiento-actividades";

function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return `${url.pathname}${url.search}`;
}

async function request(path, options = {}) {
  const { params, body, ...init } = options;
  const requestInit = { ...init };

  if (body !== undefined) {
    requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetchWithAuth(buildUrl(path, params), requestInit);
  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail = data?.detail || data?.message || "Error en seguimiento de actividades";
    throw new Error(detail);
  }

  return data;
}

export function fetchMe() {
  return request("/auth/me/");
}

export function getDashboardSummary(params = {}) {
  return request("/dashboard/summary/", { params });
}

export function getActivities(params = {}) {
  return request("/activities/", { params });
}

export function getActivity(id) {
  return request(`/activities/${id}/`);
}

export function createActivity(payload) {
  return request("/activities/", { method: "POST", body: payload });
}

export function updateActivity(id, payload) {
  return request(`/activities/${id}/`, { method: "PATCH", body: payload });
}

export function addComment(activityId, comment) {
  return request(`/activities/${activityId}/comments/`, {
    method: "POST",
    body: { comment },
  });
}

export function addBossObservation(activityId, observation) {
  return request(`/activities/${activityId}/boss-observations/`, {
    method: "POST",
    body: { observation },
  });
}

export function updateBossObservation(id, observation) {
  return request(`/boss-observations/${id}/`, {
    method: "PATCH",
    body: { observation },
  });
}

export function deleteBossObservation(id) {
  return request(`/boss-observations/${id}/`, { method: "DELETE" });
}

export function createExtension(activityId, payload) {
  return request(`/activities/${activityId}/extensions/`, {
    method: "POST",
    body: payload,
  });
}

export function getProjects(params = {}) {
  return request("/projects/", { params });
}

export function createProject(payload) {
  return request("/projects/", { method: "POST", body: payload });
}

export function updateProject(id, payload) {
  return request(`/projects/${id}/`, { method: "PATCH", body: payload });
}

export function getUsers(params = {}) {
  return request("/users/", { params });
}

export async function getAssignableUsers(params = {}) {
  try {
    const users = await getUsers(params);
    return users.filter((user) => user.role !== "ADMIN");
  } catch (error) {
    return [];
  }
}

export function createUser(payload) {
  return request("/users/", { method: "POST", body: payload });
}

