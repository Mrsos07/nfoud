import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'تواصل مع فريق شبكة نفود الإخبارية',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">اتصل بنا</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                <a href="mailto:info@nfoud.com" className="text-blue-600 hover:underline">
                  info@nfoud.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">الموقع</h3>
                <p className="text-gray-700">المملكة العربية السعودية</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">تابعنا على وسائل التواصل</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a 
                href="https://x.com/Nfoud_ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white p-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
              >
                تويتر (X)
              </a>
              <a 
                href="https://www.instagram.com/nfooud.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                إنستغرام
              </a>
              <a 
                href="https://www.tiktok.com/@nfoud_ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white p-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
              >
                تيك توك
              </a>
              <a 
                href="https://www.snapchat.com/add/nfoudnews" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-400 text-black p-4 rounded-lg text-center hover:bg-yellow-500 transition-colors"
              >
                سناب شات
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
