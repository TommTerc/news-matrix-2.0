import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaBan } from 'react-icons/fa';
import billsService, { BillAction, BillDetails } from '../services/billsService';

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

      {/* Tabs */}
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
