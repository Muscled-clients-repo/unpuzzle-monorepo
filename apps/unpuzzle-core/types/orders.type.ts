export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  discount?: number;
  discounted_price: number;
}

export interface Orders {
  id?: string;
  user_id: string;
  total_amount: number;
  discount_id?: string;
  items: OrderItem[];
  payment_id?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe';
  payment_date?: Date;
  payment_amount: number;
  payment_currency: 'USD';
  created_at?: Date;
  updated_at?: Date;
}
  