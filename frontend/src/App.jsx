import { useState, useEffect, useRef, useCallback } from "react";
import {
  Link2, Copy, Check, Trash2, BarChart2, ExternalLink,
  Search, LogOut, Plus, X, TrendingUp, MousePointerClick,
  Globe, Clock, Eye, Zap, Shield, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────

const slugify = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const generateAnalytics = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const countries = [
    { name: "United States", code: "US", pct: 38 },
    { name: "United Kingdom", code: "GB", pct: 19 },
    { name: "Germany", code: "DE", pct: 14 },
    { name: "India", code: "IN", pct: 11 },
    { name: "Canada", code: "CA", pct: 9 },
    { name: "Australia", code: "AU", pct: 9 },
  ];
  const devices = [
    { name: "Desktop", pct: 54, color: "#4F46E5" },
    { name: "Mobile", pct: 33, color: "#818CF8" },
    { name: "Tablet", pct: 13, color: "#C7D2FE" },
  ];
  return {
    clicks: days.map((d) => ({ day: d, clicks: Math.floor(Math.random() * 400) + 80 })),
    countries,
    devices,
    total: Math.floor(Math.random() * 8000) + 2000,
    unique: Math.floor(Math.random() * 4000) + 1000,
    ctr: (Math.random() * 6 + 2).toFixed(1),
    avgTime: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 50) + 10}s`,
  };
};

const DEMO_LINKS = [
  {
    id: "1", original: "https://docs.stripe.com/api/payment_intents/create",
    short: "shortx.io/str-pi9", title: "Stripe Payment Intents Docs",
    clicks: 4821, created: "2025-06-01", analytics: generateAnalytics(),
  },
  {
    id: "2", original: "https://vercel.com/docs/deployments/overview",
    short: "shortx.io/vcl-dep", title: "Vercel Deployment Overview",
    clicks: 3102, created: "2025-06-03", analytics: generateAnalytics(),
  },
  {
    id: "3", original: "https://tailwindcss.com/docs/configuration",
    short: "shortx.io/twnd-cfg", title: "Tailwind Config Reference",
    clicks: 2540, created: "2025-06-07", analytics: generateAnalytics(),
  },
  {
    id: "4", original: "https://github.com/facebook/react/releases",
    short: "shortx.io/rct-rel", title: "React Release Notes",
    clicks: 1876, created: "2025-06-10", analytics: generateAnalytics(),
  },
];

const LS_KEY = "shortx_links_v3";
const LS_USER = "shortx_user_v3";

// ─── Styles (injected once) ─────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #F9F9FA;
    --surface:   #FFFFFF;
    --border:    #EAEAEA;
    --border2:   #D4D4D8;
    --text:      #111111;
    --muted:     #666666;
    --hint:      #A1A1AA;
    --indigo:    #4F46E5;
    --indigo-h:  #4338CA;
    --indigo-lt: #EEF2FF;
    --indigo-md: #818CF8;
    --red:       #EF4444;
    --red-lt:    #FEF2F2;
    --green:     #16A34A;
    --green-lt:  #F0FDF4;
    --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow:    0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
    --shadow-lg: 0 12px 32px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
    --radius-sm: 8px;
    --radius:    12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
  }

  body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }

  /* ── Auth ── */
  .auth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: radial-gradient(ellipse at 20% 50%, rgba(79,70,229,.07) 0%, transparent 55%),
                radial-gradient(ellipse at 80% 20%, rgba(129,140,248,.08) 0%, transparent 45%),
                var(--bg);
  }
  .auth-box { width: 100%; max-width: 420px; }
  .auth-brand {
    display: flex; align-items: center; gap: 10px;
    justify-content: center; margin-bottom: 1.75rem;
  }
  .auth-brand-icon {
    width: 38px; height: 38px; background: var(--indigo);
    border-radius: var(--radius-sm); display: flex; align-items: center;
    justify-content: center; box-shadow: 0 4px 14px rgba(79,70,229,.35);
  }
  .auth-brand-name { font-size: 19px; font-weight: 800; letter-spacing: -0.4px; }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-xl); padding: 2rem;
    box-shadow: var(--shadow);
  }
  .auth-heading { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 4px; }
  .auth-sub { font-size: 14px; color: var(--muted); text-align: center; margin-bottom: 1.5rem; }

  .toggle-row {
    display: flex; background: #F4F4F5; border-radius: var(--radius-sm);
    padding: 3px; margin-bottom: 1.5rem; position: relative;
  }
  .toggle-pill {
    position: absolute; top: 3px; bottom: 3px;
    width: calc(50% - 3px); background: var(--surface);
    border-radius: 6px; box-shadow: var(--shadow-sm);
    transition: left .25s cubic-bezier(.4,0,.2,1);
  }
  .toggle-btn {
    flex: 1; padding: 8px; font-size: 13px; font-weight: 600;
    border: none; background: transparent; cursor: pointer;
    border-radius: 6px; position: relative; z-index: 1;
    transition: color .25s; color: var(--muted);
  }
  .toggle-btn.active { color: var(--text); }

  .field { margin-bottom: 1rem; }
  .field-label {
    display: block; font-size: 11px; font-weight: 700;
    color: var(--muted); text-transform: uppercase; letter-spacing: .7px;
    margin-bottom: 6px;
  }
  .field-input {
    width: 100%; padding: 10px 14px; font-size: 14px; font-family: inherit;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    background: #FAFAFA; color: var(--text);
    transition: all .2s; outline: none;
  }
  .field-input:focus { border-color: var(--indigo); background: var(--surface); box-shadow: 0 0 0 3px rgba(79,70,229,.12); }
  .field-input::placeholder { color: var(--hint); }

  .err-banner {
    display: flex; align-items: center; gap: 8px;
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 1rem;
  }
  .err-text { font-size: 13px; color: #DC2626; font-weight: 500; }

  .btn-primary {
    width: 100%; padding: 11px; font-family: inherit;
    background: var(--indigo); color: #fff; border: none;
    border-radius: var(--radius-sm); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all .2s; margin-top: 4px;
    box-shadow: 0 4px 14px rgba(79,70,229,.3);
  }
  .btn-primary:hover:not(:disabled) { background: var(--indigo-h); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,.38); }
  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-primary:disabled { opacity: .65; cursor: not-allowed; }
  .btn-primary .spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spin .7s linear infinite;
    margin-right: 8px; vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-footer { text-align: center; font-size: 12px; color: var(--hint); margin-top: 1.25rem; }
  .auth-footer strong { color: var(--muted); }

  /* ── Navbar ── */
  .navbar {
    position: sticky; top: 0; z-index: 40;
    background: rgba(255,255,255,.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 1.5rem; height: 52px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-left { display: flex; align-items: center; gap: 1.5rem; }
  .nav-brand { display: flex; align-items: center; gap: 9px; }
  .nav-brand-icon {
    width: 28px; height: 28px; background: var(--indigo);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(79,70,229,.3);
  }
  .nav-brand-name { font-size: 15px; font-weight: 800; letter-spacing: -0.3px; }
  .nav-tabs { display: flex; gap: 2px; }
  .nav-tab {
    padding: 6px 13px; font-size: 12px; font-weight: 600;
    border: none; background: transparent; cursor: pointer;
    border-radius: var(--radius-sm); color: var(--muted);
    transition: all .18s; font-family: inherit;
  }
  .nav-tab:hover { color: var(--text); background: #F4F4F5; }
  .nav-tab.active { color: var(--indigo); background: var(--indigo-lt); }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .user-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 12px; background: #F4F4F5;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
  }
  .user-avatar {
    width: 22px; height: 22px; background: var(--indigo-lt);
    border-radius: 5px; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--indigo);
  }
  .user-name { font-size: 12px; font-weight: 600; }
  .logout-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 11px; font-size: 12px; font-weight: 600;
    border: none; background: transparent; cursor: pointer; font-family: inherit;
    color: var(--muted); border-radius: var(--radius-sm); transition: all .18s;
  }
  .logout-btn:hover { color: var(--red); background: var(--red-lt); }

  /* ── Dashboard main ── */
  .dash-main { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }

  /* Stats strip */
  .stats-strip {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
    box-shadow: var(--shadow-sm);
  }
  .stat-icon {
    width: 40px; height: 40px; background: var(--indigo-lt);
    border-radius: 10px; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; color: var(--indigo);
  }
  .stat-val { font-size: 22px; font-weight: 700; line-height: 1.1; }
  .stat-lbl { font-size: 12px; color: var(--muted); margin-top: 3px; }

  /* Toolbar */
  .toolbar { display: flex; gap: 10px; margin-bottom: 1rem; }
  .search-wrap { flex: 1; position: relative; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--hint); pointer-events: none; }
  .search-input {
    width: 100%; padding: 10px 14px 10px 36px; font-size: 14px; font-family: inherit;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text); outline: none; transition: all .2s;
  }
  .search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px rgba(79,70,229,.12); }
  .search-input::placeholder { color: var(--hint); }
  .new-link-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: var(--indigo); color: #fff;
    border: none; border-radius: var(--radius-sm); font-size: 14px;
    font-weight: 600; cursor: pointer; font-family: inherit;
    white-space: nowrap; transition: all .2s;
    box-shadow: 0 4px 12px rgba(79,70,229,.28);
  }
  .new-link-btn:hover { background: var(--indigo-h); transform: translateY(-1px); }
  .new-link-btn:active { transform: translateY(0); }

  /* Create panel */
  .create-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem 1.5rem;
    margin-bottom: 1rem; overflow: hidden;
    max-height: 0; opacity: 0;
    transition: max-height .35s cubic-bezier(.4,0,.2,1), opacity .25s, padding .3s, margin .3s;
  }
  .create-panel.open { max-height: 200px; opacity: 1; }
  .create-panel h3 { font-size: 14px; font-weight: 600; margin-bottom: 1rem; }
  .create-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .create-input {
    flex: 1; min-width: 180px; padding: 10px 14px; font-size: 14px; font-family: inherit;
    background: #FAFAFA; border: 1px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text); outline: none; transition: all .2s;
  }
  .create-input:focus { border-color: var(--indigo); background: var(--surface); box-shadow: 0 0 0 3px rgba(79,70,229,.12); }
  .create-input::placeholder { color: var(--hint); }
  .create-submit {
    padding: 10px 20px; background: var(--indigo); color: #fff;
    border: none; border-radius: var(--radius-sm); font-size: 14px;
    font-weight: 600; cursor: pointer; font-family: inherit;
    white-space: nowrap; transition: all .2s; flex-shrink: 0;
  }
  .create-submit:hover { background: var(--indigo-h); }
  .create-err { font-size: 12px; color: var(--red); font-weight: 500; margin-top: 8px; display: flex; align-items: center; gap: 5px; }

  /* Mobile tabs */
  .mobile-tabs { display: none; gap: 6px; margin-bottom: 1rem; }
  @media (max-width: 640px) { .mobile-tabs { display: flex; } .nav-tabs { display: none; } .stats-strip { grid-template-columns: 1fr; } }
  .mobile-tab {
    flex: 1; padding: 8px; font-size: 12px; font-weight: 600; font-family: inherit;
    border-radius: var(--radius-sm); border: 1px solid var(--border);
    background: var(--surface); color: var(--muted); cursor: pointer; transition: all .18s;
  }
  .mobile-tab.active { background: var(--indigo); color: #fff; border-color: var(--indigo); }

  /* Link cards grid */
  .links-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  @media (max-width: 640px) { .links-grid { grid-template-columns: 1fr; } }

  .link-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.1rem 1.25rem;
    display: flex; flex-direction: column; gap: 1rem;
    box-shadow: var(--shadow-sm); transition: all .25s cubic-bezier(.4,0,.2,1);
    position: relative;
  }
  .link-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); border-color: #D4D4D8; }

  .link-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .link-meta { min-width: 0; flex: 1; }
  .link-title-row { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .link-favicon { width: 15px; height: 15px; border-radius: 3px; flex-shrink: 0; }
  .link-title { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .link-orig { font-size: 12px; color: var(--muted); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .del-icon-btn {
    opacity: 0; width: 26px; height: 26px; flex-shrink: 0;
    border: none; background: transparent; cursor: pointer;
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    color: var(--hint); transition: all .18s;
  }
  .link-card:hover .del-icon-btn { opacity: 1; }
  .del-icon-btn:hover { color: var(--red); background: var(--red-lt); }

  .link-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 0.75rem; border-top: 1px solid #F4F4F5;
  }
  .short-badge {
    display: flex; align-items: center; gap: 6px;
    background: var(--indigo-lt); border-radius: 6px; padding: 4px 9px;
  }
  .short-badge-icon { width: 18px; height: 18px; background: var(--indigo); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; }
  .short-text { font-size: 12px; font-weight: 600; color: var(--indigo); font-family: monospace; }
  .link-btns { display: flex; align-items: center; gap: 4px; }
  .link-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px; font-size: 12px;
    font-weight: 600; border: none; background: transparent;
    cursor: pointer; font-family: inherit; color: var(--muted); transition: all .18s;
  }
  .link-btn:hover { background: #F4F4F5; color: var(--text); }
  .link-btn.analytics:hover { color: var(--indigo); background: var(--indigo-lt); }
  .link-btn.copy-done { color: var(--green); background: var(--green-lt); }
  .link-btn.icon-only { padding: 5px 7px; }
  .link-btn.icon-only:hover { color: var(--indigo); background: var(--indigo-lt); }

  /* Empty state */
  .empty-state {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 4rem 2rem;
    text-align: center; box-shadow: var(--shadow-sm);
  }
  .empty-icon {
    width: 52px; height: 52px; background: #F4F4F5;
    border-radius: var(--radius); display: flex; align-items: center;
    justify-content: center; margin: 0 auto 1rem; color: var(--hint);
  }
  .empty-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .empty-sub { font-size: 13px; color: var(--muted); }

  /* Footer */
  .dash-footer {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 2.5rem; padding-bottom: 1.5rem;
    font-size: 12px; color: var(--hint);
  }

  /* ── Analytics Drawer ── */
  .drawer-backdrop {
    position: fixed; inset: 0; background: rgba(17,17,17,.25);
    backdrop-filter: blur(4px); z-index: 50;
    opacity: 0; pointer-events: none; transition: opacity .3s;
  }
  .drawer-backdrop.open { opacity: 1; pointer-events: all; }
  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 100%; max-width: 520px;
    background: var(--surface); z-index: 51;
    display: flex; flex-direction: column;
    box-shadow: -8px 0 40px rgba(0,0,0,.12);
    transform: translateX(100%); transition: transform .35s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
  }
  .drawer.open { transform: translateX(0); }
  .drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
    background: var(--surface); position: sticky; top: 0; z-index: 1;
    flex-shrink: 0;
  }
  .drawer-header-left { display: flex; align-items: center; gap: 12px; }
  .drawer-header-icon {
    width: 34px; height: 34px; background: var(--indigo-lt);
    border-radius: var(--radius-sm); display: flex; align-items: center;
    justify-content: center; color: var(--indigo);
  }
  .drawer-title { font-size: 14px; font-weight: 700; }
  .drawer-short { font-size: 12px; color: var(--muted); font-family: monospace; margin-top: 2px; }
  .drawer-close {
    width: 30px; height: 30px; border: none; background: #F4F4F5;
    border-radius: 7px; cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--muted);
    transition: all .18s;
  }
  .drawer-close:hover { background: #EBEBEB; color: var(--text); }
  .drawer-body { flex: 1; overflow-y: auto; padding: 1.5rem; }

  .a-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 1.5rem; }
  .a-stat {
    background: #FAFAFA; border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 1rem 1.1rem;
  }
  .a-stat-icon {
    width: 30px; height: 30px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
  }
  .a-stat-val { font-size: 22px; font-weight: 700; line-height: 1; }
  .a-stat-lbl { font-size: 12px; color: var(--muted); margin-top: 4px; }

  .a-section-title { font-size: 13px; font-weight: 700; margin-bottom: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
  .a-chart-wrap {
    background: #FAFAFA; border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem;
  }

  .a-device-list { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 10px; }
  .a-device-row { display: flex; align-items: center; gap: 10px; }
  .a-device-name { font-size: 13px; color: var(--muted); width: 56px; flex-shrink: 0; }
  .a-device-track { flex: 1; height: 8px; background: #EBEBEB; border-radius: 4px; overflow: hidden; }
  .a-device-fill { height: 100%; border-radius: 4px; transition: width .7s cubic-bezier(.4,0,.2,1); }
  .a-device-pct { font-size: 12px; font-weight: 700; width: 30px; text-align: right; }

  .a-country-list {
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    overflow: hidden; margin-bottom: 1.5rem;
  }
  .a-country-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-bottom: 1px solid var(--border);
    transition: background .15s;
  }
  .a-country-row:last-child { border-bottom: none; }
  .a-country-row:hover { background: #FAFAFA; }
  .a-country-num { font-size: 11px; color: var(--hint); font-family: monospace; width: 14px; }
  .a-country-name { flex: 1; font-size: 13px; font-weight: 500; }
  .a-country-bar-wrap { width: 80px; height: 5px; background: #EBEBEB; border-radius: 3px; overflow: hidden; }
  .a-country-bar { height: 100%; background: var(--indigo-md); border-radius: 3px; }
  .a-country-pct { font-size: 12px; font-weight: 700; width: 28px; text-align: right; }

  /* ── Delete Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(17,17,17,.25);
    backdrop-filter: blur(4px); z-index: 60;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    opacity: 0; pointer-events: none; transition: opacity .2s;
  }
  .modal-backdrop.open { opacity: 1; pointer-events: all; }
  .modal-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-xl); padding: 2rem;
    width: 100%; max-width: 390px;
    box-shadow: var(--shadow-lg);
    transform: scale(.95); transition: transform .2s cubic-bezier(.4,0,.2,1);
  }
  .modal-backdrop.open .modal-card { transform: scale(1); }
  .modal-del-icon {
    width: 48px; height: 48px; background: var(--red-lt);
    border-radius: var(--radius); display: flex; align-items: center;
    justify-content: center; color: var(--red); margin-bottom: 1.1rem;
  }
  .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .modal-desc { font-size: 14px; color: var(--muted); margin-bottom: 1.75rem; line-height: 1.6; }
  .modal-desc code { font-family: monospace; font-size: 13px; color: var(--text); font-weight: 600; }
  .modal-actions { display: flex; gap: 10px; }
  .btn-cancel {
    flex: 1; padding: 11px; border: 1px solid var(--border);
    border-radius: var(--radius-sm); background: transparent;
    font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
    color: var(--text); transition: all .18s;
  }
  .btn-cancel:hover { background: #F4F4F5; }
  .btn-danger {
    flex: 1; padding: 11px; background: var(--red); border: none;
    border-radius: var(--radius-sm); color: #fff; font-size: 14px;
    font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s;
    box-shadow: 0 4px 12px rgba(239,68,68,.28);
  }
  .btn-danger:hover { background: #DC2626; }

  /* Tooltip */
  .custom-tooltip {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 10px 14px;
    box-shadow: var(--shadow);
  }
  .tooltip-label { font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 2px; }
  .tooltip-val { font-size: 18px; font-weight: 700; color: var(--indigo); }
  .tooltip-unit { font-size: 11px; color: var(--hint); }
`;

