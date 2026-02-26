import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaBan, FaThumbsUp, FaThumbsDown, FaHandPaper } from 'react-icons/fa';
import billsService, { BillAction, BillDetails } from '../services/billsService';
import pollService, { PollResults, VoteType } from '../services/pollService';
import { supabase } from '../services/supabaseClient';

interface CongressWidgetProps {
  congress?: number;
  billType?: string;
  billNumber?: string;
}

export default function CongressWidget({ congress = 119, billType = 'hr', billNumber = '30' }: CongressWidgetProps) {
  const [actions, setActions] = useState<BillAction[]>([]);
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'presidential'>('all');
  const [user, setUser] = useState<any>(null);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [pollResults, setPollResults] = useState<PollResults>({ support: 0, oppose: 0, abstain: 0, total: 0 });
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
      } catch (err) {
        console.error('Error fetching bill data:', err);
        setError('Failed to load congressional data');
      } finally {
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

  const getActionIcon = (type: string) => {
    if (type === 'SignedByPresident') {
      return <FaCheckCircle className="text-green-500" />;
    } else if (type === 'VetoedByPresident') {
      return <FaBan className="text-red-500" />;
    }
    return null;
  };

  const handleVote = async (voteType: VoteType) => {
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
    } catch (err) {
      console.error('Error voting:', err);
    } finally {
      setVotingLoading(false);
    }
  };

  const getPercentage = (count: number) => {
    if (pollResults.total === 0) return 0;
    return Math.round((count / pollResults.total) * 100);
  };

  return (
    <div className="w-full energy-container bg-black/40 p-3 rounded-lg border border-matrix-green/30">
      <h3 className="text-lg font-bold text-matrix-green mb-1">
        {billDetails?.title || `${billType.toUpperCase()} ${billNumber}`}
      </h3>
      {billDetails?.title && (
        <p className="text-xs text-matrix-green/60 mb-3">
          {billType.toUpperCase()} {billNumber} • Congress {congress}
        </p>
      )}

      {/* Poll Section */}
      <div className="mb-4 p-3 bg-black/60 rounded border border-matrix-green/20">
        <p className="text-xs font-semibold text-matrix-green mb-2">What's your stance?</p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleVote('support')}
            disabled={votingLoading}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded transition-colors ${
              userVote === 'support'
                ? 'bg-green-500/30 text-green-400 border border-green-500'
                : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'
            } disabled:opacity-50`}
          >
            <FaThumbsUp size={12} />
            Support
          </button>
          <button
            onClick={() => handleVote('oppose')}
            disabled={votingLoading}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded transition-colors ${
              userVote === 'oppose'
                ? 'bg-red-500/30 text-red-400 border border-red-500'
                : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'
            } disabled:opacity-50`}
          >
            <FaThumbsDown size={12} />
            Oppose
          </button>
          <button
            onClick={() => handleVote('abstain')}
            disabled={votingLoading}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded transition-colors ${
              userVote === 'abstain'
                ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500'
                : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'
            } disabled:opacity-50`}
          >
            <FaHandPaper size={12} />
            Abstain
          </button>
        </div>

        {/* Poll Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-matrix-green/60">Support</span>
            <span className="text-xs text-matrix-green">{getPercentage(pollResults.support)}%</span>
          </div>
          <div className="h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden">
            <div
              className="h-full bg-green-500/50 transition-all"
              style={{ width: `${getPercentage(pollResults.support)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-1 mt-2">
            <span className="text-xs text-matrix-green/60">Oppose</span>
            <span className="text-xs text-matrix-green">{getPercentage(pollResults.oppose)}%</span>
          </div>
          <div className="h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden">
            <div
              className="h-full bg-red-500/50 transition-all"
              style={{ width: `${getPercentage(pollResults.oppose)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-1 mt-2">
            <span className="text-xs text-matrix-green/60">Abstain</span>
            <span className="text-xs text-matrix-green">{getPercentage(pollResults.abstain)}%</span>
          </div>
          <div className="h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden">
            <div
              className="h-full bg-yellow-500/50 transition-all"
              style={{ width: `${getPercentage(pollResults.abstain)}%` }}
            />
          </div>

          <div className="text-xs text-matrix-green/40 mt-2 text-center">
            {pollResults.total} {pollResults.total === 1 ? 'vote' : 'votes'}
          </div>
        </div>

        {!user && (
          <p className="text-xs text-matrix-green/50 mt-2 text-center italic">Sign in to vote</p>
        )}
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            activeTab === 'all'
              ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green'
              : 'text-matrix-green/60 hover:text-matrix-green'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('presidential')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            activeTab === 'presidential'
              ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green'
              : 'text-matrix-green/60 hover:text-matrix-green'
          }`}
        >
          Presidential
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-matrix-green text-2xl" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : displayActions.length === 0 ? (
        <div className="text-matrix-green/60 text-sm">No data available</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayActions.map((action, idx) => (
            <div key={idx} className="border-l-2 border-matrix-green/30 pl-3 py-2">
              <div className="flex items-start gap-2">
                {getActionIcon(action.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-matrix-green/60">
                    {new Date(action.actionDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-matrix-green line-clamp-2">{action.text}</p>
                  <p className="text-xs text-matrix-green/50 mt-1">{action.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && !error && actions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-matrix-green/20">
          <div className="text-xs text-matrix-green/60 space-y-1">
            <p>Total Actions: {actions.length}</p>
            <p>Presidential Actions: {presidentialActions.length}</p>
            <p>
              Signed: {billsService.isSignedByPresident(actions) ? '✓' : '✗'}
            </p>
            <p>
              Vetoed: {billsService.isVetoedByPresident(actions) ? '✓' : '✗'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
