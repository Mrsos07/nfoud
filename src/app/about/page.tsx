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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">من نحن</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              <strong>{SITE_NAME}</strong> هي شبكة الأخبار السعودية الأولى المدعومة بالذكاء الاصطناعي،
              نقدم تغطية شاملة وموثوقة لآخر الأخبار من المملكة العربية السعودية والعالم العربي.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">رؤيتنا</h2>
            <p className="text-gray-700 leading-relaxed">
              نسعى لأن نكون المصدر الأول والأكثر موثوقية للأخبار في المملكة العربية السعودية،
              من خلال الجمع بين الصحافة الاحترافية وتقنيات الذكاء الاصطناعي المتقدمة.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">مهمتنا</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>تقديم أخبار دقيقة وموثوقة على مدار الساعة</li>
              <li>تغطية شاملة للأحداث السياسية والاقتصادية والمحلية والرياضية</li>
              <li>استخدام الذكاء الاصطناعي لتحسين جودة المحتوى وسرعة التغطية</li>
              <li>الالتزام بأعلى معايير الأخلاقيات الصحفية</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">ما يميزنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">تغطية فورية</h3>
                <p className="text-gray-700">نقدم تغطية حية للأحداث العاجلة مع تحديثات مستمرة</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">ذكاء اصطناعي</h3>
                <p className="text-gray-700">نستخدم AI لتحليل الأخبار وتقديم رؤى معمقة</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">موثوقية</h3>
                <p className="text-gray-700">نلتزم بالدقة والحيادية في جميع تقاريرنا</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">تجربة مستخدم متميزة</h3>
                <p className="text-gray-700">موقع سريع وسهل الاستخدام على جميع الأجهزة</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">اتصل بنا</h2>
            <p className="text-gray-700">
              للاستفسارات والتواصل: <a href="mailto:info@nfoud.com" className="text-blue-600 hover:underline">info@nfoud.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
