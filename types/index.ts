export interface PriceItem {
  size: string;
  amount: number;
}

export interface Product {
  id: number; // Changed from string to number (bigint)
  created_at?: string;
  name: string;
  category: string;
  img: string | null;
  measure: string | null;
  description: string | null;

  // JSONB Fields
  key_features?: string[] | null;
  usage_instructions?: string[] | null;
  benefits?: string[] | null;
  specifications?: Record<string, string> | null;
  tags?: string[] | null;

  // Booleans
  is_exclusive: boolean;
  is_featured: boolean;
  is_popular: boolean;
  sales_count: number;

  // Pricing
  farmer_price: PriceItem[];
  agrovet_price: PriceItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number; // Price per unit in TZS
  quantity: number;
  supplier: string;
  selectedVariants?: { [key: string]: string };
  selectedOptions?: { [key: string]: string };
  subtotal: number; // quantity * price in TZS
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  isDefault?: boolean;

  //Todo: add ward
  shopName: string;
}

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'bank_transfer' | 'cod' | 'card';
  provider: string; // M-Pesa, Airtel Money, Tigo Pesa, etc.
  accountNumber?: string;
  isDefault: boolean;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number; // Price in TZS
  estimatedDays: string;
  regions: string[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number; // Price per unit in TZS
  quantity: number;
  supplier: string;
  selectedVariants?: { [key: string]: string };
  selectedOptions?: { [key: string]: string };
  subtotal: number; // quantity * price in TZS
}

export interface OrderStatusHistory {
  status: Order['status'];
  timestamp: string;
  note?: string;
}

export type CustomerInfo = {
  customerName: string;
  customerPhone: string;
  shopname: string;
};

export interface Order {
  id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  items: OrderItem[];
  subtotal: number; // TZS
  // tax: number; // TZS
  shippingCost: number; // TZS
  // discountAmount: number; // TZS
  total: number; // TZS
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  // discountCode?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  // trackingNumber?: string;
  // notes?: string;
  statusHistory?: OrderStatusHistory[];
  // Admin fields
  userId?: string;
  // priority?: 'low' | 'normal' | 'high';
}

export interface CheckoutState {
  step: 'shipping' | 'payment' | 'review' | 'complete';
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  shippingMethod?: ShippingMethod;
  discountCode?: string;
  isProcessing: boolean;
  errors: { [key: string]: string };
}

export interface CartSummary {
  itemCount: number;
  subtotal: number; // TZS
  tax: number; // TZS
  shippingCost: number; // TZS
  discountAmount: number; // TZS
  total: number; // TZS
}
