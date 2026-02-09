export interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  image?: string;
  role: string;
  region: string;
  district: string;
  street: string;
  ward: string;

  verified: boolean;

  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  shop_name: string;
  business_registration: string | null;
  settings: {
    currency: string;
  };
}

export interface InventoryItem {
  id: string;
  shop_id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    category: string;
    img?: string;
  };
  size: string;
  sell_price: number;
  current_stock: number;
  reorder_level: number;
}

export interface SalesTransaction {
  id: string;
  shop_id: string;
  sale_date: string;
  total_revenue: number;
  profit: number;
}
