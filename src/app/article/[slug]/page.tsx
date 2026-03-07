import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsImage from '@/components/NewsImage';
import { supabaseServer } from '@/lib/supabase';
import { News } from '@/types/news';
import { getCategoryLabel, formatTimeAgo, safeKeywords } from '@/lib/utils';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import NewsTickerWrapper from '@/components/NewsTickerWrapper';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import { Calendar } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

export const dynamic = 'force-dynamic';


function getCategoryPath(category: string): string {
  const paths: Record<string, string> = {
    politics: '/politics', economy: '/economy', local: '/local', sports: '/sports',
  };
  return paths[category] || '/';
}

async function getArticle(slug: string): Promise<News | null> {
  try {
    // Try by slug first
    const { data: bySlug, error: slugError } = await supabaseServer
      .from('news')
      .select('*, editors(name, position, bio)')
      .eq('slug', decodeURIComponent(slug))
      .maybeSingle();

    if (slugError) {
      console.error('Error fetching by slug:', slugError.message);
    }

    if (bySlug) return bySlug;

    // Fallback: try by ID
    const { data: byId, error: idError } = await supabaseServer
      .from('news')
      .select('*, editors(name, position, bio)')
      .eq('id', slug)
      .maybeSingle();

    if (idError) {
      console.error('Error fetching by id:', idError.message);
    }

    return byId || null;
  } catch (e) {
    console.error('getArticle crashed:', e);
    return null;
  }
}

async function getRelatedNews(category: string, excludeId: string): Promise<News[]> {
  try {
    const { data } = await supabaseServer
      .from('news')
      .select('*, editors(name)')
      .eq('category', category)
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(4);
    return data || [];
  } catch (e) {
    console.error('getRelatedNews failed:', e);
    return [];
  }
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
    keywords: safeKeywords(article.keywords).join(', ') || undefined,
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description: article.meta_description || article.excerpt || article.title,
      images: article.image_url ? [{ url: article.image_url }] : [],
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      section: getCategoryLabel(article.category),
      tags: safeKeywords(article.keywords),
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

  let sanitizedContent = '';
  try {
    sanitizedContent = sanitizeHtml(article.content || '', {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'img', 'style'],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'class', 'style'],
        '*': ['class', 'style'],
      },
    });
  } catch (e) {
    console.error('sanitizeHtml failed:', e);
    sanitizedContent = article.content || '';
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.meta_description || article.excerpt || article.title,
    "image": article.image_url ? [article.image_url] : [`${SITE_URL}/icon.png`],
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
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.png` },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "articleSection": getCategoryLabel(article.category),
    "keywords": safeKeywords(article.keywords).join(', ') || undefined,
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

        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <header>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-8 leading-tight tracking-wide">
                {article.title}
              </h1>

              {/* Meta & Share */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 md:mb-8 pb-4 md:pb-6 border-b-2 border-gold">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {article.editors && (
                    <span className="font-semibold text-foreground">✍️ {article.editors.name}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gold" aria-hidden="true" />
                    <time dateTime={article.created_at}>{formatTimeAgo(article.created_at)}</time>
                  </div>
                </div>
                <ShareButtons url={articleUrl} title={article.title} />
              </div>
            </header>

            {/* Article Image */}
            <figure className="mb-6 md:mb-8 rounded-lg overflow-hidden relative w-full h-[250px] sm:h-[300px] md:h-[400px]">
              <NewsImage
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                category={getCategoryLabel(article.category)}
              />
            </figure>

            {/* Author & Date */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              {article.editors?.name && (
                <span className="font-semibold text-foreground">✍️ {article.editors.name}</span>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gold" />
                <time dateTime={article.created_at}>{formatTimeAgo(article.created_at)}</time>
              </div>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <aside className="mb-6 md:mb-8 p-5 md:p-8 bg-secondary border-r-4 border-gold rounded-lg" role="complementary">
                <p className="text-lg md:text-2xl font-semibold leading-loose tracking-wide">{article.excerpt}</p>
              </aside>
            )}

            {/* Key Points */}
            {Array.isArray(article.key_points) && article.key_points.length > 0 && (
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
              className="prose prose-2xl max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Editor Card */}
            {article.editors && (
              <aside className="mt-12 p-6 bg-secondary border border-border rounded-lg" role="complementary" aria-label="معلومات المحرر">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold shrink-0">
                    {article.editors.name?.charAt(0) || '✍'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{article.editors.name || 'محرر'}</h3>
                    <p className="text-sm text-gold font-medium mb-2">{article.editors.position || 'محرر'}</p>
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
                          <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden relative">
                            <NewsImage
                              src={news.image_url}
                              alt={news.title}
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold group-hover:text-gold transition-colors line-clamp-2">
                              {news.title}
                            </h3>
                            <time className="text-sm text-muted-foreground mt-2 block" dateTime={news.created_at}>
                              {formatTimeAgo(news.created_at)}
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
