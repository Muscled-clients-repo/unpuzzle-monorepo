import supabase from "./client";

interface WebhookEvent {
  id?: string;
  stripe_event_id: string;
  event_type: string;
  processed_at?: Date;
  payload?: any;
  status?: string;
  created_at?: Date;
}

class WebhookEventsModel {
  async getEventByStripeId(stripeEventId: string) {
    const { data, error } = await supabase
      .from("webhook_events")
      .select("*")
      .eq("stripe_event_id", stripeEventId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      throw new Error(error.message);
    }
    return data;
  }

  async createEvent(event: WebhookEvent) {
    const { data, error } = await supabase
      .from("webhook_events")
      .insert([event])
      .select("*")
      .single();

    if (error) {
      // If it's a unique violation, the event was already processed
      if (error.code === '23505') { // Postgres unique violation error code
        return { alreadyProcessed: true, data: null };
      }
      throw new Error(error.message);
    }
    return { alreadyProcessed: false, data };
  }
}

export default new WebhookEventsModel();