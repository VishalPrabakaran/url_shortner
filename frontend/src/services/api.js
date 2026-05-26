/**
 * SHORTX API & Database Client Service
 * 
 * Production-ready REST services supporting backend API endpoints (VITE_API_BASE_URL)
 * with a high-fidelity local database fallback utilizing localStorage.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// --- HIGH FIDELITY MOCK DATABASE ---
const MOCK_LINKS_KEY = 'shortx_links';
const MOCK_ANALYTICS_KEY = 'shortx_analytics';
const MOCK_USER_KEY = 'shortx_session_user';

// Pre-fill premium demo links and analytics if localStorage is empty
const INITIAL_LINKS = [
  {
    id: 'link-1',
    title: 'Wix Studio Premium Templates Preview',
    longUrl: 'https://www.wix.com/studio/templates/premium-designs-showcase-2026',
    shortUrl: 'https://shrt.x/studio-wix',
    alias: 'studio-wix',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    clicks: 1428,
    expiresAt: null
  },
  {
    id: 'link-2',
    title: 'Figma Design System UI Kits V4',
    longUrl: 'https://figma.com/file/enterprise-design-system-wix-studio-mirror-2026',
    shortUrl: 'https://shrt.x/figma-kits',
    alias: 'figma-kits',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    clicks: 856,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Expires in 30 days
  },
  {
    id: 'link-3',
    title: 'NextJS v16 Framework Documentation Core',
    longUrl: 'https://nextjs.org/docs/app/building-your-application/routing/middleware',
    shortUrl: 'https://shrt.x/next-route',
    alias: 'next-route',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    clicks: 341,
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // Expired yesterday
  }
];

// Seed analytics history mapping days
const generateSeedAnalytics = () => {
  const analyticsMap = {};
  
  // Studio links ids
  const ids = ['link-1', 'link-2', 'link-3'];
  
  ids.forEach(id => {
    // Generate daily clicks for the last 7 days
    const dailyClicks = [];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Brave'];
    const operatingSystems = ['macOS', 'Windows', 'iOS', 'Android', 'Linux'];
    const countries = ['US', 'GB', 'DE', 'CA', 'JP', 'FR', 'AU', 'SG'];
    const referrers = ['Direct', 'LinkedIn', 'Twitter', 'GitHub', 'Google', 'Newsletter'];
    
    // Generate visitor logs
    const visitors = [];
    const baseClicks = id === 'link-1' ? 1428 : id === 'link-2' ? 856 : 341;
    
    for (let i = 0; i < 7; i++) {
      const dateStr = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const clicksOnDay = Math.floor(baseClicks / (7 + i * 1.5)) + Math.floor(Math.random() * 20);
      dailyClicks.unshift({ date: dateStr, clicks: clicksOnDay });
    }
    
    for (let i = 0; i < 15; i++) {
      const hoursAgo = Math.floor(Math.random() * 48);
      visitors.push({
        id: `visitor-${id}-${i}`,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)]
      });
    }
    
    visitors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    analyticsMap[id] = {
      dailyClicks,
      visitors,
      topReferrer: referrers[Math.floor(Math.random() * 3)] // Bias towards top 3
    };
  });
  
  return analyticsMap;
};

// Initialize localStorage DB
if (!localStorage.getItem(MOCK_LINKS_KEY)) {
  localStorage.setItem(MOCK_LINKS_KEY, JSON.stringify(INITIAL_LINKS));
}
if (!localStorage.getItem(MOCK_ANALYTICS_KEY)) {
  localStorage.setItem(MOCK_ANALYTICS_KEY, JSON.stringify(generateSeedAnalytics()));
}

// Utility to sleep (simulates network latency)
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiClient = {
  // --- AUTH SERVICES ---
  async login(email, password) {
    await delay(600);
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Authentication failed.');
      }
      return await res.json();
    } else {
      // Mock validation
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      
      const user = {
        email,
        name: email.split('@')[0].toUpperCase(),
        role: 'Enterprise Member'
      };
      const token = 'mock-jwt-token-shortx-2026';
      
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify({ user, token }));
      return { user, token };
    }
  },
  
  async signup(email, password) {
    await delay(700);
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed.');
      }
      return await res.json();
    } else {
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      
      const user = {
        email,
        name: email.split('@')[0].toUpperCase(),
        role: 'Enterprise Member'
      };
      const token = 'mock-jwt-token-shortx-2026';
      
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify({ user, token }));
      return { user, token };
    }
  },
  
  async logout() {
    await delay(200);
    if (API_BASE) {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } else {
      localStorage.removeItem(MOCK_USER_KEY);
    }
  },

  // --- SHORT LINK DIRECTORY SERVICES ---
  async getLinks() {
    await delay(500);
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/links`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch link directory.');
      return await res.json();
    } else {
      return JSON.parse(localStorage.getItem(MOCK_LINKS_KEY)) || [];
    }
  },
  
  async createLink({ longUrl, alias, expiresAt }) {
    await delay(800);
    
    // Client-side Input Validation
    if (!longUrl) {
      throw new Error('Destination URL is required.');
    }
    
    // URL Protocol Check
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(longUrl)) {
      throw new Error('URL must start with http:// or https://');
    }
    
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ longUrl, alias, expiresAt })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to generate short link.');
      }
      return await res.json();
    } else {
      const links = JSON.parse(localStorage.getItem(MOCK_LINKS_KEY)) || [];
      
      // Alias validation
      const generatedAlias = alias ? alias.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') : Math.random().toString(36).substring(2, 8);
      if (alias && links.some(l => l.alias === generatedAlias)) {
        throw new Error('This Custom Alias is already in use by another link.');
      }
      
      // Attempt to fetch title from mock sources, or default beautifully
      let title = longUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      title = title.charAt(0).toUpperCase() + title.slice(1) + ' Workspace Destination';
      
      const newLink = {
        id: `link-${Date.now()}`,
        title,
        longUrl,
        shortUrl: `https://shrt.x/${generatedAlias}`,
        alias: generatedAlias,
        createdAt: new Date().toISOString(),
        clicks: 0,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
      };
      
      // Update links store
      links.unshift(newLink);
      localStorage.setItem(MOCK_LINKS_KEY, JSON.stringify(links));
      
      // Initialize matching empty analytics
      const analytics = JSON.parse(localStorage.getItem(MOCK_ANALYTICS_KEY)) || {};
      
      const seedDaily = [];
      for (let i = 6; i >= 0; i--) {
        const dateStr = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        seedDaily.push({ date: dateStr, clicks: 0 });
      }
      
      analytics[newLink.id] = {
        dailyClicks: seedDaily,
        visitors: [],
        topReferrer: 'Direct'
      };
      localStorage.setItem(MOCK_ANALYTICS_KEY, JSON.stringify(analytics));
      
      return newLink;
    }
  },
  
  async deleteLink(id) {
    await delay(600);
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/links/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete short link.');
      return true;
    } else {
      // Deletion
      const links = JSON.parse(localStorage.getItem(MOCK_LINKS_KEY)) || [];
      const filtered = links.filter(l => l.id !== id);
      localStorage.setItem(MOCK_LINKS_KEY, JSON.stringify(filtered));
      
      // Analytics cleaning
      const analytics = JSON.parse(localStorage.getItem(MOCK_ANALYTICS_KEY)) || {};
      delete analytics[id];
      localStorage.setItem(MOCK_ANALYTICS_KEY, JSON.stringify(analytics));
      
      return true;
    }
  },

  // --- DETAILED VISITOR ANALYTICS SERVICES ---
  async getAnalytics(linkId) {
    await delay(400);
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/analytics/${linkId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load link statistics.');
      return await res.json();
    } else {
      const analytics = JSON.parse(localStorage.getItem(MOCK_ANALYTICS_KEY)) || {};
      
      // Fallback fallback in case the link ID is missing in analytics
      if (!analytics[linkId]) {
        const seedDaily = [];
        for (let i = 6; i >= 0; i--) {
          const dateStr = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          seedDaily.push({ date: dateStr, clicks: 0 });
        }
        analytics[linkId] = {
          dailyClicks: seedDaily,
          visitors: [],
          topReferrer: 'Direct'
        };
        localStorage.setItem(MOCK_ANALYTICS_KEY, JSON.stringify(analytics));
      }
      
      return analytics[linkId];
    }
  },
  
  // Simulated click triggers (testing interactions inside sandbox)
  async recordMockClick(linkId) {
    if (API_BASE) return;
    
    const links = JSON.parse(localStorage.getItem(MOCK_LINKS_KEY)) || [];
    const linkIdx = links.findIndex(l => l.id === linkId);
    if (linkIdx === -1) return;
    
    // Increment total click counter
    links[linkIdx].clicks += 1;
    localStorage.setItem(MOCK_LINKS_KEY, JSON.stringify(links));
    
    // Add click event log
    const analytics = JSON.parse(localStorage.getItem(MOCK_ANALYTICS_KEY)) || {};
    if (analytics[linkId]) {
      const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
      const operatingSystems = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
      const countries = ['US', 'GB', 'DE', 'CA', 'FR', 'IN', 'JP', 'BR'];
      const referrers = ['LinkedIn', 'Twitter', 'Google', 'Direct', 'GitHub'];
      
      const newVisitor = {
        id: `visitor-${Date.now()}`,
        timestamp: new Date().toISOString(),
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)]
      };
      
      // Add to visitor log
      analytics[linkId].visitors.unshift(newVisitor);
      if (analytics[linkId].visitors.length > 30) {
        analytics[linkId].visitors.pop(); // Keep top logs manageable
      }
      
      // Update chart click metrics for today
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const chartData = analytics[linkId].dailyClicks;
      const todayDataIdx = chartData.findIndex(item => item.date === todayStr);
      
      if (todayDataIdx !== -1) {
        chartData[todayDataIdx].clicks += 1;
      } else {
        chartData.shift();
        chartData.push({ date: todayStr, clicks: 1 });
      }
      
      // Recalculate top referrer bias
      const referrerCounts = {};
      analytics[linkId].visitors.forEach(v => {
        referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
      });
      let topRef = 'Direct';
      let maxCount = 0;
      Object.keys(referrerCounts).forEach(ref => {
        if (referrerCounts[ref] > maxCount) {
          maxCount = referrerCounts[ref];
          topRef = ref;
        }
      });
      analytics[linkId].topReferrer = topRef;
      
      localStorage.setItem(MOCK_ANALYTICS_KEY, JSON.stringify(analytics));
    }
  }
};
