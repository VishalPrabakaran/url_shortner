import { useState, useEffect } from 'react';
import { X, Calendar, BarChart2, Globe, Clock, Compass, ArrowRight } from 'lucide-react';
import { ApiClient } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function AnalyticsDrawer({ isOpen, onClose, link }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !link?.id) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await ApiClient.getAnalytics(link.id);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Unable to load analytics metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isOpen, link?.id]);

  if (!isOpen) return null;

  // Format dynamic visitor logs or timestamp
  const formatTime = (isoString) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const lastVisited = analytics?.visitors?.length > 0 
    ? formatTime(analytics.visitors[0].timestamp)
    : 'No visits registered';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#111111]/30 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer container panel */}
        <div className="w-screen max-w-xl bg-white border-l border-[#EAEAEA] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between bg-[#F9F9FA]">
            <div>
              <div className="flex items-center space-x-1.5 text-[#0057FF]">
                <BarChart2 className="h-4.5 w-4.5 stroke-[2.5]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Link Performance insights</span>
              </div>
              <h2 className="text-base font-extrabold text-[#111111] line-clamp-1 mt-1" title={link?.title}>
                {link?.title}
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#111111] transition-all focus:outline-none"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              // Shimmer Loading States
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#F9F9FA] border border-[#EAEAEA] rounded p-4 space-y-2">
                      <div className="h-3 w-16 rounded shimmer-loader"></div>
                      <div className="h-6 w-24 rounded shimmer-loader mt-1.5"></div>
                    </div>
                  ))}
                </div>
                <div className="border border-[#EAEAEA] rounded-lg p-4 space-y-3">
                  <div className="h-4 w-32 rounded shimmer-loader"></div>
                  <div className="h-40 w-full rounded shimmer-loader mt-2"></div>
                </div>
                <div className="border border-[#EAEAEA] rounded-lg p-4 space-y-3">
                  <div className="h-4 w-40 rounded shimmer-loader"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-6 w-full rounded shimmer-loader"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-sm font-semibold text-red-600">{error}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border border-[#EAEAEA] rounded-md hover:bg-gray-50"
                >
                  Close Analytics
                </button>
              </div>
            ) : (
              <>
                {/* Micro Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Total Clicks */}
                  <div className="bg-[#F9F9FA] border border-[#EAEAEA] rounded p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-[#0057FF]" />
                      Total Clicks
                    </span>
                    <span className="text-2xl font-extrabold text-[#111111] tracking-tight mt-3 leading-none">
                      {link?.clicks?.toLocaleString() || '0'}
                    </span>
                  </div>

                  {/* Last Visited */}
                  <div className="bg-[#F9F9FA] border border-[#EAEAEA] rounded p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-pink-500" />
                      Last Visited
                    </span>
                    <span className="text-[12px] font-bold text-[#111111] mt-3 leading-tight truncate" title={lastVisited}>
                      {lastVisited}
                    </span>
                  </div>

                  {/* Top Referrer */}
                  <div className="bg-[#F9F9FA] border border-[#EAEAEA] rounded p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      <Compass className="h-3.5 w-3.5 mr-1 text-teal-500" />
                      Top Referrer
                    </span>
                    <span className="text-[13px] font-extrabold text-[#111111] mt-3 leading-none uppercase tracking-wider">
                      {analytics?.topReferrer || 'Direct'}
                    </span>
                  </div>

                </div>

                {/* Click Trend Graph Container */}
                <div className="border border-[#EAEAEA] rounded-lg p-5 bg-white">
                  <div className="flex items-center justify-between mb-4 border-b border-[#F9F9FA] pb-2.5">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Traffic Daily Volume (7d)</h3>
                    <span className="text-[10px] text-gray-400 font-semibold">Updated Real-Time</span>
                  </div>
                  
                  {analytics?.dailyClicks && analytics.dailyClicks.length > 0 ? (
                    <div className="h-44 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={analytics.dailyClicks}
                          margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0057FF" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#0057FF" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            stroke="#888888" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#888888" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: '#111111', 
                              border: 'none', 
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="clicks" 
                            stroke="#0057FF" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorClicks)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-44 flex items-center justify-center text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded">
                      Insufficient traffic metrics to display graph.
                    </div>
                  )}
                </div>

                {/* Visitor Metrics Grid / Table */}
                <div className="border border-[#EAEAEA] rounded-lg overflow-hidden bg-white">
                  <div className="border-b border-[#EAEAEA] bg-[#F9F9FA] px-4 py-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Latest Visitor Logs</h3>
                    <span className="text-[9px] font-bold text-[#0057FF] uppercase bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                      Limit 10 logs
                    </span>
                  </div>

                  {analytics?.visitors && analytics.visitors.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#EAEAEA] text-left text-[12px]">
                        <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-2.5">Timestamp</th>
                            <th className="px-4 py-2.5">Browser</th>
                            <th className="px-4 py-2.5">OS</th>
                            <th className="px-4 py-2.5">Country</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAEAEA] bg-white">
                          {analytics.visitors.slice(0, 10).map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                              <td className="whitespace-nowrap px-4 py-2 text-gray-500 font-medium">
                                {formatTime(v.timestamp)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-[#111111] font-semibold">
                                {v.browser}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2">
                                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#111111]">
                                  {v.os}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-2">
                                <span className="inline-flex items-center space-x-1 font-extrabold text-[#666666]">
                                  <Globe className="h-3 w-3 text-gray-400 shrink-0" />
                                  <span>{v.country}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[#666666]">
                      No visits recorded yet. Visit the short link to populate logs.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t border-[#EAEAEA] px-6 py-4 bg-gray-50 flex items-center justify-between">
            <span className="text-[10.5px] text-[#666666] leading-relaxed max-w-[280px]">
              Copy the Short Link to register mock visits in your browser window.
            </span>
            <a 
              href={link?.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                await ApiClient.recordMockClick(link?.id);
                // Trigger dynamic reload of drawer stats by re-fetching
                if (link?.id) {
                  const data = await ApiClient.getAnalytics(link.id);
                  setAnalytics(data);
                }
              }}
              className="flex items-center space-x-1 text-xs font-bold text-[#0057FF] hover:underline"
            >
              <span>Test Visit Link</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
