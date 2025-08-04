export type CreditTransactionType = 'purchase' | 'usage' | 'refund' | 'bonus';

export interface CreditTransaction {
  id?: string;
  user_id: string;
  amount: number;
  type: CreditTransactionType;
  stripe_session_id?: string | null;
  description?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}