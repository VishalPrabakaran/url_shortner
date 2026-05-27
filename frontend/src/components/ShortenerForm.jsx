import { useState } from 'react';
import { ChevronDown, ChevronUp, Link, Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../services/api';

export default function ShortenerForm({ onLinkCreated }) {
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  // Accordion Toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Loading, Errors & Success states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Pre-flight Client Validation
    if (!longUrl) {
      setError('Please provide a destination URL.');
      return;
    }

    // Protocol Scheme Verification
    const protocolRegex = /^(https?:\/\/)/i;
    if (!protocolRegex.test(longUrl)) {
      setError('Invalid protocol. The URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      const newLink = await ApiClient.createLink({ longUrl, alias, expiresAt });
      
      // Update parent list
      onLinkCreated(newLink);
      
      // Clear inputs
      setLongUrl('');
      setAlias('');
      setExpiresAt('');
      setShowAdvanced(false);
      
      setSuccessMsg(`Successfully generated! Alias active: "${newLink.alias}"`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(err.message || 'An error occurred during link generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 sm:p-8 shadow-sm">
        
        {/* Error Notification banner */}
        {error && (
          <div className="mb-4 flex items-start space-x-2.5 border border-red-200 bg-red-50 p-3.5 text-red-800 rounded-md">
            <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
            <span className="text-[12px] font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Notification banner */}
        {successMsg && (
          <div className="mb-4 flex items-start space-x-2.5 border border-green-200 bg-green-50 p-3.5 text-green-800 rounded-md">
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-green-600" />
            <span className="text-[12px] font-medium leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Link className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter long destination URL (e.g. https://example.com/pages/etc)"
                className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-2.5 pl-9 pr-3 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-[#0057FF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#0046CC] disabled:opacity-75 focus:outline-none flex items-center justify-center min-w-[160px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                <span>Generate Short Link</span>
              )}
            </button>
          </div>

          {/* Advanced Accordion trigger */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#111111] transition-colors focus:outline-none"
            >
              <span>Advanced Custom Options</span>
              {showAdvanced ? (
                <ChevronUp className="h-3.5 w-3.5 stroke-[2.5]" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showAdvanced ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-dashed border-[#EAEAEA] pt-4">
              
              {/* Alias input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Custom Alias (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-gray-400 font-bold select-none">
                    shrt.x/
                  </div>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="my-cool-tag"
                    className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-2 pl-[54px] pr-3 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Expiration date input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Expiration Date (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={expiresAt}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-2 pl-9 pr-3 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
