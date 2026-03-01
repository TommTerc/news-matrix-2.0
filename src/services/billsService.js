import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
const billsService = {
    // Fetch full bill details including title
    getBillDetails: async (congress, billType, billNumber) => {
        try {
            const response = await axios.get(`https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}`, {
                params: {
                    api_key: API_CONFIG.congress.apiKey,
                    format: 'json'
                }
            });
            return response.data.bill || response.data;
        }
        catch (error) {
            console.error('Error fetching bill details:', error);
            throw error;
        }
    },
    // Fetch specific bill actions (includes all steps including presidential actions)
    getBillActions: async (congress, billType, billNumber) => {
        try {
            const response = await axios.get(`https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/actions`, {
                params: {
                    api_key: API_CONFIG.congress.apiKey,
                    format: 'json'
                }
            });
            return response.data.actions || [];
        }
        catch (error) {
            console.error('Error fetching bill actions:', error);
            throw error;
        }
    },
    // Helper to extract presidential actions from bill actions
    extractPresidentialActions: (actions) => {
        return actions.filter(action => action.type === 'SignedByPresident' ||
            action.type === 'VetoedByPresident' ||
            action.type === 'VetoOverride');
    },
    // Helper to check if bill became law
    isBillLaw: (actions) => {
        return actions.some(action => action.type === 'BecameLaw');
    },
    // Helper to check if bill was signed
    isSignedByPresident: (actions) => {
        return actions.some(action => action.type === 'SignedByPresident');
    },
    // Helper to check if bill was vetoed
    isVetoedByPresident: (actions) => {
        return actions.some(action => action.type === 'VetoedByPresident');
    },
};
export default billsService;
