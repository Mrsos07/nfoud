'use client';

import dynamic from 'next/dynamic';

const NewsTicker = dynamic(() => import('@/components/NewsTicker'), {
  ssr: false,
  loading: () => (
    <div dir="rtl" className="bg-primary border-y-2 border-gold py-3 overflow-hidden select-none">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="bg-accent text-accent-foreground px-4 py-1 rounded-md font-bold whitespace-nowrap text-sm">
            عاجل
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="h-5 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  ),
});

export default function NewsTickerWrapper() {
  return <NewsTicker />;
}
