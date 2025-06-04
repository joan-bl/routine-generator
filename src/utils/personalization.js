// utils/personalization.js
// Utilidades para guardar y recuperar progreso y preferencias del usuario

const STORAGE_KEY = "user_progress";

export function getUserProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveUserProgress(newData) {
  try {
    const prev = getUserProgress();
    const merged = { ...prev, ...newData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // fallback: no-op
  }
}
