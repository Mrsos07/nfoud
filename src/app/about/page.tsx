import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على شبكة نفود الإخبارية - أول شبكة أخبار سعودية مدعومة بالذكاء الاصطناعي',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <header className="bg-primary text-primary-foreground py-10 md:py-16 border-b-2 border-gold">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">من نحن</h1>
          <p className="text-base md:text-xl text-gold">تعرف على شبكة نفود الإخبارية</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="bg-card rounded-xl shadow-elegant border border-border/50 p-6 md:p-10">
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              <strong>{SITE_NAME}</strong> هي شبكة الأخبار السعودية الأولى المدعومة بالذكاء الاصطناعي،
              نقدم تغطية شاملة وموثوقة لآخر الأخبار من المملكة العربية السعودية والعالم العربي.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground border-r-4 border-gold pr-4">رؤيتنا</h2>
            <p className="text-muted-foreground leading-relaxed">
              نسعى لأن نكون المصدر الأول والأكثر موثوقية للأخبار في المملكة العربية السعودية،
              من خلال الجمع بين الصحافة الاحترافية وتقنيات الذكاء الاصطناعي المتقدمة.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground border-r-4 border-gold pr-4">مهمتنا</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-gold mt-1">✦</span>تقديم أخبار دقيقة وموثوقة على مدار الساعة</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-1">✦</span>تغطية شاملة للأحداث السياسية والاقتصادية والمحلية والرياضية</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-1">✦</span>استخدام الذكاء الاصطناعي لتحسين جودة المحتوى وسرعة التغطية</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-1">✦</span>الالتزام بأعلى معايير الأخلاقيات الصحفية</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-foreground border-r-4 border-gold pr-4">ما يميزنا</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-secondary p-5 rounded-xl border border-border/50">
                <h3 className="font-bold text-base md:text-lg mb-2 text-gold">تغطية فورية</h3>
                <p className="text-muted-foreground text-sm md:text-base">نقدم تغطية حية للأحداث العاجلة مع تحديثات مستمرة</p>
              </div>
              <div className="bg-secondary p-5 rounded-xl border border-border/50">
                <h3 className="font-bold text-base md:text-lg mb-2 text-gold">ذكاء اصطناعي</h3>
                <p className="text-muted-foreground text-sm md:text-base">نستخدم AI لتحليل الأخبار وتقديم رؤى معمقة</p>
              </div>
              <div className="bg-secondary p-5 rounded-xl border border-border/50">
                <h3 className="font-bold text-base md:text-lg mb-2 text-gold">موثوقية</h3>
                <p className="text-muted-foreground text-sm md:text-base">نلتزم بالدقة والحيادية في جميع تقاريرنا</p>
              </div>
              <div className="bg-secondary p-5 rounded-xl border border-border/50">
                <h3 className="font-bold text-base md:text-lg mb-2 text-gold">تجربة مستخدم متميزة</h3>
                <p className="text-muted-foreground text-sm md:text-base">موقع سريع وسهل الاستخدام على جميع الأجهزة</p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground border-r-4 border-gold pr-4">اتصل بنا</h2>
            <p className="text-muted-foreground">
              للاستفسارات والتواصل: <a href="mailto:info@nfoud.com" className="text-gold hover:text-gold/80 font-medium transition-colors">info@nfoud.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
