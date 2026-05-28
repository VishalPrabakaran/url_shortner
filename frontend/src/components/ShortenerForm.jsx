import { useState } from 'react';
import { Link as LinkIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

export default function ShortenerForm({ onLinkCreated }) {
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
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
        title: title || 'Untitled Link',
        alias: alias?.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });

      onLinkCreated(newLink);
      setLongUrl('');
      setTitle('');
      setAlias('');
      setExpiresAt('');
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
      <Card className="p-6 sm:p-8">
        {error && (
          <div className="mb-4 flex items-start space-x-2.5 rounded-md border border-red-200 bg-red-50 p-3.5 text-red-800">
            <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
            <span className="text-[12px] font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start space-x-2.5 rounded-md border border-green-200 bg-green-50 p-3.5 text-green-800">
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-green-600" />
            <span className="text-[12px] font-medium leading-relaxed">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Input
              type="url"
              label="Destination URL"
              icon={<LinkIcon className="h-4 w-4" />}
              required
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/path"
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Generating…' : 'Generate Short Link'}
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Input
              label="Link Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Portfolio Website"
            />
            <Input
              label="Custom Alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="custom-alias"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Input
              label="Expiration Date (optional)"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">Notes</span>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Add a custom alias for easy sharing. If an expiration date is set, the short link will stop redirecting after that date.
              </p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
