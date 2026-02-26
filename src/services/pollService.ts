import { supabase } from './supabaseClient';

export type VoteType = 'support' | 'oppose' | 'abstain';

export interface BillPoll {
  id: string;
  bill_congress: number;
  bill_type: string;
  bill_number: number;
  user_id: string;
  vote_type: VoteType;
  created_at: string;
  updated_at: string;
}

export interface PollResults {
  support: number;
  oppose: number;
  abstain: number;
  total: number;
}

class PollService {
  /**
   * Get poll results for a specific bill
   */
  async getPollResults(congress: number, billType: string, billNumber: number): Promise<PollResults> {
    const { data, error } = await supabase
      .from('bill_polls')
      .select('vote_type')
      .eq('bill_congress', congress)
      .eq('bill_type', billType)
      .eq('bill_number', billNumber);

    if (error) {
      console.error('Error fetching poll results:', error);
      return { support: 0, oppose: 0, abstain: 0, total: 0 };
    }

    const results = {
      support: 0,
      oppose: 0,
      abstain: 0,
      total: data?.length || 0
    };

    if (data) {
      data.forEach(poll => {
        if (poll.vote_type === 'support') results.support++;
        else if (poll.vote_type === 'oppose') results.oppose++;
        else if (poll.vote_type === 'abstain') results.abstain++;
      });
    }

    return results;
  }

  /**
   * Get current user's vote for a bill (requires authentication)
   */
  async getUserVote(congress: number, billType: string, billNumber: number): Promise<VoteType | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('bill_polls')
      .select('vote_type')
      .eq('bill_congress', congress)
      .eq('bill_type', billType)
      .eq('bill_number', billNumber)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No row found
      console.error('Error fetching user vote:', error);
      return null;
    }

    return data?.vote_type || null;
  }

  /**
   * Submit or update user's vote for a bill
   */
  async submitVote(congress: number, billType: string, billNumber: number, voteType: VoteType): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    // Try to update existing vote first
    const { data: existingVote } = await supabase
      .from('bill_polls')
      .select('id')
      .eq('bill_congress', congress)
      .eq('bill_type', billType)
      .eq('bill_number', billNumber)
      .eq('user_id', user.id)
      .single();

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('bill_polls')
        .update({ vote_type: voteType, updated_at: new Date().toISOString() })
        .eq('id', existingVote.id);

      if (error) {
        console.error('Error updating vote:', error);
        return false;
      }
      return true;
    } else {
      // Insert new vote
      const { error } = await supabase
        .from('bill_polls')
        .insert({
          bill_congress: congress,
          bill_type: billType,
          bill_number: billNumber,
          user_id: user.id,
          vote_type: voteType
        });

      if (error) {
        console.error('Error inserting vote:', error);
        return false;
      }
      return true;
    }
  }

  /**
   * Remove user's vote for a bill
   */
  async removeVote(congress: number, billType: string, billNumber: number): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('bill_polls')
      .delete()
      .eq('bill_congress', congress)
      .eq('bill_type', billType)
      .eq('bill_number', billNumber)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing vote:', error);
      return false;
    }
    return true;
  }
}

export default new PollService();
