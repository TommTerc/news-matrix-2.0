import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export interface Representative {
  bioguideID: string;
  firstName: string;
  lastName: string;
  voteCast: 'Yea' | 'Nay' | 'Present' | 'NoVote';
  voteParty: string;
  voteState: string;
}

export interface PartyVoteTotal {
  nayTotal: number;
  notVotingTotal: number;
  presentTotal: number;
  voteParty: string;
  yeaTotal: number;
  party: {
    name: string;
    type: string;
  };
}

export interface HouseVote {
  congress: number;
  identifier: number;
  legislationNumber: string;
  legislationType: string;
  legislationUrl: string;
  result: string;
  rollCallNumber: number;
  sessionNumber: number;
  sourceDataURL: string;
  startDate: string;
  updateDate: string;
  voteType: string;
  results: Representative[];
  voteQuestion: string;
}

const votesService = {
  // Fetch detailed house vote data
  getHouseVote: async (congress: number, session: number, rollCallNumber: number): Promise<HouseVote> => {
    try {
      const response = await axios.get(
        `https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollCallNumber}`,
        {
          params: {
            api_key: API_CONFIG.congress.apiKey,
            format: 'json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching house vote:', error);
      throw error;
    }
  },

  // Fetch how each representative voted on a specific vote
  getHouseVoteMembers: async (
    congress: number,
    session: number,
    rollCallNumber: number
  ): Promise<Representative[]> => {
    try {
      const response = await axios.get(
        `https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollCallNumber}/votes`,
        {
          params: {
            api_key: API_CONFIG.congress.apiKey,
            format: 'json'
          }
        }
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching house vote members:', error);
      throw error;
    }
  },

  // Helper to extract total vote counts from results
  getTotalVoteCounts: (results: Representative[]) => {
    return results.reduce(
      (acc, member) => {
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
      },
      { yea: 0, nay: 0, present: 0, noVote: 0 }
    );
  },

  // Helper to get votes by party
  getVotesByParty: (results: Representative[]) => {
    return results.reduce(
      (acc, member) => {
        if (!acc[member.voteParty]) {
          acc[member.voteParty] = { Yea: 0, Nay: 0, Present: 0, NoVote: 0 };
        }
        acc[member.voteParty][member.voteCast]++;
        return acc;
      },
      {} as Record<string, Record<string, number>>
    );
  },

  // Helper to get votes by state
  getVotesByState: (results: Representative[]) => {
    return results.reduce(
      (acc, member) => {
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
      },
      {} as Record<string, Array<{ name: string; party: string; vote: string; bioguideID: string }>>
    );
  },

  // Helper to filter members by their vote
  getMembersByVote: (results: Representative[], voteCast: 'Yea' | 'Nay' | 'Present' | 'NoVote') => {
    return results.filter(member => member.voteCast === voteCast);
  },

  // Helper to get members from a specific party who voted a certain way
  getPartyVotes: (results: Representative[], party: string) => {
    return results
      .filter(member => member.voteParty === party)
      .reduce(
        (acc, member) => {
          acc[member.voteCast] = (acc[member.voteCast] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
  },

  // Helper to determine vote outcome
  isVotePassed: (vote: HouseVote): boolean => {
    return vote.result.toLowerCase() === 'passed';
  },
};

export default votesService;
