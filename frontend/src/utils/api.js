import axios from 'axios';

// Set base URL from environment
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Add token to requests if it exists
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// API service object with methods for different endpoints
const api = {
  // User Stats
  getUserStats: async () => {
    return axios.get('/users/stats');
  },

  // Chores
  getChores: async (category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return axios.get(`/chores${query}`);
  },

  getChore: async (id) => {
    return axios.get(`/chores/${id}`);
  },

  createChore: async (choreData) => {
    return axios.post('/chores', choreData);
  },

  updateChore: async (id, choreData) => {
    return axios.patch(`/chores/${id}`, choreData);
  },

  deleteChore: async (id) => {
    return axios.delete(`/chores/${id}`);
  },

  // Completed Chores
  getCompletedChores: async (params) => {
    let query = '';

    if (params) {
      const queryParams = [];

      if (params.user) queryParams.push(`user=${params.user}`);
      if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
      if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
      if (params.page) queryParams.push(`page=${params.page}`);
      if (params.limit) queryParams.push(`limit=${params.limit}`);

      if (queryParams.length > 0) {
        query = `?${queryParams.join('&')}`;
      }
    }

    return axios.get(`/completed-chores${query}`);
  },

  getCompletedChore: async (id) => {
    return axios.get(`/completed-chores/${id}`);
  },

  completeChore: async (completionData) => {
    return axios.post('/completed-chores', completionData);
  },

  updateCompletedChore: async (id, updateData) => {
    return axios.patch(`/completed-chores/${id}`, updateData);
  },

  deleteCompletedChore: async (id) => {
    return axios.delete(`/completed-chores/${id}`);
  },

  // Household
  getHousehold: async () => {
    return axios.get('/households/my-household');
  },

  createHousehold: async (householdData) => {
    return axios.post('/households', householdData);
  },

  updateHousehold: async (id, householdData) => {
    return axios.patch(`/households/${id}`, householdData);
  },

  joinHousehold: async (inviteCode) => {
    return axios.post('/households/join', { inviteCode });
  },

  generateInviteCode: async (householdId) => {
    return axios.post(`/households/${householdId}/generate-invite`);
  },

  // Chore Templates (Marketplace)
  getChoreTemplates: async (category = null, search = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return axios.get(`/chore-templates?${params.toString()}`);
  },

  getChoreTemplatesByCategory: async () => {
    return axios.get('/chore-templates/by-category');
  },

  getChoreTemplate: async (id) => {
    return axios.get(`/chore-templates/${id}`);
  },

  addChoreFromTemplate: async (templateId) => {
    return axios.post(`/chores/from-template/${templateId}`);
  },

  // Achievements
  getMyAchievements: async () => {
    return axios.get('/achievements/my-achievements');
  },

  getHouseholdAchievements: async () => {
    return axios.get('/achievements/household');
  },

  // Leaderboard
  getDailyLeaderboard: async () => {
    return axios.get('/leaderboard/daily');
  },

  getWeeklyLeaderboard: async () => {
    return axios.get('/leaderboard/weekly');
  },

  getMonthlyLeaderboard: async () => {
    return axios.get('/leaderboard/monthly');
  },

  getAllTimeLeaderboard: async () => {
    return axios.get('/leaderboard/all-time');
  }
};

export { setAuthToken };
export default api;
