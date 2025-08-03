import jwtDecode from "jwt-decode";

export function isAdmin(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return decoded?.role === 'ADMIN';
  } catch (error) {
    return false;
  }
}
