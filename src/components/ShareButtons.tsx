'use client';

import { useState, useCallback } from 'react';
import { Share2, Facebook, Copy, Check } from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [showShareBox, setShowShareBox] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('تم نسخ الرابط بنجاح');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('فشل نسخ الرابط');
    }
  }, [url]);

  const handleShareFacebook = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }, [url]);

  const handleShareTwitter = useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  }, [url, title]);

  return (
    <div className="relative flex items-center gap-3">
      <span className="text-sm font-medium">شارك:</span>
      <Button variant="ghost" size="sm" className="hover:text-gold" aria-label="مشاركة على فيسبوك" onClick={handleShareFacebook}>
        <Facebook size={20} />
      </Button>
      <Button variant="ghost" size="sm" className="hover:text-gold" aria-label="مشاركة على تويتر" onClick={handleShareTwitter}>
        <RiTwitterXFill size={20} />
      </Button>
      <Button variant="ghost" size="sm" className="hover:text-gold" aria-label="نسخ الرابط" onClick={() => setShowShareBox(!showShareBox)}>
        <Share2 size={20} />
      </Button>
      {showShareBox && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-secondary border border-border rounded-lg shadow-lg z-10 min-w-[300px]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
              dir="ltr"
            />
            <Button size="sm" variant="outline" onClick={handleCopyLink} className="shrink-0">
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
