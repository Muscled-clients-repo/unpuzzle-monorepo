import supabase from "./client";
import { User } from "../../types/user.type";
import UserSchema from "../validator/user.validator";

class UserModel extends UserSchema {
  constructor() {
    super();
  }

  getAllUsers = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUserById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  createUser = async (body: User) => {
    try {
      this.validate(body);
      const { data, error } = await supabase
        .from("users")
        .insert([body])
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

  updateUser = async (id: string, body: Partial<User>) => {
    try {
      this.validate(body, 1);

      const { data, error } = await supabase
        .from("users")
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

  deleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { success: true, message: "Resource Deleted Successfully!" };
    } catch (error) {
      throw error;
    }
  };

  getUserByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      // Not found error
      throw error;
    }

    return data;
  };
}

export default new UserModel();
