import { supabase } from './supabaseClient';
class BookmarkService {
    /**
     * Get all bookmarks for current user
     */
    async getUserBookmarks() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return [];
        const { data, error } = await supabase
            .from('article_bookmarks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching bookmarks:', error);
            return [];
        }
        return data || [];
    }
    /**
     * Check if an article is bookmarked
     */
    async isBookmarked(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { data, error } = await supabase
            .from('article_bookmarks')
            .select('id')
            .eq('article_url', articleUrl)
            .eq('user_id', user.id)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking bookmark:', error);
        }
        return !!data;
    }
    /**
     * Add bookmark
     */
    async addBookmark(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('article_bookmarks')
            .insert({
            article_url: articleUrl,
            user_id: user.id
        });
        if (error) {
            console.error('Error adding bookmark:', error);
            return false;
        }
        return true;
    }
    /**
     * Remove bookmark
     */
    async removeBookmark(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('article_bookmarks')
            .delete()
            .eq('article_url', articleUrl)
            .eq('user_id', user.id);
        if (error) {
            console.error('Error removing bookmark:', error);
            return false;
        }
        return true;
    }
}
export default new BookmarkService();
