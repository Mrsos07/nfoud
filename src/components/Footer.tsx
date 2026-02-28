import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';
import { Instagram, Mail } from 'lucide-react';
import { RiTwitterXFill, RiSnapchatFill, RiTiktokFill } from 'react-icons/ri';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-gold/20 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Image src="/nafud-logo.png" alt="نفود" width={80} height={80} className="h-20 w-20" />
              <div className="flex flex-col">
                <span className="text-gold font-bold text-3xl tracking-tight">شبكة نفود</span>
                <span className="text-gold/80 text-base font-light">الإخبارية</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed text-base max-w-md">
              شبكة نفود الإخبارية - مصدرك الموثوق للأخبار من المملكة العربية السعودية والعالم. نقدم لكم آخر الأخبار السياسية والاقتصادية والمحلية والرياضية على مدار الساعة بمصداقية واحترافية.
            </p>
            <div className="flex gap-3">
              <a href="https://www.tiktok.com/@nfoud_ai" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/10 hover:bg-accent text-gold hover:text-accent-foreground transition-all duration-300 shadow-hover" aria-label="TikTok">
                <RiTiktokFill size={20} />
              </a>
              <a href="https://x.com/Nfoud_ai" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/10 hover:bg-accent text-gold hover:text-accent-foreground transition-all duration-300 shadow-hover" aria-label="X (Twitter)">
                <RiTwitterXFill size={20} />
              </a>
              <a href="https://www.instagram.com/nfooud.ai/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/10 hover:bg-accent text-gold hover:text-accent-foreground transition-all duration-300 shadow-hover" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.snapchat.com/add/nfoudnews" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/10 hover:bg-accent text-gold hover:text-accent-foreground transition-all duration-300 shadow-hover" aria-label="Snapchat">
                <RiSnapchatFill size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="روابط القائمة الرئيسية">
            <h3 className="text-gold font-bold mb-6 text-xl">روابط سريعة</h3>
            <ul className="space-y-3">
              {[
                { name: 'الرئيسية', path: '/' },
                { name: 'سياسية', path: '/politics' },
                { name: 'اقتصادية', path: '/economy' },
                { name: 'محلية', path: '/local' },
                { name: 'رياضية', path: '/sports' },
                { name: 'الأحداث الحية', path: '/live' },
              ].map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="hover-gold transition-all text-primary-foreground/80 hover:text-gold flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all duration-300" aria-hidden="true"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About & Contact */}
          <div>
            <h3 className="text-gold font-bold mb-6 text-xl">عن الشبكة</h3>
            <ul className="space-y-3 mb-8">
              {[
                { name: 'من نحن', path: '/about' },
                { name: 'اتصل بنا', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="hover-gold transition-all text-primary-foreground/80 hover:text-gold flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all duration-300" aria-hidden="true"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <address className="not-italic">
              <h3 className="text-gold font-bold mb-4 text-xl">تواصل معنا</h3>
              <a href="mailto:info@nfoud.com" className="flex items-center gap-3 group text-primary-foreground/80 hover:text-gold transition-colors">
                <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-accent transition-colors" aria-hidden="true">
                  <Mail size={18} className="text-gold group-hover:text-accent-foreground transition-colors" />
                </div>
                info@nfoud.com
              </a>
            </address>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} {SITE_NAME}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
