export interface ParkingSpace {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  type: string;
  image: string;
  distance?: number | null;
}

export interface SpaceOwner {
  id: number;
  name: string;
  phone: string;
  email: string;
  rating: number;
  spaceId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "owner" | "driver";
}
