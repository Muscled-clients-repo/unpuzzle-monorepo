export interface OrderItem {
  courseId: string;
  courseName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  courseName?: string;
  courseThumbnail?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentIntentId?: string;
  stripeSessionId?: string;
  items?: OrderItem[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data?: Order;
  error?: string;
  message?: string;
}

export interface OrderListResponse {
  success: boolean;
  data?: Order[];
  total?: number;
  page?: number;
  error?: string;
  message?: string;
}