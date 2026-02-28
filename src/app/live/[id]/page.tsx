import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LiveEvent } from '@/types/news';
import { formatDate, getCategoryLabel } from '@/lib/utils';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Radio, Clock } from 'lucide-react';

export const revalidate = 30;

interface LiveEventUpdate {
  id: string;
  content: string;
  created_at: string;
  update_type: string;
  source_news_id: string | null;
}

async function getLiveEvent(id: string): Promise<LiveEvent | null> {
  const { data, error } = await supabase
    .from('live_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getLiveEventUpdates(eventId: string): Promise<LiveEventUpdate[]> {
  const { data, error } = await supabase
    .from('live_event_updates')
    .select('*')
    .eq('live_event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching live event updates:', error);
    return [];
  }

  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getLiveEvent(id);

  if (!event) {
    return {
      title: 'الحدث غير موجود',
    };
  }

  return {
    title: `${event.title} - تغطية مباشرة`,
    description: event.summary || event.title,
    keywords: `حدث مباشر، ${getCategoryLabel(event.category)}، تغطية حية`,
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/live/${event.id}`,
      title: event.title,
      description: event.summary || event.title,
      images: event.main_image_url ? [{ url: event.main_image_url }] : [],
    },
  };
}

export default async function LiveEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, updates] = await Promise.all([
    getLiveEvent(id),
    getLiveEventUpdates(id)
  ]);

  if (!event) {
    notFound();
  }

  const isActive = event.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {event.main_image_url && (
            <div className="relative w-full h-96">
              <Image
                src={event.main_image_url}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              {isActive && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <span>مباشر</span>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            <div className="mb-6">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold">
                {getCategoryLabel(event.category)}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {event.title}
            </h1>

            {event.summary && (
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {event.summary}
              </p>
            )}

            <div className="flex items-center gap-4 text-gray-600 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>آخر تحديث: {formatDate(event.updated_at)}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{updates.length} تحديث</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">التحديثات المباشرة</h2>
              
              {updates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">لا توجد تحديثات حتى الآن</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {updates.map((update, index) => (
                    <div 
                      key={update.id}
                      className={`border-r-4 pr-6 py-4 ${
                        index === 0 && isActive
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-gray-50'
                      } rounded-lg`}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(update.created_at)}</span>
                        {index === 0 && isActive && (
                          <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                            جديد
                          </span>
                        )}
                      </div>
                      <div 
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: update.content }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isActive && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-600">انتهت التغطية المباشرة لهذا الحدث</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
