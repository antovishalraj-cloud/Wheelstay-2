const BASE_URL = "http://localhost:4000/api";

export interface ParkingSpace {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  type: string;
  image: string;
  owner?: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface SpaceOwner {
  id: number;
  name: string;
  phone: string;
  email: string;
  rating: number;
  spaceId: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: "owner" | "driver";
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: "owner" | "driver";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  role?: string;
  redirect: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export const getSpaces = (search = ""): Promise<ParkingSpace[]> => {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<ParkingSpace[]>(`/spaces${qs}`);
};

export const getSpaceById = (
  id: number
): Promise<{ space: ParkingSpace; owner: SpaceOwner }> =>
  request<{ space: ParkingSpace; owner: SpaceOwner }>(`/spaces/${id}`);

export const loginUser = (payload: LoginPayload): Promise<AuthResponse> =>
  request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const registerUser = (payload: RegisterPayload): Promise<AuthResponse> =>
  request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createBooking = (payload: {
  spaceId: number;
  duration: string;
  driverEmail: string;
}): Promise<{ success: boolean; bookingId: string }> =>
  request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const addSpace = (payload: Partial<ParkingSpace> & { owner_id: number; description?: string }): Promise<{ success: boolean; space: ParkingSpace }> =>
  request("/spaces", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMySpaces = (ownerId: number): Promise<ParkingSpace[]> =>
  request<ParkingSpace[]>(`/spaces/my-spaces/${ownerId}`);
