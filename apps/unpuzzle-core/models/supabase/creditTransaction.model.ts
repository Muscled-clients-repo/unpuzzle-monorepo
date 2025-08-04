import supabase from "./client";
import CreditTransactionSchema from "../validator/creditTransaction.validator";
import { CreditTransaction } from "../../types/creditTransaction.type";

class CreditTransactionModel extends CreditTransactionSchema {
  constructor() {
    super();
  }

  getAllCreditTransactions = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return data;
  };

  getCreditTransactionById = async (id: string) => {
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  };

  getCreditTransactionsByUserId = async (userId: string, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return { data, count };
  };

  getCreditTransactionBySessionId = async (sessionId: string) => {
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  };

  createCreditTransaction = async (body: CreditTransaction) => {
    try {
      this.validate(body);
      const { data, error } = await supabase
        .from("credit_transactions")
        .insert([body])
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  updateCreditTransaction = async (id: string, body: Partial<CreditTransaction>) => {
    try {
      this.validate(body, 1);

      const { data, error } = await supabase
        .from("credit_transactions")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  deleteCreditTransaction = async (id: string) => {
    const { error } = await supabase
      .from("credit_transactions")
      .delete()
      .eq("id", id);
    
    if (error) {
      throw new Error(error.message);
    }
    return { id: id, message: "Resource Deleted Successfully!" };
  };
}

export default new CreditTransactionModel();