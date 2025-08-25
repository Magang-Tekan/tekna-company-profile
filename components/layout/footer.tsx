'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribing(false);
    setIsSubscribed(true);
    setEmail('');
    
    // Reset message after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const services = [
    { name: "Web Development", href: "/services/web-development" },
    { name: "Mobile Apps", href: "/services/mobile-apps" },
    { name: "IoT Solutions", href: "/services/iot-solutions" },
    { name: "UI/UX Design", href: "/services/ui-ux-design" },
    { name: "Cloud Services", href: "/services/cloud-services" },
    { name: "Digital Marketing", href: "/services/digital-marketing" }
  ];

  const company = [
    { name: "Tentang Kami", href: "/about" },
    { name: "Tim Kami", href: "/team" },
    { name: "Karir", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Testimonial", href: "/testimonials" }
  ];

  const support = [
    { name: "Hubungi Kami", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Dokumentasi", href: "/documentation" },
    { name: "Status Layanan", href: "/status" },
    { name: "Kebijakan Privasi", href: "/privacy" },
    { name: "Syarat & Ketentuan", href: "/terms" }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      label: "Kantor Pusat",
      value: "Jl. Sudirman No. 123, Jakarta Pusat 10250, Indonesia"
    },
    {
      icon: Phone,
      label: "Telepon",
      value: "+62 21 1234 5678",
      href: "tel:+622112345678"
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@tekna.co.id",
      href: "mailto:hello@tekna.co.id"
    },
    {
      icon: Globe,
      label: "Website",
      value: "www.tekna.co.id",
      href: "https://tekna.co.id"
    }
  ];

  const socialMedia = [
    { 
      icon: Facebook, 
      label: "Facebook", 
      href: "https://facebook.com/tekna",
      color: "hover:text-blue-600" 
    },
    { 
      icon: Twitter, 
      label: "Twitter", 
      href: "https://twitter.com/tekna",
      color: "hover:text-blue-400" 
    },
    { 
      icon: Instagram, 
      label: "Instagram", 
      href: "https://instagram.com/tekna",
      color: "hover:text-pink-500" 
    },
    { 
      icon: Linkedin, 
      label: "LinkedIn", 
      href: "https://linkedin.com/company/tekna",
      color: "hover:text-blue-700" 
    },
    { 
      icon: Youtube, 
      label: "YouTube", 
      href: "https://youtube.com/@tekna",
      color: "hover:text-red-600" 
    }
  ];

  return (
    <footer className="bg-background border-t relative z-30 pointer-events-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Tekna</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Kami adalah partner teknologi terpercaya yang membantu bisnis berkembang 
                melalui solusi digital inovatif dan berkualitas tinggi.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Dapatkan update terbaru tentang teknologi dan tips bisnis.
              </p>
              
              {isSubscribed ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✓ Terima kasih! Anda telah berlangganan newsletter kami.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubscribing}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={isSubscribing}
                      className="px-3"
                    >
                      {isSubscribing ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Layanan Kami</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href={service.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                  >
                    {service.name}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Perusahaan</h4>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                  >
                    {item.name}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Bantuan</h4>
            <ul className="space-y-3">
              {support.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                  >
                    {item.name}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Contact Information */}
        <div className="mb-12">
          <h4 className="font-semibold text-foreground mb-6 text-center">Hubungi Kami</h4>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                {item.href ? (
                  <a 
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Ikuti Kami:</span>
            <div className="flex gap-3">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-colors ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Tekna. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
