import supabase from "./client";
import { Agent } from "../../types/agent.type";
import AgentSchema from "../validator/agentValidator";
import { BindMethods } from "../../protocols/utility/BindMethods";

class AgentModel extends AgentSchema{
  // Fetch all agents
  getAllAgents = async (page: number = 1,limit: number = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try{
      const { data, error, count } = await supabase
        .from("agents")
        .select("*", { count: "exact" }) // get data with total count
        .order("created_at", { ascending: false })
        .range(from, to);
  
      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }

  };

  // Get agent by ID
  getAgentById = async (id: string) => {

    try{
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .maybeSingle();
  
      if (error) {
        throw new Error(error.message)
      };
      return  data ;
    }catch(error){
      throw error
    }
  };

  // Create new agent
  createAgent = async (body: Agent) => {
    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("agents")
        .insert([body])
        .select()
        .single();
  
      if (error) {
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  };

  // Update agent
  updateAgent = async (id: string,body: Partial<Agent>) => {
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("agents")
        .update(body)
        .eq("id", id)
        .select()
        .single();
  
      if (error) {
        throw new Error(error.message)
      };
      return data
    }catch(error){
      throw error
    }

  };

  // Delete agent
  deleteAgent = async (id: string) => {
    try{
      const { error } = await supabase.from("agents").delete().eq("id", id);
      if (error) {
        throw new Error(error.message)
      };
      return { success: true, message: "Activity Log Deleted Successfully!"}
    }catch(error){
      throw error
    }
  };
}

const binding = new BindMethods(new AgentModel());
export default binding.bindMethods();
