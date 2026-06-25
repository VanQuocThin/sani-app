export type AuthUser = {
  name: string;
  clinic: string;
  specialty: string;
  email: string;
};

export function saveUser(user: AuthUser) {
  localStorage.setItem("sani_user", JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("sani_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem("sani_user");
}
