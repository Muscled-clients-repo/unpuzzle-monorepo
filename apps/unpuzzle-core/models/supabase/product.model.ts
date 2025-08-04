import supabase from "./client";
import { Product } from "../../types/product.type";
import ProductSchema from "../validator/product.validator";

class ProductModel extends ProductSchema {
  constructor(){
    super()
  }
  getAllProducts = async(page = 1,limit = 10)=>{
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try{
      const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) return { success: false, error: error.message };
    return data
    }catch(error){
      throw error
    }
  }

  getProductById=async(id: string)=>{
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    return data;
  }

  getProductsByIds=async(ids: string[])=>{
    try{
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }
  }

  createProduct=async(body:Product)=> {

    try{
      this.validate(body, 0);
      const { data, error } = await supabase
        .from("products")
        .insert([body])
        .select()
        .single();
  
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }

  }

  updateProduct=async(id: string, body: Partial<Product>)=> {
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("products")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }
  }

  deleteProduct=async(id: string)=> {
    try{
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { id: id, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }
}

export default new ProductModel();