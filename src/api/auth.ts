import { BACKEND_URL } from "../config";
import { LoginResponse } from "./responses";

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const res = await fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error('Login failed');

  return res.json();
}
