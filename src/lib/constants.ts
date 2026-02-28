export const SITE_NAME = 'شبكة نفود الإخبارية';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfoud.com';
export const SITE_DESCRIPTION = 'نفود (nfoud.com) هي شبكة الأخبار السعودية الأولى المدعومة بالذكاء الاصطناعي. آخر الأخبار السياسية والاقتصادية والمحلية والرياضية من المملكة العربية السعودية والعالم العربي — تحليلات معمّقة وتغطيات حية على مدار الساعة.';
export const TWITTER_HANDLE = '@Nfoud_ai';

export const CATEGORIES = {
  politics: 'سياسة',
  economy: 'اقتصاد',
  local: 'محليات',
  sports: 'رياضة',
} as const;

export const REVALIDATE_TIME = 60;
