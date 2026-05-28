import { useState } from 'react';
import { Link, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../services/api';

export default function ShortenerForm({ onLinkCreated }) {
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  
  // Loading, Errors & Success states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!longUrl) {
      setError('Please provide a destination URL.');
      return;
    }

    const protocolRegex = /^(https?:\/\/)/i;
    if (!protocolRegex.test(longUrl)) {
      setError('Invalid protocol. The URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      const newLink = await ApiClient.createLink({
        longUrl,
        title: title || 'Untitled Link'
      });

      onLinkCreated(newLink);
      setLongUrl('');
      setTitle('');
      setSuccessMsg(`Successfully generated! Short URL: "${newLink.shortUrl}"`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(err.message || 'An error occurred during link generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 sm:p-8 shadow-sm">

        {error && (
          <div className="mb-4 flex items-start space-x-2.5 border border-red-200 bg-red-50 p-3.5 text-red-800 rounded-md">
            <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
            <span className="text-[12px] font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start space-x-2.5 border border-green-200 bg-green-50 p-3.5 text-green-800 rounded-md">
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-green-600" />
            <span className="text-[12px] font-medium leading-relaxed">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Link className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter long destination URL (e.g. https://example.com/pages/etc)"
                className="w-full rounded-md border border-[#E0E0E0] bg-[#FAFAFA] py-2.5 pl-9 pr-3 text-[13px] text-[#1F1F1F] placeholder-gray-500 transition-all duration-200 focus:border-[#0057FF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-[#0057FF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#0046CC] disabled:opacity-60 focus:outline-none flex items-center justify-center"
            >
              {loading ? 'Generating...' : 'Generate Short Link'}
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1F1F1F] mb-1">
              Link Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Portfolio Website"
              className="w-full rounded-md border border-[#E0E0E0] bg-[#FAFAFA] py-2 px-3 text-[13px] text-[#1F1F1F] placeholder-gray-500 transition-all duration-200 focus:border-[#0057FF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
            />
            <p className="mt-2 text-[10px] text-[#6B7280]">
              Title helps identify your link. If left blank, it will be saved as “Untitled Link”.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
