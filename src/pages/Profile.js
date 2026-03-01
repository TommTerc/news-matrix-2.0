import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaLink, FaPhone, FaRegBookmark, FaSpinner, FaRetweet } from 'react-icons/fa';
import { format } from 'date-fns';
import { supabase } from '../services/supabaseClient';
import userProfileService from '../services/userProfileService';
import commentService from '../services/commentService';
import bookmarkService from '../services/bookmarkService';
import repostService from '../services/repostService';
export default function Profile() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [comments, setComments] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [reposts, setReposts] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [loadingBookmarks, setLoadingBookmarks] = useState(false);
    const [loadingReposts, setLoadingReposts] = useState(false);
    // Load user and profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (!currentUser) {
                    setError('Please sign in to view your profile');
                    setLoading(false);
                    return;
                }
                setUser(currentUser);
                // Fetch profile from database
                const profileData = await userProfileService.getProfile(currentUser.id);
                if (profileData) {
                    setProfile({
                        ...profileData,
                        avatar: profileData.avatar_url,
                        bannerImage: profileData.cover_image_url,
                        joinDate: profileData.created_at ? new Date(profileData.created_at) : new Date()
                    });
                }
                else {
                    // Create default profile for new user
                    setProfile({
                        id: currentUser.id,
                        username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'user',
                        display_name: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'User',
                        bio: '',
                        avatar: undefined,
                        bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
                        website: '',
                        location: '',
                        joinDate: new Date(currentUser.created_at || new Date())
                    });
                }
            }
            catch (err) {
                console.error('Error loading profile:', err);
                setError('Failed to load profile');
            }
            finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);
    // Load comments and bookmarks when tab changes or user updates
    useEffect(() => {
        if (!user)
            return;
        const loadData = async () => {
            if (activeTab === 'comments') {
                setLoadingComments(true);
                try {
                    const userComments = await commentService.getUserComments();
                    setComments(userComments);
                }
                catch (err) {
                    console.error('Error loading comments:', err);
                }
                finally {
                    setLoadingComments(false);
                }
            }
            else if (activeTab === 'reposts') {
                setLoadingReposts(true);
                try {
                    const userReposts = await repostService.getUserReposts(user.id);
                    setReposts(userReposts);
                }
                catch (err) {
                    console.error('Error loading reposts:', err);
                }
                finally {
                    setLoadingReposts(false);
                }
            }
            else if (activeTab === 'saved') {
                setLoadingBookmarks(true);
                try {
                    const userBookmarks = await bookmarkService.getUserBookmarks();
                    setBookmarks(userBookmarks);
                }
                catch (err) {
                    console.error('Error loading bookmarks:', err);
                }
                finally {
                    setLoadingBookmarks(false);
                }
            }
        };
        loadData();
    }, [activeTab, user]);
    const handleEditProfile = () => {
        setIsEditing(true);
    };
    const handleAvatarUpload = async (file) => {
        try {
            setUploading(true);
            if (!user) {
                setError('User not authenticated');
                return null;
            }
            // Create a unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file, {
                upsert: true,
                cacheControl: '3600'
            });
            if (uploadError) {
                console.error('Avatar upload error:', uploadError);
                setError(`Failed to upload avatar: ${uploadError.message}`);
                return null;
            }
            // Get the public URL
            const { data: urlData } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);
            if (urlData?.publicUrl) {
                return urlData.publicUrl;
            }
            return null;
        }
        catch (err) {
            console.error('Error uploading avatar:', err);
            setError('Failed to upload avatar: ' + (err instanceof Error ? err.message : 'Unknown error'));
            return null;
        }
        finally {
            setUploading(false);
        }
    };
    const handleSaveProfile = async () => {
        if (!profile || !user)
            return;
        setSaving(true);
        try {
            // Only save database fields (not data URLs)
            const updates = {
                username: profile.username,
                display_name: profile.display_name,
                bio: profile.bio,
                website: profile.website || null,
                location: profile.location || null
            };
            // If avatar is a data URL (newly uploaded), don't save it directly
            // The file picker will handle it separately through the upload handler
            if (profile.avatar_url && !profile.avatar_url.startsWith('data:')) {
                updates.avatar_url = profile.avatar_url;
            }
            const profileData = await userProfileService.updateProfile(user.id, updates, user.email);
            if (profileData) {
                setProfile({
                    ...profileData,
                    avatar: profileData.avatar_url,
                    bannerImage: profileData.cover_image_url,
                    joinDate: profileData.created_at ? new Date(profileData.created_at) : new Date()
                });
                setIsEditing(false);
                setError(null);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
            }
            else {
                setError('Failed to save profile changes');
            }
        }
        catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
        finally {
            setSaving(false);
        }
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (_jsx("div", { className: "text-center text-matrix-green/60 py-12", children: "No posts yet" }));
            case 'posts':
                return (_jsx("div", { className: "text-center text-matrix-green/60 py-12", children: "No posts yet" }));
            case 'comments':
                if (loadingComments) {
                    return (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx(FaSpinner, { className: "animate-spin text-2xl text-matrix-green" }) }));
                }
                if (comments.length === 0) {
                    return (_jsx("div", { className: "text-center text-matrix-green/60 py-12", children: "No comments yet" }));
                }
                return (_jsx("div", { className: "space-y-4", children: comments.map((comment) => (_jsxs("div", { className: "bg-matrix-black/80 border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-colors", children: [_jsx(Link, { to: `/story?url=${encodeURIComponent(comment.article_url)}`, className: "block p-4 border-b border-matrix-green/20 bg-matrix-dark/50 hover:bg-matrix-dark/80 transition-colors", children: _jsx("p", { className: "text-sm text-matrix-green/60 truncate hover:text-matrix-green transition-colors", children: comment.article_url }) }), _jsxs("div", { className: "p-4", children: [_jsx("div", { className: "flex justify-between items-start mb-3", children: _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-matrix-light", children: comment.display_name || comment.username }), _jsx("p", { className: "text-sm text-matrix-green/60", children: format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm') })] }) }), _jsx("p", { className: "text-matrix-green/80", children: comment.content }), _jsx(Link, { to: `/story?url=${encodeURIComponent(comment.article_url)}`, className: "inline-block mt-3 text-sm text-matrix-green/60 hover:text-matrix-green transition-colors", children: "View in article \u2192" })] })] }, comment.id))) }));
            case 'reposts':
                if (loadingReposts) {
                    return (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx(FaSpinner, { className: "animate-spin text-2xl text-matrix-green" }) }));
                }
                if (reposts.length === 0) {
                    return (_jsx("div", { className: "text-center text-matrix-green/60 py-12", children: "No reposts yet" }));
                }
                return (_jsx("div", { className: "space-y-4", children: reposts.map((repost) => (_jsxs("div", { className: "bg-matrix-black/80 border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-colors", children: [_jsxs(Link, { to: `/story?url=${encodeURIComponent(repost.article_url)}`, className: "block p-4 border-b border-matrix-green/20 bg-matrix-dark/50 hover:bg-matrix-dark/80 transition-colors", children: [repost.article_image && (_jsx("img", { src: repost.article_image, alt: repost.article_title || 'Article image', onError: (e) => {
                                            // Hide image if it fails to load
                                            e.target.style.display = 'none';
                                        }, className: "w-full h-40 object-cover rounded mb-3 border border-matrix-green/20" })), _jsx("p", { className: "font-bold text-matrix-light mb-1", children: repost.article_title || 'Untitled Article' }), repost.article_source && (_jsx("p", { className: "text-sm text-matrix-green/60", children: repost.article_source })), repost.article_description && (_jsx("p", { className: "text-sm text-matrix-green/80 line-clamp-2 mt-2", children: repost.article_description })), !repost.article_description && (_jsx("p", { className: "text-sm text-matrix-green/60 italic mt-2", children: "No description available" }))] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(FaRetweet, { className: "text-matrix-green" }), _jsx("p", { className: "text-sm text-matrix-green/60", children: format(new Date(repost.created_at), 'MMM dd, yyyy') })] }), repost.repost_caption && (_jsxs("p", { className: "text-matrix-green/90 mb-3 italic", children: ["\"", repost.repost_caption, "\""] })), _jsx(Link, { to: `/story?url=${encodeURIComponent(repost.article_url)}`, className: "inline-block text-sm text-matrix-green/60 hover:text-matrix-green transition-colors", children: "View full article \u2192" })] })] }, repost.id))) }));
            case 'saved':
                if (loadingBookmarks) {
                    return (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx(FaSpinner, { className: "animate-spin text-2xl text-matrix-green" }) }));
                }
                if (bookmarks.length === 0) {
                    return (_jsx("div", { className: "text-center text-matrix-green/60 py-12", children: "No saved items" }));
                }
                return (_jsx("div", { className: "space-y-4", children: bookmarks.map((bookmark) => (_jsx("div", { className: "bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-4 hover:border-matrix-green transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-bold text-matrix-light flex items-center gap-2", children: [_jsx(FaRegBookmark, { className: "text-matrix-green" }), "Saved Article"] }), _jsx("p", { className: "text-sm text-matrix-green/60 mt-1", children: bookmark.article_url }), _jsx("p", { className: "text-sm text-matrix-green/60", children: format(new Date(bookmark.created_at), 'MMM dd, yyyy') })] }), _jsx("a", { href: bookmark.article_url, target: "_blank", rel: "noopener noreferrer", className: "ml-4 px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors", children: "Open \u2192" })] }) }, bookmark.id))) }));
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-matrix-black/40 backdrop-blur-[2px] pt-16", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx(FaSpinner, { className: "animate-spin text-matrix-green text-4xl" }) })) : error ? (_jsx("div", { className: "text-center text-red-400 py-12", children: error })) : !profile ? (_jsx("div", { className: "text-center text-matrix-green/60 py-12", children: "Profile not found" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-48 bg-cover bg-center relative", style: { backgroundImage: `url(${profile.bannerImage})` }, children: _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-matrix-black/80 to-transparent" }) }), success && (_jsx("div", { className: "bg-green-500/20 text-green-400 p-3 text-center border border-green-500 mx-4 -mb-2 rounded", children: "\u2713 Profile saved successfully!" })), _jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [_jsx("div", { className: "relative -mt-20 mb-8", children: _jsx("div", { className: "bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start gap-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-32 h-32 rounded-full bg-matrix-green/20 flex items-center justify-center text-6xl text-matrix-green border-4 border-matrix-black overflow-hidden", children: profile.avatar ? (_jsx("img", { src: profile.avatar, alt: profile.display_name || 'User avatar', className: "w-full h-full object-cover" })) : (_jsx(FaUserCircle, {})) }), isEditing && (_jsxs("label", { className: "absolute bottom-0 right-0 p-2 bg-matrix-green rounded-full cursor-pointer hover:bg-matrix-light transition-colors", children: [_jsx(FaEdit, { className: "text-matrix-black" }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const url = await handleAvatarUpload(file);
                                                                    if (url) {
                                                                        setProfile({ ...profile, avatar: url, avatar_url: url });
                                                                    }
                                                                }
                                                            }, disabled: uploading })] }))] }), _jsxs("div", { className: "flex-1", children: [isEditing ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-matrix-green/60", children: "Display Name" }), _jsx("input", { type: "text", value: profile.display_name || '', onChange: (e) => setProfile({ ...profile, display_name: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-matrix-green/60", children: "Username" }), _jsx("input", { type: "text", value: profile.username, onChange: (e) => setProfile({ ...profile, username: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-matrix-green/60", children: "Bio" }), _jsx("textarea", { value: profile.bio || '', onChange: (e) => setProfile({ ...profile, bio: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green", rows: 3 })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-matrix-green/60", children: "Website" }), _jsx("input", { type: "text", value: profile.website || '', onChange: (e) => setProfile({ ...profile, website: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-matrix-green/60", children: "Location" }), _jsx("input", { type: "text", value: profile.location || '', onChange: (e) => setProfile({ ...profile, location: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handleSaveProfile, disabled: saving, className: "px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light disabled:opacity-50 flex items-center gap-2", children: [saving && _jsx(FaSpinner, { className: "animate-spin" }), "Save Changes"] }), _jsx("button", { onClick: () => setIsEditing(false), disabled: saving, className: "px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30", children: "Cancel" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h1", { className: "text-2xl font-bold text-matrix-green", children: profile.display_name }), _jsxs("button", { onClick: handleEditProfile, className: "flex items-center gap-2 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30", children: [_jsx(FaEdit, {}), "Edit Profile"] })] }), _jsxs("div", { className: "text-matrix-green/60 mb-4", children: ["u/", profile.username] }), _jsx("p", { className: "text-matrix-green/80 mb-4", children: profile.bio })] })), _jsxs("div", { className: "flex items-center gap-6 text-matrix-green/60", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FaPhone, { className: "text-matrix-green" }), _jsxs("span", { children: ["Joined ", format(profile.joinDate || new Date(), 'MMMM yyyy')] })] }), profile.location && (_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { children: profile.location }) })), profile.website && (_jsxs("a", { href: profile.website, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 hover:text-matrix-green", children: [_jsx(FaLink, { className: "text-matrix-green" }), _jsx("span", { children: "Website" })] }))] })] })] }) }) }), _jsx("div", { className: "mb-6 border-b border-matrix-green/30", children: _jsx("div", { className: "flex space-x-8", children: ['overview', 'posts', 'comments', 'reposts', 'saved'].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab), className: `pb-4 relative ${activeTab === tab
                                        ? 'text-matrix-light'
                                        : 'text-matrix-green/60 hover:text-matrix-green'}`, children: [tab.charAt(0).toUpperCase() + tab.slice(1), activeTab === tab && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" }))] }, tab))) }) }), renderTabContent()] })] })) }));
}
