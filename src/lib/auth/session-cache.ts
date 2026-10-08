import type { User } from "@/types";

const SESSION_KEY = "trainsyt.auth.display-user";
export const SESSION_CHANGE_EVENT = "trainsyt:session-change";

export function getCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as User : null;
  } catch {
    return null;
  }
}

export function cacheUser(user: User) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT));
}

export function clearCachedUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT));
}
