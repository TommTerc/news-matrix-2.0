import { supabase } from './supabaseClient';
class TruthService {
    /**
     * Get truth statistics for an article
     */
    async getTruthStats(articleUrl) {
        const { data, error } = await supabase
            .from('truth_ratings')
            .select('rating')
            .eq('article_url', articleUrl);
        if (error) {
            console.error('Error fetching truth stats:', error);
            return { truthful: 0, misleading: 0, abstain: 0, total: 0, averageRating: 0 };
        }
        const stats = {
            truthful: 0,
            misleading: 0,
            abstain: 0,
            total: data?.length || 0,
            averageRating: 0
        };
        let sum = 0;
        if (data) {
            data.forEach(record => {
                if (record.rating === 1)
                    stats.truthful++;
                else if (record.rating === -1)
                    stats.misleading++;
                else if (record.rating === 0)
                    stats.abstain++;
                sum += record.rating;
            });
        }
        if (stats.total > 0) {
            stats.averageRating = sum / stats.total;
        }
        return stats;
    }
    /**
     * Get current user's rating for an article
     */
    async getUserRating(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return null;
        const { data, error } = await supabase
            .from('truth_ratings')
            .select('rating')
            .eq('article_url', articleUrl)
            .eq('user_id', user.id)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // No row found
            console.error('Error fetching user rating:', error);
            return null;
        }
        return data?.rating || null;
    }
    /**
     * Submit or update truth rating
     */
    async submitRating(articleUrl, rating) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return false;
        }
        // Try to update existing rating first
        const { data: existingRating } = await supabase
            .from('truth_ratings')
            .select('id')
            .eq('article_url', articleUrl)
            .eq('user_id', user.id)
            .single();
        if (existingRating) {
            // Update existing rating
            const { error } = await supabase
                .from('truth_ratings')
                .update({
                rating,
                updated_at: new Date().toISOString()
            })
                .eq('id', existingRating.id);
            if (error) {
                console.error('Error updating rating:', error);
                return false;
            }
            return true;
        }
        else {
            // Insert new rating
            const { error } = await supabase
                .from('truth_ratings')
                .insert({
                article_url: articleUrl,
                user_id: user.id,
                rating
            });
            if (error) {
                console.error('Error inserting rating:', error);
                return false;
            }
            return true;
        }
    }
    /**
     * Remove user's rating
     */
    async removeRating(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return false;
        }
        const { error } = await supabase
            .from('truth_ratings')
            .delete()
            .eq('article_url', articleUrl)
            .eq('user_id', user.id);
        if (error) {
            console.error('Error removing rating:', error);
            return false;
        }
        return true;
    }
}
export default new TruthService();
