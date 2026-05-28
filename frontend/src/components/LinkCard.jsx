import { memo, useRef, useState } from 'react';
import { Copy, Check, BarChart2, Trash2, Calendar, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from './ui/Button';
import Card from './ui/Card';

function LinkCard({ link, onOpenAnalytics, onDeleteClick }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  
  const clicksCount = typeof link.clicks === 'number' ? link.clicks : (link.visits?.length || 0);
  const targetUrl = link.shortUrl || '';
  const safeFileName = targetUrl ? `${targetUrl.split('/').pop()}-qr.png` : 'short-link-qr.png';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy operation failed:', err);
    }
  };

  return (
    <Card className="p-6 flex flex-col justify-between min-h-full">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Short link</span>
          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0057FF]">
            {clicksCount.toLocaleString()} Clicks
          </span>
        </div>

        {/* Destination & Title */}
        <h4 className="text-[15px] font-bold text-[#111111] line-clamp-1 mb-1 hover:text-[#0057FF] cursor-pointer" title={link.title}>
          {link.title}
        </h4>
        
        <p className="text-[11px] text-[#666666] truncate pr-4" title={link.longUrl}>
          {link.longUrl}
        </p>

        <div className="mt-3.5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[13px] font-bold text-[#0057FF] hover:underline"
          >
            {targetUrl}
          </a>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (!qrRef.current) return;
              const canvas = qrRef.current.querySelector('canvas');
              if (!canvas) return;
              const url = canvas.toDataURL('image/png');
              const linkEl = document.createElement('a');
              linkEl.href = url;
              linkEl.download = safeFileName;
              linkEl.click();
            }}
            className="justify-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR
          </Button>
        </div>

        <div ref={qrRef} className="mt-4 rounded-xl bg-[#F9FAFB] p-3 inline-block">
          <QRCodeCanvas
            value={targetUrl}
            size={120}
            level="M"
            includeMargin={true}
            className="h-[120px] w-[120px]"
          />
        </div>

        {/* Creation stamp & metadata */}
        <div className="mt-4 flex items-center space-x-3.5 text-[10px] text-gray-400 font-semibold border-t border-dashed border-gray-100 pt-3.5">
          <span className="flex items-center">
            <Calendar className="mr-1 h-3.5 w-3.5 shrink-0" />
            {link.createdAt 
              ? new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Just Now'
            }
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-[#EAEAEA] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={copied ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
          </Button>

          <Button variant="secondary" size="sm" onClick={() => onOpenAnalytics(link)} className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Insights
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={() => onDeleteClick(link)} className="gap-2 text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default memo(LinkCard);