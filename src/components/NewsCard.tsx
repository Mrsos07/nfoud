import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types/news';
import { getCategoryLabel } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft } from 'lucide-react';

interface NewsCardProps {
  news: News;
}

function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000 / 60);
  if (diff < 60) return `منذ ${diff} دقيقة`;
  if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
  return `منذ ${Math.floor(diff / 1440)} يوم`;
}

export default function NewsCard({ news }: NewsCardProps) {
  const articleUrl = `/article/${news.slug || news.id}`;
  const categoryLabel = getCategoryLabel(news.category);

  return (
    <Card className="overflow-hidden shadow-hover border border-border/50 group bg-card h-full flex flex-col">
      <Link href={articleUrl} aria-label={`اقرأ المزيد عن: ${news.title}`}>
        <figure className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {news.image_url ? (
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={news.image_url.includes('twimg.com')}
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
          <figcaption className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
            {categoryLabel}
          </figcaption>
        </figure>
      </Link>
      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold leading-relaxed">
          <Link href={articleUrl} className="hover-gold transition-colors line-clamp-2 block">
            {news.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        {news.excerpt && (
          <p className="text-muted-foreground line-clamp-3 leading-relaxed text-base">{news.excerpt}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex flex-col gap-1">
          {news.editors && (
            <span className="text-sm font-semibold text-foreground">✍️ {news.editors.name}</span>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} className="text-gold" aria-hidden="true" />
            <time className="font-medium">{getTimeAgo(news.created_at)}</time>
          </div>
        </div>
        <Link href={articleUrl}>
          <Button variant="ghost" size="sm" className="hover-gold group/btn font-medium" aria-label={`اقرأ المقال: ${news.title}`}>
            اقرأ المزيد
            <ChevronLeft size={16} className="mr-1 transition-transform group-hover/btn:-translate-x-1" aria-hidden="true" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
