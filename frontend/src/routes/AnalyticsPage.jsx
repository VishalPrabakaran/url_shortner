import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ApiClient } from '../services/api';
import { BarChart2, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [globalMetrics, setGlobalMetrics] = useState({ totalClicks: 0, linksCount: 0 });
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading handler state

  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        setLoading(true);
        const linkData = await ApiClient.getLinks();
        const safeLinks = linkData || [];
        setLinks(safeLinks);
        
        const clicks = safeLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
        setGlobalMetrics({
          totalClicks: clicks,
          linksCount: safeLinks.length
        });
      } catch (err) {
        console.error("Failed collection aggregate metrics", err);
      } finally {
        setLoading(false);
      }
    };
    loadGlobalData();
  }, []);

  // Filter links dynamically based on Navbar search input
  const filteredLinks = links.filter((link) => {
    const query = searchTerm.toLowerCase();
    return (
      link.title?.toLowerCase().includes(query) ||
      link.shortUrl?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#F9F9FA]">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center space-x-2 text-[#0057FF] mb-4">
          <BarChart2 className="h-5 w-5 stroke-[2.5]" />
          <span className="text-xs font-bold uppercase tracking-wider">Global System Telemetry</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight mb-8">
          Analytics Overview
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#0057FF] mb-2" />
            <p className="text-sm font-medium">Aggregating platform datasets...</p>
          </div>
        ) : (
          <>
            {/* Global Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 shadow-xs">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accumulated Redirection Volume</p>
                <p className="text-4xl font-extrabold text-[#111111] mt-2">{globalMetrics.totalClicks.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 shadow-xs">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Managed Directories</p>
                <p className="text-4xl font-extrabold text-[#111111] mt-2">{globalMetrics.linksCount}</p>
              </div>
            </div>

            {/* Breakdown Row Inventory */}
            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-[#EAEAEA] bg-[#F9F9FA]">
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Performance Distribution Hierarchy</h3>
              </div>
              
              <div className="divide-y divide-[#EAEAEA]">
                {filteredLinks.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-400">No links discovered.</div>
                ) : (
                  filteredLinks.map((link) => (
                    <div key={link.id || Math.random()} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <h4 className="text-base font-bold text-[#111111]">{link.title || 'Untitled Core Link'}</h4>
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{link.shortUrl}</p>
                      </div>
                      <div className="flex items-center space-x-6 shrink-0">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-gray-400 block">Total Counter</span>
                          <span className="text-base font-extrabold text-[#111111]">{link.clicks || 0} clicks</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}