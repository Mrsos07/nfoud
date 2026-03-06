const MIN_WORD_COUNT = 400;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface SEOData {
  title: string;
  excerpt: string;
  meta_description: string;
  keywords: string[];
  key_points: string[];
}

/**
 * Count Arabic/mixed words in text (strips HTML tags first)
 */
export function countWords(text: string): number {
  const stripped = text.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ');
  const words = stripped.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Validate that article content meets minimum word count
 */
export function validateWordCount(content: string): { valid: boolean; wordCount: number } {
  const wordCount = countWords(content);
  return { valid: wordCount >= MIN_WORD_COUNT, wordCount };
}

/**
 * Use OpenAI to optimize article metadata for SEO (using fetch directly)
 */
export async function optimizeSEO(
  title: string,
  content: string,
  category: string,
): Promise<SEOData> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const strippedContent = content.replace(/<[^>]*>/g, '').trim();

  const prompt = `أنت خبير SEO متخصص في المحتوى الإخباري العربي. قم بتحليل المقال التالي وأنتج بيانات SEO محسّنة.

**عنوان المقال:** ${title}
**التصنيف:** ${category}
**محتوى المقال:**
${strippedContent.substring(0, 3000)}

أنتج JSON فقط بدون أي نص إضافي بالتنسيق التالي:
{
  "title": "عنوان محسّن للسيو (60-70 حرف، يحتوي الكلمة المفتاحية الرئيسية، جذاب للنقر)",
  "excerpt": "ملخص جذاب للمقال (150-200 حرف، يشجع القراءة)",
  "meta_description": "وصف ميتا محسّن (150-160 حرف، يحتوي الكلمات المفتاحية الرئيسية)",
  "keywords": ["كلمة مفتاحية 1", "كلمة مفتاحية 2", "...حتى 8 كلمات مفتاحية ذات صلة"],
  "key_points": ["النقطة الرئيسية 1", "النقطة الرئيسية 2", "...حتى 5 نقاط رئيسية"]
}

تعليمات مهمة:
- اكتب بالعربية الفصحى السليمة
- العنوان يجب أن يكون جذاباً وواضحاً ويحتوي الكلمة المفتاحية الأهم
- الكلمات المفتاحية يجب أن تكون ذات صلة بالمحتوى وشائعة البحث
- النقاط الرئيسية يجب أن تلخص أهم المعلومات في المقال
- لا تضف معلومات غير موجودة في المقال الأصلي`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير SEO للمحتوى الإخباري العربي. أجب بـ JSON فقط بدون markdown أو أي نص إضافي.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errBody}`);
    }

    const result = await response.json();
    const raw = result.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error('Empty AI response');
    }

    const parsed = JSON.parse(raw) as SEOData;

    // Validate and sanitize the response
    return {
      title: typeof parsed.title === 'string' && parsed.title.length > 10
        ? parsed.title.substring(0, 120)
        : title,
      excerpt: typeof parsed.excerpt === 'string' && parsed.excerpt.length > 20
        ? parsed.excerpt.substring(0, 300)
        : '',
      meta_description: typeof parsed.meta_description === 'string' && parsed.meta_description.length > 20
        ? parsed.meta_description.substring(0, 200)
        : '',
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords.filter((k): k is string => typeof k === 'string' && k.length > 1).slice(0, 10)
        : [],
      key_points: Array.isArray(parsed.key_points)
        ? parsed.key_points.filter((p): p is string => typeof p === 'string' && p.length > 5).slice(0, 6)
        : [],
    };
  } catch (error) {
    console.error('AI SEO optimization failed:', error);
    // Return empty/fallback - article will still be published without AI optimization
    return {
      title,
      excerpt: '',
      meta_description: '',
      keywords: [],
      key_points: [],
    };
  }
}
