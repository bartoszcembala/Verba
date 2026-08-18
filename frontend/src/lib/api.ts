const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = (configuredApiUrl || "http://localhost:5001/api").replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");
  return normalizedPath ? `${API_URL}/${normalizedPath}` : API_URL;
}
