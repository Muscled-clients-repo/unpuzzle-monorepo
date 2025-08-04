export interface Product {
  id?: string;
  title: string;
  price: number;
  product_type: 'onetime_purchase' | 'monthly_subscription' | 'yearly_subscription';
  credit: number;
  created_at?: Date;
  updated_at?: Date;
}
