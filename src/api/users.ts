import { BACKEND_URL } from "../config";
import { KorisnikResponse, KreirajKorisnikaRequest, PromeniLozinkuRequest } from "./responses";

export async function getAllUsers(only_active: boolean): Promise<KorisnikResponse[]> {
  const res = await fetch(`${BACKEND_URL}/korisnici?only_active=${only_active}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(user: KreirajKorisnikaRequest): Promise<KorisnikResponse> {
  const res = await fetch(`${BACKEND_URL}/korisnici/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Neuspešno kreiranje korisnika");
  }

  return res.json();
}

export async function changePassword(
  userId: number,
  data: PromeniLozinkuRequest
): Promise<{ message: string }> {
  const res = await fetch(`${BACKEND_URL}/korisnici/lozinka/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Neuspešna promena lozinke");
  }

  return res.json();
}

export async function updateUser(
  userId: number,
  user: KreirajKorisnikaRequest
): Promise<KorisnikResponse> {
  const res = await fetch(`${BACKEND_URL}/korisnici/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to update user");
  }

  return res.json();
}

export async function deactivateUser(userId: number): Promise<KorisnikResponse> {
  const res = await fetch(`${BACKEND_URL}/korisnici/${userId}/deactivate`, {
    method: "PUT",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to toggle user status");
  }

  return res.json();
}

export async function deleteUserApi(userId: number): Promise<KorisnikResponse> {
  const res = await fetch(`${BACKEND_URL}/korisnici/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to toggle user status");
  }

  return res.json();
}
