import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { News } from '@/types/news';
import { getCategoryLabel } from '@/lib/utils';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import NewsTickerWrapper from '@/components/NewsTickerWrapper';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import { Calendar } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000 / 60);
  if (diff < 60) return `منذ ${diff} دقيقة`;
  if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
  return `منذ ${Math.floor(diff / 1440)} يوم`;
}

function getCategoryPath(category: string): string {
  const paths: Record<string, string> = {
    politics: '/politics', economy: '/economy', local: '/local', sports: '/sports',
  };
  return paths[category] || '/';
}

async function getArticle(slug: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*, editors(name, position, bio)')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (error || !data) return null;
  return data;
}

async function getRelatedNews(category: string, excludeId: string): Promise<News[]> {
  const { data } = await supabase
    .from('news')
    .select('*, editors(name)')
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(4);
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: 'المقال غير موجود' };
  }

  const articleUrl = `${SITE_URL}/article/${article.slug || article.id}`;

  return {
    title: article.title,
    description: article.meta_description || article.excerpt || article.title,
    keywords: article.keywords?.join(', '),
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description: article.meta_description || article.excerpt || article.title,
      images: article.image_url ? [{ url: article.image_url }] : [],
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      section: getCategoryLabel(article.category),
      tags: article.keywords || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description || article.excerpt || article.title,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedNews = await getRelatedNews(article.category, article.id);
  const articleUrl = `${SITE_URL}/article/${article.slug || article.id}`;

  const sanitizedContent = sanitizeHtml(article.content, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'img', 'style'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'class', 'style'],
      '*': ['class', 'style'],
    },
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.meta_description || article.excerpt || article.title,
    "image": article.image_url ? [article.image_url] : [`${SITE_URL}/nafud-logo.png`],
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "author": article.editors ? {
      "@type": "Person",
      "name": article.editors.name,
    } : {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/nafud-logo.png` },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "articleSection": getCategoryLabel(article.category),
    "keywords": article.keywords?.join(', '),
    "inLanguage": "ar",
    "isAccessibleForFree": true,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Navbar />
      <NewsTickerWrapper />

      <article className="flex-1">
        {/* Category Header Bar */}
        <header className="bg-secondary border-b-2 border-gold py-4">
          <div className="container mx-auto px-4">
            <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-md font-bold">
              {getCategoryLabel(article.category)}
            </span>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <header>
              <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-wide">
                {article.title}
              </h1>

              {/* Meta & Share */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-gold">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {article.editors && (
                    <span className="font-semibold text-foreground">✍️ {article.editors.name}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gold" aria-hidden="true" />
                    <time dateTime={article.created_at}>{getTimeAgo(article.created_at)}</time>
                  </div>
                </div>
                <ShareButtons url={articleUrl} title={article.title} />
              </div>
            </header>

            {/* Article Image */}
            {article.image_url && (
              <figure className="mb-8 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={article.image_url}
                  alt={article.title}
                  width={896}
                  height={504}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized={article.image_url.includes('twimg.com')}
                />
              </figure>
            )}

            {/* Excerpt */}
            {article.excerpt && (
              <aside className="mb-8 p-8 bg-secondary border-r-4 border-gold rounded-lg" role="complementary">
                <p className="text-2xl font-semibold leading-loose tracking-wide">{article.excerpt}</p>
              </aside>
            )}

            {/* Key Points */}
            {article.key_points && article.key_points.length > 0 && (
              <aside className="mb-8 border-t-4 border-gold bg-secondary/50 rounded-lg p-6" role="complementary" aria-label="النقاط الرئيسية">
                <h2 className="text-xl font-bold mb-4 text-foreground">النقاط الرئيسية</h2>
                <ul className="space-y-3 list-disc list-inside pr-2">
                  {article.key_points.map((point: string, index: number) => (
                    <li key={index} className="text-lg leading-relaxed text-foreground">{point}</li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Article Content */}
            <section
              className="prose prose-2xl max-w-none 
                prose-headings:text-foreground prose-headings:mb-4 prose-headings:mt-6 prose-headings:font-bold
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl 
                prose-p:text-foreground prose-p:leading-[2] prose-p:text-xl prose-p:mb-4 prose-p:text-justify 
                prose-strong:text-foreground prose-strong:font-bold
                prose-em:italic prose-em:text-foreground
                prose-a:text-gold hover:prose-a:text-gold/80 prose-a:no-underline
                prose-li:text-foreground prose-li:leading-[2] prose-li:text-xl
                prose-ul:mb-4 prose-ol:mb-4
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                prose-blockquote:border-gold prose-blockquote:bg-secondary/30 prose-blockquote:rounded-lg prose-blockquote:py-2
                [&_*]:text-right"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Editor Card */}
            {article.editors && (
              <aside className="mt-12 p-6 bg-secondary border border-border rounded-lg" role="complementary" aria-label="معلومات المحرر">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold shrink-0">
                    {article.editors.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{article.editors.name}</h3>
                    <p className="text-sm text-gold font-medium mb-2">{article.editors.position}</p>
                    <p className="text-sm text-muted-foreground">{article.editors.bio || 'تحرير وإشراف على هذا المقال'}</p>
                  </div>
                </div>
              </aside>
            )}

            {/* Related Articles */}
            {relatedNews.length > 0 && (
              <aside className="mt-16 pt-8 border-t-2 border-gold" role="complementary" aria-label="أخبار ذات صلة">
                <h2 className="text-2xl font-bold mb-6">أخبار ذات صلة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedNews.map((news) => (
                    <article key={news.id}>
                      <a href={`/article/${news.slug || news.id}`} className="group">
                        <div className="flex gap-4 p-4 border border-border rounded-lg hover:border-gold transition-all">
                          {news.image_url && (
                            <Image
                              src={news.image_url}
                              alt={news.title}
                              width={96}
                              height={96}
                              className="w-24 h-24 object-cover rounded-md"
                              unoptimized={news.image_url.includes('twimg.com')}
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold group-hover:text-gold transition-colors line-clamp-2">
                              {news.title}
                            </h3>
                            <time className="text-sm text-muted-foreground mt-2 block" dateTime={news.created_at}>
                              {getTimeAgo(news.created_at)}
                            </time>
                          </div>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
