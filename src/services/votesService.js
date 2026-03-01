import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
const votesService = {
    // Fetch detailed house vote data
    getHouseVote: async (congress, session, rollCallNumber) => {
        try {
            const response = await axios.get(`https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollCallNumber}`, {
                params: {
                    api_key: API_CONFIG.congress.apiKey,
                    format: 'json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching house vote:', error);
            throw error;
        }
    },
    // Fetch how each representative voted on a specific vote
    getHouseVoteMembers: async (congress, session, rollCallNumber) => {
        try {
            const response = await axios.get(`https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollCallNumber}/votes`, {
                params: {
                    api_key: API_CONFIG.congress.apiKey,
                    format: 'json'
                }
            });
            return response.data.results || [];
        }
        catch (error) {
            console.error('Error fetching house vote members:', error);
            throw error;
        }
    },
    // Helper to extract total vote counts from results
    getTotalVoteCounts: (results) => {
        return results.reduce((acc, member) => {
            switch (member.voteCast) {
                case 'Yea':
                    acc.yea++;
                    break;
                case 'Nay':
                    acc.nay++;
                    break;
                case 'Present':
                    acc.present++;
                    break;
                case 'NoVote':
                    acc.noVote++;
                    break;
            }
            return acc;
        }, { yea: 0, nay: 0, present: 0, noVote: 0 });
    },
    // Helper to get votes by party
    getVotesByParty: (results) => {
        return results.reduce((acc, member) => {
            if (!acc[member.voteParty]) {
                acc[member.voteParty] = { Yea: 0, Nay: 0, Present: 0, NoVote: 0 };
            }
            acc[member.voteParty][member.voteCast]++;
            return acc;
        }, {});
    },
    // Helper to get votes by state
    getVotesByState: (results) => {
        return results.reduce((acc, member) => {
            if (!acc[member.voteState]) {
                acc[member.voteState] = [];
            }
            acc[member.voteState].push({
                name: `${member.firstName} ${member.lastName}`,
                party: member.voteParty,
                vote: member.voteCast,
                bioguideID: member.bioguideID,
            });
            return acc;
        }, {});
    },
    // Helper to filter members by their vote
    getMembersByVote: (results, voteCast) => {
        return results.filter(member => member.voteCast === voteCast);
    },
    // Helper to get members from a specific party who voted a certain way
    getPartyVotes: (results, party) => {
        return results
            .filter(member => member.voteParty === party)
            .reduce((acc, member) => {
            acc[member.voteCast] = (acc[member.voteCast] || 0) + 1;
            return acc;
        }, {});
    },
    // Helper to determine vote outcome
    isVotePassed: (vote) => {
        return vote.result.toLowerCase() === 'passed';
    },
};
export default votesService;
