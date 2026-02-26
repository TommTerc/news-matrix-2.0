import { supabase } from './supabaseClient';

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string;
  type: string;
  related_type?: string;
  related_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

class NotificationService {
  /**
   * Get unread notifications for current user
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get all notifications for current user
   */
  async getAllNotifications(limit: number = 50): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
    return count || 0;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    return true;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
    return true;
  }

  /**
   * Create notification (system function - would be called on-trigger in production)
   */
  async createNotification(
    targetUserId: string,
    type: string,
    message: string,
    actorId?: string,
    relatedType?: string,
    relatedId?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: targetUserId,
        actor_id: actorId,
        type,
        message,
        related_type: relatedType,
        related_id: relatedId,
        is_read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    return true;
  }

  /**
   * Helper: Notify user of new comment on article
   */
  async notifyCommentOnArticle(
    targetUserId: string,
    commenterName: string,
    commenterId: string,
    articleUrl: string
  ) {
    return this.createNotification(
      targetUserId,
      'comment',
      `${commenterName} commented on your article`,
      commenterId,
      'article',
      articleUrl
    );
  }

  /**
   * Helper: Notify user of like on comment
   */
  async notifyCommentLike(
    targetUserId: string,
    likerName: string,
    likerId: string,
    commentId: string
  ) {
    return this.createNotification(
      targetUserId,
      'like',
      `${likerName} liked your comment`,
      likerId,
      'comment',
      commentId
    );
  }

  /**
   * Helper: Notify user of new follower
   */
  async notifyNewFollower(
    targetUserId: string,
    followerName: string,
    followerId: string
  ) {
    return this.createNotification(
      targetUserId,
      'follow',
      `${followerName} started following you`,
      followerId,
      'user',
      followerId
    );
  }
}

export default new NotificationService();
