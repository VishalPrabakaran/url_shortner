const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to extract headers containing the authorization key safely
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const ApiClient = {
  // --- AUTHENTICATION ENDPOINTS ---
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data; 
  },

  async signup(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    return data;
  },

  // --- SHORT LINK MANAGEMENT ENDPOINTS ---
  async getLinks() {
    const res = await fetch(`${API_BASE_URL}/links`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard links');
    return data; 
  },

  async createLink({ longUrl, title, alias }) {
    const res = await fetch(`${API_BASE_URL}/links`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ longUrl, title, alias })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create shortened URL');
    return data;
  },

  async deleteLink(id) {
    const res = await fetch(`${API_BASE_URL}/links/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete link resource');
    return data;
  },

  // --- VISITOR ANALYTICS BRIDGE ---
  // Connects the charts directly to the data fields retrieved from the backend
  async getAnalytics(linkId) {
    // If you haven't built a separate analytics route, we parse the logs right out of the link document
    const res = await fetch(`${API_BASE_URL}/links`, {
      method: 'GET',
      headers: getHeaders()
    });
    const links = await res.json();
    if (!res.ok) throw new Error('Failed to load link statistics.');
    
    const activeLink = links.find(l => l.id === linkId || l._id === linkId);
    
    // Format data format structures precisely how your UI charts want them
    const dailyClicks = [
      { date: "Mon", clicks: activeLink?.clicks || 0 }
    ];

    return {
      dailyClicks,
      visitors: activeLink?.visits || [],
      topReferrer: 'Direct'
    };
  }
};