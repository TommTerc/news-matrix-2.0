import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export interface BillAction {
  actionCode: string;
  actionDate: string;
  sourceSystem: {
    code: number;
    name: string;
  };
  text: string;
  type: 'BecameLaw' | 'IntroducedInSenate' | 'IntroducedInHouse' | 'PassedSenate' | 'PassedHouse' | 'SignedByPresident' | 'VetoedByPresident' | 'VetoOverride' | string;
}

export interface Bill {
  id: string;
  title: string;
  billNumber: string;
  congress: number;
  billType: string;
  introducedDate: string;
  lastUpdate: string;
  summary?: string;
  sponsor?: string;
  status?: string;
}

export interface BillWithActions extends Bill {
  actions: BillAction[];
}

export interface BillDetails {
  url: string;
  congress: number;
  billType: string;
  billNumber: string;
  title: string;
  introducedDate: string;
  latestAction?: {
    actionCode: string;
    actionDate: string;
    text: string;
    type: string;
  };
}

const billsService = {
  // Fetch full bill details including title
  getBillDetails: async (congress: number, billType: string, billNumber: string): Promise<BillDetails> => {
    try {
      const response = await axios.get(
        `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}`,
        {
          params: {
            api_key: API_CONFIG.congress.apiKey,
            format: 'json'
          }
        }
      );
      return response.data.bill || response.data;
    } catch (error) {
      console.error('Error fetching bill details:', error);
      throw error;
    }
  },

  // Fetch specific bill actions (includes all steps including presidential actions)
  getBillActions: async (congress: number, billType: string, billNumber: string): Promise<BillAction[]> => {
    try {
      const response = await axios.get(
        `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/actions`,
        {
          params: {
            api_key: API_CONFIG.congress.apiKey,
            format: 'json'
          }
        }
      );
      return response.data.actions || [];
    } catch (error) {
      console.error('Error fetching bill actions:', error);
      throw error;
    }
  },

  // Helper to extract presidential actions from bill actions
  extractPresidentialActions: (actions: BillAction[]) => {
    return actions.filter(action => 
      action.type === 'SignedByPresident' || 
      action.type === 'VetoedByPresident' || 
      action.type === 'VetoOverride'
    );
  },

  // Helper to check if bill became law
  isBillLaw: (actions: BillAction[]): boolean => {
    return actions.some(action => action.type === 'BecameLaw');
  },

  // Helper to check if bill was signed
  isSignedByPresident: (actions: BillAction[]): boolean => {
    return actions.some(action => action.type === 'SignedByPresident');
  },

  // Helper to check if bill was vetoed
  isVetoedByPresident: (actions: BillAction[]): boolean => {
    return actions.some(action => action.type === 'VetoedByPresident');
  },
};

export default billsService;
