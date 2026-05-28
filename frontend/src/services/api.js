const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to extract headers containing the authorization key safely
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper function to safely parse JSON responses
const parseResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  
  if (!res.ok) {
    // Check if response is JSON before parsing
    if (contentType && contentType.includes('application/json')) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP Error ${res.status}`);
    } else {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
  }
  
  // For successful responses, parse as JSON
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    throw new Error('Invalid response format from server');
  }
};

export const ApiClient = {
  // --- AUTHENTICATION ENDPOINTS ---
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return parseResponse(res);
  },

  async signup(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return parseResponse(res);
  },

  // --- SHORT LINK MANAGEMENT ENDPOINTS ---
  async getLinks() {
    const res = await fetch(`${API_BASE_URL}/links`, {
      method: 'GET',
      headers: getHeaders()
    });
    return parseResponse(res);
  },

  async createLink({ longUrl, title, alias, expiresAt }) {
    const body = { longUrl, title };
    if (alias) body.alias = alias;
    if (expiresAt) body.expiresAt = expiresAt;

    const res = await fetch(`${API_BASE_URL}/links`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return parseResponse(res);
  },

  async deleteLink(id) {
    const res = await fetch(`${API_BASE_URL}/links/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return parseResponse(res);
  },

  // --- VISITOR ANALYTICS BRIDGE ---
  // Connects the charts directly to the data fields retrieved from the backend
  async getAnalytics(linkId) {
    // If you haven't built a separate analytics route, we parse the logs right out of the link document
    const res = await fetch(`${API_BASE_URL}/links`, {
      method: 'GET',
      headers: getHeaders()
    });
    const links = await parseResponse(res);
    
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