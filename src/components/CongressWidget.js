import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaBan, FaThumbsUp, FaThumbsDown, FaHandPaper } from 'react-icons/fa';
import billsService from '../services/billsService';
import pollService from '../services/pollService';
import { supabase } from '../services/supabaseClient';
export default function CongressWidget({ congress = 119, billType = 'hr', billNumber = '30' }) {
    const [actions, setActions] = useState([]);
    const [billDetails, setBillDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [user, setUser] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const [pollResults, setPollResults] = useState({ support: 0, oppose: 0, abstain: 0, total: 0 });
    const [votingLoading, setVotingLoading] = useState(false);
    useEffect(() => {
        const fetchBillData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [details, actions] = await Promise.all([
                    billsService.getBillDetails(congress, billType, billNumber),
                    billsService.getBillActions(congress, billType, billNumber)
                ]);
                setBillDetails(details);
                setActions(actions);
            }
            catch (err) {
                console.error('Error fetching bill data:', err);
                setError('Failed to load congressional data');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBillData();
    }, [congress, billType, billNumber]);
    useEffect(() => {
        const fetchUserAndPoll = async () => {
            // Get current user
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
            // Fetch poll results
            const results = await pollService.getPollResults(congress, billType, parseInt(billNumber));
            setPollResults(results);
            // Fetch user's vote if authenticated
            if (currentUser) {
                const vote = await pollService.getUserVote(congress, billType, parseInt(billNumber));
                setUserVote(vote);
            }
        };
        fetchUserAndPoll();
    }, [congress, billType, billNumber]);
    const presidentialActions = billsService.extractPresidentialActions(actions);
    const displayActions = activeTab === 'presidential' ? presidentialActions : actions.slice(0, 5);
    const getActionIcon = (type) => {
        if (type === 'SignedByPresident') {
            return _jsx(FaCheckCircle, { className: "text-green-500" });
        }
        else if (type === 'VetoedByPresident') {
            return _jsx(FaBan, { className: "text-red-500" });
        }
        return null;
    };
    const handleVote = async (voteType) => {
        if (!user) {
            // Redirect to auth or show modal
            alert('Please sign in to vote on bills');
            return;
        }
        setVotingLoading(true);
        try {
            const success = await pollService.submitVote(congress, billType, parseInt(billNumber), voteType);
            if (success) {
                setUserVote(voteType);
                // Refresh poll results
                const results = await pollService.getPollResults(congress, billType, parseInt(billNumber));
                setPollResults(results);
            }
        }
        catch (err) {
            console.error('Error voting:', err);
        }
        finally {
            setVotingLoading(false);
        }
    };
    const getPercentage = (count) => {
        if (pollResults.total === 0)
            return 0;
        return Math.round((count / pollResults.total) * 100);
    };
    return (_jsxs("div", { className: "w-full energy-container bg-black/40 p-3 rounded-lg border border-matrix-green/30", children: [_jsx("h3", { className: "text-lg font-bold text-matrix-green mb-1", children: billDetails?.title || `${billType.toUpperCase()} ${billNumber}` }), billDetails?.title && (_jsxs("p", { className: "text-xs text-matrix-green/60 mb-3", children: [billType.toUpperCase(), " ", billNumber, " \u2022 Congress ", congress] })), _jsxs("div", { className: "mb-4 p-3 bg-black/60 rounded border border-matrix-green/20", children: [_jsx("p", { className: "text-xs font-semibold text-matrix-green mb-2", children: "What's your stance?" }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsxs("button", { onClick: () => handleVote('support'), disabled: votingLoading, className: `flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded transition-colors ${userVote === 'support'
                                    ? 'bg-green-500/30 text-green-400 border border-green-500'
                                    : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'} disabled:opacity-50`, children: [_jsx(FaThumbsUp, { size: 12 }), "Support"] }), _jsxs("button", { onClick: () => handleVote('oppose'), disabled: votingLoading, className: `flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded transition-colors ${userVote === 'oppose'
                                    ? 'bg-red-500/30 text-red-400 border border-red-500'
                                    : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'} disabled:opacity-50`, children: [_jsx(FaThumbsDown, { size: 12 }), "Oppose"] }), _jsxs("button", { onClick: () => handleVote('abstain'), disabled: votingLoading, className: `flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded transition-colors ${userVote === 'abstain'
                                    ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500'
                                    : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'} disabled:opacity-50`, children: [_jsx(FaHandPaper, { size: 12 }), "Abstain"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs text-matrix-green/60", children: "Support" }), _jsxs("span", { className: "text-xs text-matrix-green", children: [getPercentage(pollResults.support), "%"] })] }), _jsx("div", { className: "h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden", children: _jsx("div", { className: "h-full bg-green-500/50 transition-all", style: { width: `${getPercentage(pollResults.support)}%` } }) }), _jsxs("div", { className: "flex items-center justify-between mb-1 mt-2", children: [_jsx("span", { className: "text-xs text-matrix-green/60", children: "Oppose" }), _jsxs("span", { className: "text-xs text-matrix-green", children: [getPercentage(pollResults.oppose), "%"] })] }), _jsx("div", { className: "h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden", children: _jsx("div", { className: "h-full bg-red-500/50 transition-all", style: { width: `${getPercentage(pollResults.oppose)}%` } }) }), _jsxs("div", { className: "flex items-center justify-between mb-1 mt-2", children: [_jsx("span", { className: "text-xs text-matrix-green/60", children: "Abstain" }), _jsxs("span", { className: "text-xs text-matrix-green", children: [getPercentage(pollResults.abstain), "%"] })] }), _jsx("div", { className: "h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden", children: _jsx("div", { className: "h-full bg-yellow-500/50 transition-all", style: { width: `${getPercentage(pollResults.abstain)}%` } }) }), _jsxs("div", { className: "text-xs text-matrix-green/40 mt-2 text-center", children: [pollResults.total, " ", pollResults.total === 1 ? 'vote' : 'votes'] })] }), !user && (_jsx("p", { className: "text-xs text-matrix-green/50 mt-2 text-center italic", children: "Sign in to vote" }))] }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("button", { onClick: () => setActiveTab('all'), className: `px-3 py-1 text-sm rounded transition-colors ${activeTab === 'all'
                            ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green'
                            : 'text-matrix-green/60 hover:text-matrix-green'}`, children: "All" }), _jsx("button", { onClick: () => setActiveTab('presidential'), className: `px-3 py-1 text-sm rounded transition-colors ${activeTab === 'presidential'
                            ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green'
                            : 'text-matrix-green/60 hover:text-matrix-green'}`, children: "Presidential" })] }), loading ? (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx(FaSpinner, { className: "animate-spin text-matrix-green text-2xl" }) })) : error ? (_jsx("div", { className: "text-red-500 text-sm", children: error })) : displayActions.length === 0 ? (_jsx("div", { className: "text-matrix-green/60 text-sm", children: "No data available" })) : (_jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: displayActions.map((action, idx) => (_jsx("div", { className: "border-l-2 border-matrix-green/30 pl-3 py-2", children: _jsxs("div", { className: "flex items-start gap-2", children: [getActionIcon(action.type), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs text-matrix-green/60", children: new Date(action.actionDate).toLocaleDateString() }), _jsx("p", { className: "text-xs text-matrix-green line-clamp-2", children: action.text }), _jsx("p", { className: "text-xs text-matrix-green/50 mt-1", children: action.type })] })] }) }, idx))) })), !loading && !error && actions.length > 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-matrix-green/20", children: _jsxs("div", { className: "text-xs text-matrix-green/60 space-y-1", children: [_jsxs("p", { children: ["Total Actions: ", actions.length] }), _jsxs("p", { children: ["Presidential Actions: ", presidentialActions.length] }), _jsxs("p", { children: ["Signed: ", billsService.isSignedByPresident(actions) ? '✓' : '✗'] }), _jsxs("p", { children: ["Vetoed: ", billsService.isVetoedByPresident(actions) ? '✓' : '✗'] })] }) }))] }));
}
