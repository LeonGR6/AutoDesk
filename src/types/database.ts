export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
}

export interface CarModel {
  id: string;
  brand_id: string;
  name: string;
  year: number;
  price: number;
  image_url: string | null;
  description: string | null;
  fuel_type: string | null;
  transmission: string | null;
  created_at: string;
  brands?: Brand;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
}