function injectStyles() {
  if (document.getElementById("shortx-styles")) return;
  const el = document.createElement("style");
  el.id = "shortx-styles";
  el.textContent = CSS;
  document.head.appendChild(el);
}

// ─── Auth Screen ─────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pillLeft = mode === "login" ? "3px" : "calc(50%)";

  const handleSubmit = () => {
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = { name: mode === "signup" ? name : email.split("@")[0], email };
      localStorage.setItem(LS_USER, JSON.stringify(user));
      onAuth(user);
    }, 800);
  };

  return (
    <div className="auth-root">
      <div className="auth-box">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Zap size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="auth-brand-name">SHORTX</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-heading">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="auth-sub">{mode === "login" ? "Sign in to your workspace" : "Start managing links in seconds"}</p>

          <div className="toggle-row">
            <div className="toggle-pill" style={{ left: pillLeft }} />
            {["login", "signup"].map((m) => (
              <button key={m} className={`toggle-btn${mode === m ? " active" : ""}`}
                onClick={() => { setMode(m); setError(""); }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div className="field">
              <label className="field-label">Full Name</label>
              <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
          )}
          <div className="field">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>

          {error && (
            <div className="err-banner">
              <AlertTriangle size={14} color="#DC2626" />
              <span className="err-text">{error}</span>
            </div>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><span className="spinner" />{mode === "login" ? "Signing in…" : "Creating account…"}</>
            ) : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </div>

        <p className="auth-footer">Protected by <strong>SHORTX</strong> · End-to-end encrypted</p>
      </div>
    </div>
  );
}

// ─── Analytics Drawer ─────────────────────────────────────────────────────────

function AnalyticsDrawer({ link, onClose }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (link) requestAnimationFrame(() => setOpen(true));
    else setOpen(false);
  }, [link]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 350);
  };

  if (!link) return null;
  const a = link.analytics;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-val">{payload[0].value.toLocaleString()}</p>
        <p className="tooltip-unit">clicks</p>
      </div>
    );
  };

  const statItems = [
    { label: "Total Clicks", value: a.total.toLocaleString(), icon: MousePointerClick, bg: "#EEF2FF", color: "#4F46E5" },
    { label: "Unique Visitors", value: a.unique.toLocaleString(), icon: Eye, bg: "#F5F3FF", color: "#7C3AED" },
    { label: "Click-through Rate", value: `${a.ctr}%`, icon: TrendingUp, bg: "#ECFDF5", color: "#059669" },
    { label: "Avg. Session Time", value: a.avgTime, icon: Clock, bg: "#FFFBEB", color: "#D97706" },
  ];

  return (
    <>
      <div className={`drawer-backdrop${open ? " open" : ""}`} onClick={handleClose} />
      <div className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-header-left">
            <div className="drawer-header-icon"><BarChart2 size={15} /></div>
            <div>
              <div className="drawer-title">Link Analytics</div>
              <div className="drawer-short">{link.short}</div>
            </div>
          </div>
          <button className="drawer-close" onClick={handleClose}><X size={14} /></button>
        </div>

        <div className="drawer-body">
          <div className="a-stats-grid">
            {statItems.map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className="a-stat">
                <div className="a-stat-icon" style={{ background: bg, color }}>
                  <Icon size={14} />
                </div>
                <div className="a-stat-val">{value}</div>
                <div className="a-stat-lbl">{label}</div>
              </div>
            ))}
          </div>

          <div className="a-section-title">Daily Clicks — 7 days</div>
          <div className="a-chart-wrap">
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={a.clicks} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#4F46E5", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="clicks" stroke="#4F46E5" strokeWidth={2}
                  fill="url(#cg)" dot={false} activeDot={{ r: 4, fill: "#4F46E5", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="a-section-title">Device Breakdown</div>
          <div className="a-device-list">
            {a.devices.map(({ name, pct, color }) => (
              <div key={name} className="a-device-row">
                <span className="a-device-name">{name}</span>
                <div className="a-device-track">
                  <div className="a-device-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="a-device-pct">{pct}%</span>
              </div>
            ))}
          </div>

          <div className="a-section-title">Top Countries</div>
          <div className="a-country-list">
            {a.countries.map(({ name, pct }, i) => (
              <div key={name} className="a-country-row">
                <span className="a-country-num">{i + 1}</span>
                <Globe size={13} color="#A1A1AA" />
                <span className="a-country-name">{name}</span>
                <div className="a-country-bar-wrap">
                  <div className="a-country-bar" style={{ width: `${pct}%` }} />
                </div>
                <span className="a-country-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({ link, onConfirm, onCancel }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (link) requestAnimationFrame(() => setOpen(true));
  }, [link]);

  const handleCancel = () => { setOpen(false); setTimeout(onCancel, 220); };
  const handleConfirm = () => { setOpen(false); setTimeout(() => onConfirm(link.id), 220); };

  if (!link) return null;

  return (
    <div className={`modal-backdrop${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <div className="modal-card">
        <div className="modal-del-icon"><Trash2 size={20} /></div>
        <h3 className="modal-title">Delete this link?</h3>
        <p className="modal-desc">
          <code>{link.short}</code> will be permanently removed.<br />
          All analytics data will be lost and this action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          <button className="btn-danger" onClick={handleConfirm}>Delete Link</button>
        </div>
      </div>
    </div>
  );
}

// ─── Link Card ────────────────────────────────────────────────────────────────

function LinkCard({ link, onCopy, copiedId, onAnalytics, onDelete }) {
  const isCopied = copiedId === link.id;
  const domain = (() => { try { return new URL(link.original).hostname; } catch { return link.original; } })();

  return (
    <div className="link-card">
      <div className="link-top">
        <div className="link-meta">
          <div className="link-title-row">
            <img
              className="link-favicon"
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
              alt=""
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="link-title">{link.title}</span>
          </div>
          <p className="link-orig">{link.original}</p>
        </div>
        <button className="del-icon-btn" onClick={() => onDelete(link)}>
          <Trash2 size={13} />
        </button>
      </div>

      <div className="link-bottom">
        <div className="short-badge">
          <div className="short-badge-icon"><Link2 size={9} /></div>
          <span className="short-text">{link.short}</span>
        </div>
        <div className="link-btns">
          <button className="link-btn analytics" onClick={() => onAnalytics(link)}>
            <BarChart2 size={12} />
            <span>{link.clicks.toLocaleString()}</span>
          </button>
          <button
            className={`link-btn${isCopied ? " copy-done" : ""}`}
            onClick={() => onCopy(link)}
          >
            {isCopied ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy</>}
          </button>
          <a
            href={`https://${link.short}`}
            target="_blank"
            rel="noreferrer"
            className="link-btn icon-only"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ user, onLogout }) {
  const [links, setLinks] = useState(() => {
    try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : DEMO_LINKS; }
    catch { return DEMO_LINKS; }
  });
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [drawerLink, setDrawerLink] = useState(null);
  const [deleteLink, setDeleteLink] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const urlRef = useRef(null);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(links)); }, [links]);

  const filtered = links.filter((l) => {
    const q = search.toLowerCase();
    const match = !q || l.title.toLowerCase().includes(q) || l.short.includes(q) || l.original.toLowerCase().includes(q);
    if (!match) return false;
    if (activeTab === "popular") return l.clicks > 2000;
    if (activeTab === "recent") {
      const d = new Date(l.created);
      return (new Date() - d) / (1000 * 60 * 60 * 24) <= 10;
    }
    return true;
  });

  const handleCreate = () => {
    setCreateError("");
    if (!url) { setCreateError("Please enter a URL."); return; }
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized;
    try { new URL(normalized); } catch { setCreateError("Enter a valid URL."); return; }
    setCreating(true);
    setTimeout(() => {
      const slug = slugify();
      const domain = (() => { try { return new URL(normalized).hostname.replace("www.", ""); } catch { return "link"; } })();
      const newLink = {
        id: Date.now().toString(),
        original: normalized,
        short: `shortx.io/${slug}`,
        title: title.trim() || domain,
        clicks: 0,
        created: new Date().toISOString().split("T")[0],
        analytics: generateAnalytics(),
      };
      setLinks((prev) => [newLink, ...prev]);
      setUrl(""); setTitle(""); setCreating(false); setShowCreate(false);
    }, 700);
  };

  const handleCopy = useCallback((link) => {
    navigator.clipboard.writeText(`https://${link.short}`).catch(() => {});
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleDelete = useCallback((link) => setDeleteLink(link), []);
  const confirmDelete = useCallback((id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setDeleteLink(null);
  }, []);

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const tabs = [
    { id: "all", label: "All Links" },
    { id: "popular", label: "Popular" },
    { id: "recent", label: "Recent" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <Zap size={13} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="nav-brand-name">SHORTX</span>
          </div>
          <nav className="nav-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`nav-tab${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="nav-right">
          <div className="user-chip">
            <div className="user-avatar">{user.name[0].toUpperCase()}</div>
            <span className="user-name">{user.name}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dash-main">
        {/* Stats strip */}
        <div className="stats-strip">
          {[
            { label: "Total Links", value: links.length, icon: Link2, sub: "managed" },
            { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, sub: "all time" },
            { label: "Avg. Clicks", value: links.length ? Math.round(totalClicks / links.length).toLocaleString() : "0", icon: TrendingUp, sub: "per link" },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon"><Icon size={18} /></div>
              <div>
                <p className="stat-val">{value}</p>
                <p className="stat-lbl">{label} · {sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links…"
            />
          </div>
          <button
            className="new-link-btn"
            onClick={() => { setShowCreate((v) => !v); setTimeout(() => urlRef.current?.focus(), 60); }}
          >
            <Plus size={15} strokeWidth={2.5} />
            New Link
          </button>
        </div>

        {/* Create panel */}
        <div className={`create-panel${showCreate ? " open" : ""}`}>
          <h3>Create Short Link</h3>
          <div className="create-row">
            <input
              ref={urlRef}
              className="create-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="https://example.com/your-long-url"
            />
            <input
              className="create-input"
              style={{ maxWidth: 200 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Link title (optional)"
            />
            <button className="create-submit" onClick={handleCreate} disabled={creating}>
              {creating ? "Shortening…" : "Shorten"}
            </button>
          </div>
          {createError && (
            <p className="create-err">
              <AlertTriangle size={12} /> {createError}
            </p>
          )}
        </div>

        {/* Mobile tabs */}
        <div className="mobile-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`mobile-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Links */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Link2 size={22} /></div>
            <p className="empty-title">No links found</p>
            <p className="empty-sub">
              {search ? "Try a different search term." : "Create your first short link above."}
            </p>
          </div>
        ) : (
          <div className="links-grid">
            {filtered.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onCopy={handleCopy}
                copiedId={copiedId}
                onAnalytics={setDrawerLink}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="dash-footer">
          <Shield size={12} />
          <span>All links encrypted and monitored · SHORTX Enterprise</span>
        </div>
      </main>

      <AnalyticsDrawer link={drawerLink} onClose={() => setDrawerLink(null)} />
      <DeleteModal link={deleteLink} onConfirm={confirmDelete} onCancel={() => setDeleteLink(null)} />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem(LS_USER); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  useEffect(() => { injectStyles(); }, []);

  const handleAuth = (u) => setUser(u);
  const handleLogout = () => { localStorage.removeItem(LS_USER); setUser(null); };

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <AuthScreen onAuth={handleAuth} />;
}
