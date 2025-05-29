import { JwtPayload, jwtDecode } from 'jwt-decode';
import axios from 'axios';

class AuthService {
  private tokenKey = 'kanban_token';

  getProfile(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  }

  loggedIn(): boolean {
    const token = this.getToken();
    // Return true if token exists and is not expired
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload & { exp?: number }>(token);
      if (decoded.exp === undefined) return false;
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(idToken: string): void {
    localStorage.setItem(this.tokenKey, idToken);
    // Set default Authorization header if using axios
    if (typeof axios !== 'undefined') {
      axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
    }
    window.location.href = '/';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    // Clear Authorization header if using axios
    if (typeof axios !== 'undefined') {
      delete axios.defaults.headers.common['Authorization'];
    }
    window.location.href = '/login';
  }
}

export default new AuthService();