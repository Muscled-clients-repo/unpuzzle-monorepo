import supabase from "./client";
import CreditTrackSchema from "../validator/creditTrack.validator";
import {CreditTrack} from "../../types/creditTrack.type"

class CreditTrackModel extends CreditTrackSchema{
  constructor(){
    super();
  }
  getAllCreditTracks=async(page = 1,limit = 10)=> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("credit_track")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return data;
  }

  getCreditTrackById=async(id: string)=> {
    const { data, error } = await supabase
      .from("credit_track")
      .select("*") 
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  createCreditTrack=async(body:CreditTrack)=> {
    try{
      this.validate(body);
    const { data, error } = await supabase
      .from("credit_track")
      .insert([body])
      .select("*")
      .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }
  }

  updateCreditTrack=async(id: string, body: Partial<CreditTrack>)=> {
    try{
      this.validate(body);

    const { data, error } = await supabase
      .from("credit_track")
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

  deleteCreditTrack=async(id: string)=> {
    const { error } = await supabase.from("credit_track").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return { id: id, message: "Resource Deleted Successfully!" };
  }

  getCreditTrackByUserId=async(userId: string)=> {
    const { data, error } = await supabase
      .from("credit_track")
      .select("*") 
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  upsertCreditTrack=async(body: CreditTrack)=> {
    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("credit_track")
        .upsert([body], {
          onConflict: 'user_id'
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }
  }

  incrementCredits=async(userId: string, creditAmount: number)=> {
    try {
      // First get the current credit track
      const existingCredit = await this.getCreditTrackByUserId(userId);
      
      if (existingCredit) {
        // Update existing credit track
        const newAvailableCredit = existingCredit.available_credit + creditAmount;
        return await this.updateCreditTrack(existingCredit.id, {
          available_credit: newAvailableCredit
        });
      } else {
        // Create new credit track
        return await this.createCreditTrack({
          user_id: userId,
          available_credit: creditAmount
        });
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CreditTrackModel();
