-- Seed: 001_initial_data.sql
-- Description: Initial data for Tekna Company Profile Website
-- Created: 2024-12-19

-- =====================================================
-- LANGUAGES
-- =====================================================

INSERT INTO languages (code, name, is_default, is_active) VALUES
('en', 'English', TRUE, TRUE),
('id', 'Indonesian', FALSE, TRUE),
('zh', 'Chinese', FALSE, TRUE);

-- =====================================================
-- COMPANY INFORMATION
-- =====================================================

INSERT INTO companies (name, slug, logo_url, favicon_url, email, phone, address, website, founded_year, employee_count, industry) VALUES
('Tekna Solutions', 'tekna-solutions', '/images/logo.png', '/images/favicon.ico', 'info@teknasolutions.com', '+62-21-1234-5678', 'Jakarta, Indonesia', 'https://teknasolutions.com', 2020, 25, 'Technology Solutions');

-- Company translations
INSERT INTO company_translations (company_id, language_id, description, mission, vision, values, short_description, meta_title, meta_description, meta_keywords) VALUES
(
    (SELECT id FROM companies WHERE slug = 'tekna-solutions'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Tekna Solutions is a leading technology company specializing in innovative digital solutions for businesses. We help companies transform their digital presence and streamline their operations through cutting-edge technology.',
    'To empower businesses with innovative technology solutions that drive growth and efficiency.',
    'To be the most trusted technology partner for businesses in Southeast Asia.',
    'Innovation, Excellence, Integrity, Collaboration, Customer Success',
    'Leading technology solutions provider helping businesses transform and grow through innovative digital solutions.',
    'Tekna Solutions - Leading Technology Solutions Provider',
    'Tekna Solutions provides innovative technology solutions for businesses. We specialize in web development, mobile apps, and digital transformation services.',
    'technology solutions, web development, mobile apps, digital transformation, software development'
),
(
    (SELECT id FROM companies WHERE slug = 'tekna-solutions'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Tekna Solutions adalah perusahaan teknologi terkemuka yang mengkhususkan diri dalam solusi digital inovatif untuk bisnis. Kami membantu perusahaan mengubah kehadiran digital mereka dan menyederhanakan operasi mereka melalui teknologi terkini.',
    'Memberdayakan bisnis dengan solusi teknologi inovatif yang mendorong pertumbuhan dan efisiensi.',
    'Menjadi mitra teknologi paling terpercaya untuk bisnis di Asia Tenggara.',
    'Inovasi, Keunggulan, Integritas, Kolaborasi, Kesuksesan Pelanggan',
    'Penyedia solusi teknologi terkemuka yang membantu bisnis bertransformasi dan berkembang melalui solusi digital inovatif.',
    'Tekna Solutions - Penyedia Solusi Teknologi Terkemuka',
    'Tekna Solutions menyediakan solusi teknologi inovatif untuk bisnis. Kami mengkhususkan diri dalam pengembangan web, aplikasi mobile, dan layanan transformasi digital.',
    'solusi teknologi, pengembangan web, aplikasi mobile, transformasi digital, pengembangan perangkat lunak'
);

-- =====================================================
-- TEAM MEMBERS
-- =====================================================

INSERT INTO team_members (first_name, last_name, email, phone, position, department, avatar_url, linkedin_url, twitter_url, github_url, is_active, sort_order) VALUES
('John', 'Doe', 'john.doe@teknasolutions.com', '+62-812-3456-7890', 'CEO & Founder', 'Executive', '/images/team/john-doe.jpg', 'https://linkedin.com/in/johndoe', 'https://twitter.com/johndoe', 'https://github.com/johndoe', TRUE, 1),
('Jane', 'Smith', 'jane.smith@teknasolutions.com', '+62-812-3456-7891', 'CTO', 'Technology', '/images/team/jane-smith.jpg', 'https://linkedin.com/in/janesmith', 'https://twitter.com/janesmith', 'https://github.com/janesmith', TRUE, 2),
('Mike', 'Johnson', 'mike.johnson@teknasolutions.com', '+62-812-3456-7892', 'Lead Developer', 'Development', '/images/team/mike-johnson.jpg', 'https://linkedin.com/in/mikejohnson', 'https://twitter.com/mikejohnson', 'https://github.com/mikejohnson', TRUE, 3),
('Sarah', 'Wilson', 'sarah.wilson@teknasolutions.com', '+62-812-3456-7893', 'UI/UX Designer', 'Design', '/images/team/sarah-wilson.jpg', 'https://linkedin.com/in/sarahwilson', 'https://twitter.com/sarahwilson', NULL, TRUE, 4),
('David', 'Brown', 'david.brown@teknasolutions.com', '+62-812-3456-7894', 'Marketing Manager', 'Marketing', '/images/team/david-brown.jpg', 'https://linkedin.com/in/davidbrown', 'https://twitter.com/davidbrown', NULL, TRUE, 5);

-- Team member translations
INSERT INTO team_member_translations (team_member_id, language_id, bio, achievements, expertise) VALUES
-- John Doe - English
(
    (SELECT id FROM team_members WHERE email = 'john.doe@teknasolutions.com'),
    (SELECT id FROM languages WHERE code = 'en'),
    'John Doe is a visionary technology leader with over 15 years of experience in the tech industry. He founded Tekna Solutions with the mission to democratize technology for businesses of all sizes.',
    'Founded 3 successful tech startups, Led digital transformation for 50+ companies, Named "Tech Entrepreneur of the Year" 2023',
    'Strategic Planning, Business Development, Technology Leadership, Digital Transformation'
),
-- John Doe - Indonesian
(
    (SELECT id FROM team_members WHERE email = 'john.doe@teknasolutions.com'),
    (SELECT id FROM languages WHERE code = 'id'),
    'John Doe adalah pemimpin teknologi visioner dengan pengalaman lebih dari 15 tahun di industri teknologi. Dia mendirikan Tekna Solutions dengan misi untuk mendemokratisasi teknologi untuk bisnis dari semua ukuran.',
    'Mendirikan 3 startup teknologi yang sukses, Memimpin transformasi digital untuk 50+ perusahaan, Dinobatkan sebagai "Tech Entrepreneur of the Year" 2023',
    'Perencanaan Strategis, Pengembangan Bisnis, Kepemimpinan Teknologi, Transformasi Digital'
),
-- Jane Smith - English
(
    (SELECT id FROM team_members WHERE email = 'jane.smith@teknasolutions.com'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Jane Smith is a technology expert with deep knowledge in software architecture and emerging technologies. She leads our technology strategy and ensures we stay ahead of industry trends.',
    'Architected 100+ scalable applications, Led migration to cloud infrastructure, Expert in AI/ML implementation',
    'Software Architecture, Cloud Computing, AI/ML, System Design, Technology Strategy'
),
-- Jane Smith - Indonesian
(
    (SELECT id FROM team_members WHERE email = 'jane.smith@teknasolutions.com'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Jane Smith adalah ahli teknologi dengan pengetahuan mendalam dalam arsitektur perangkat lunak dan teknologi yang muncul. Dia memimpin strategi teknologi kami dan memastikan kami tetap unggul dari tren industri.',
    'Mengarsiteki 100+ aplikasi yang dapat diskalakan, Memimpin migrasi ke infrastruktur cloud, Ahli dalam implementasi AI/ML',
    'Arsitektur Perangkat Lunak, Cloud Computing, AI/ML, Desain Sistem, Strategi Teknologi'
);

-- =====================================================
-- SERVICES
-- =====================================================

INSERT INTO services (name, slug, icon, image_url, is_active, sort_order) VALUES
('Web Development', 'web-development', 'globe', '/images/services/web-development.jpg', TRUE, 1),
('Mobile App Development', 'mobile-app-development', 'smartphone', '/images/services/mobile-app-development.jpg', TRUE, 2),
('Digital Transformation', 'digital-transformation', 'refresh-cw', '/images/services/digital-transformation.jpg', TRUE, 3),
('Cloud Solutions', 'cloud-solutions', 'cloud', '/images/services/cloud-solutions.jpg', TRUE, 4),
('UI/UX Design', 'ui-ux-design', 'palette', '/images/services/ui-ux-design.jpg', TRUE, 5),
('Consulting', 'consulting', 'users', '/images/services/consulting.jpg', TRUE, 6);

-- Service translations
INSERT INTO service_translations (service_id, language_id, description, short_description, features, benefits, meta_title, meta_description, meta_keywords) VALUES
-- Web Development - English
(
    (SELECT id FROM services WHERE slug = 'web-development'),
    (SELECT id FROM languages WHERE code = 'en'),
    'We create modern, responsive, and high-performance websites and web applications that help businesses establish a strong online presence and drive growth.',
    'Custom web development solutions tailored to your business needs.',
    'Responsive Design, SEO Optimization, Performance Optimization, Security Implementation, Content Management Systems, E-commerce Solutions',
    'Increased online visibility, Better user experience, Higher conversion rates, Improved SEO rankings, Scalable solutions',
    'Web Development Services - Tekna Solutions',
    'Professional web development services including responsive design, SEO optimization, and custom web applications.',
    'web development, website design, web applications, responsive design, SEO optimization'
),
-- Web Development - Indonesian
(
    (SELECT id FROM services WHERE slug = 'web-development'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Kami membuat website dan aplikasi web yang modern, responsif, dan berkinerja tinggi yang membantu bisnis membangun kehadiran online yang kuat dan mendorong pertumbuhan.',
    'Solusi pengembangan web custom yang disesuaikan dengan kebutuhan bisnis Anda.',
    'Desain Responsif, Optimasi SEO, Optimasi Kinerja, Implementasi Keamanan, Sistem Manajemen Konten, Solusi E-commerce',
    'Peningkatan visibilitas online, Pengalaman pengguna yang lebih baik, Tingkat konversi yang lebih tinggi, Peringkat SEO yang lebih baik, Solusi yang dapat diskalakan',
    'Layanan Pengembangan Web - Tekna Solutions',
    'Layanan pengembangan web profesional termasuk desain responsif, optimasi SEO, dan aplikasi web custom.',
    'pengembangan web, desain website, aplikasi web, desain responsif, optimasi SEO'
);

-- =====================================================
-- CATEGORIES
-- =====================================================

INSERT INTO categories (name, slug, description, color, is_active, sort_order) VALUES
('Technology', 'technology', 'Latest technology trends and insights', '#3B82F6', TRUE, 1),
('Business', 'business', 'Business strategies and tips', '#10B981', TRUE, 2),
('Development', 'development', 'Software development insights', '#F59E0B', TRUE, 3),
('Design', 'design', 'UI/UX design principles', '#EF4444', TRUE, 4),
('Innovation', 'innovation', 'Innovation in technology', '#8B5CF6', TRUE, 5);

-- =====================================================
-- TAGS
-- =====================================================

INSERT INTO tags (name, slug, color) VALUES
('Web Development', 'web-development', '#3B82F6'),
('Mobile Apps', 'mobile-apps', '#10B981'),
('AI/ML', 'ai-ml', '#F59E0B'),
('Cloud Computing', 'cloud-computing', '#EF4444'),
('UI/UX', 'ui-ux', '#8B5CF6'),
('Digital Transformation', 'digital-transformation', '#06B6D4'),
('Startup', 'startup', '#84CC16'),
('Technology', 'technology', '#F97316');

-- =====================================================
-- BLOG POSTS
-- =====================================================

INSERT INTO posts (title, slug, excerpt, featured_image_url, author_id, category_id, status, published_at, is_featured, is_active) VALUES
(
    'The Future of Web Development in 2024',
    'future-of-web-development-2024',
    'Explore the latest trends and technologies that will shape web development in 2024 and beyond.',
    '/images/blog/future-web-dev-2024.jpg',
    (SELECT id FROM team_members WHERE email = 'jane.smith@teknasolutions.com'),
    (SELECT id FROM categories WHERE slug = 'technology'),
    'published',
    NOW(),
    TRUE,
    TRUE
),
(
    'How AI is Transforming Business Operations',
    'ai-transforming-business-operations',
    'Discover how artificial intelligence is revolutionizing the way businesses operate and make decisions.',
    '/images/blog/ai-business-operations.jpg',
    (SELECT id FROM team_members WHERE email = 'john.doe@teknasolutions.com'),
    (SELECT id FROM categories WHERE slug = 'business'),
    'published',
    NOW() - INTERVAL '1 day',
    FALSE,
    TRUE
),
(
    'Building Scalable Web Applications',
    'building-scalable-web-applications',
    'Learn the best practices for building web applications that can handle growth and increased traffic.',
    '/images/blog/scalable-web-apps.jpg',
    (SELECT id FROM team_members WHERE email = 'mike.johnson@teknasolutions.com'),
    (SELECT id FROM categories WHERE slug = 'development'),
    'published',
    NOW() - INTERVAL '2 days',
    FALSE,
    TRUE
);

-- Post translations
INSERT INTO post_translations (post_id, language_id, title, content, excerpt, meta_title, meta_description, meta_keywords) VALUES
-- Future of Web Development - English
(
    (SELECT id FROM posts WHERE slug = 'future-of-web-development-2024'),
    (SELECT id FROM languages WHERE code = 'en'),
    'The Future of Web Development in 2024',
    '<h2>Introduction</h2><p>The web development landscape is constantly evolving, with new technologies and frameworks emerging every year. As we approach 2024, several key trends are shaping the future of web development.</p><h2>Key Trends</h2><ul><li>Progressive Web Apps (PWAs)</li><li>WebAssembly for Performance</li><li>AI-Powered Development Tools</li><li>Serverless Architecture</li><li>Micro-Frontends</li></ul><h2>Conclusion</h2><p>The future of web development is exciting and full of possibilities. Developers who stay updated with these trends will be well-positioned for success.</p>',
    'Explore the latest trends and technologies that will shape web development in 2024 and beyond.',
    'The Future of Web Development in 2024 - Tekna Solutions',
    'Discover the latest web development trends for 2024 including PWAs, WebAssembly, AI tools, and more.',
    'web development, 2024 trends, progressive web apps, webassembly, AI development tools'
),
-- Future of Web Development - Indonesian
(
    (SELECT id FROM posts WHERE slug = 'future-of-web-development-2024'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Masa Depan Pengembangan Web di 2024',
    '<h2>Pendahuluan</h2><p>Lanskap pengembangan web terus berkembang, dengan teknologi dan framework baru yang muncul setiap tahun. Saat kita mendekati 2024, beberapa tren utama membentuk masa depan pengembangan web.</p><h2>Tren Utama</h2><ul><li>Progressive Web Apps (PWAs)</li><li>WebAssembly untuk Kinerja</li><li>Alat Pengembangan Berbasis AI</li><li>Arsitektur Serverless</li><li>Micro-Frontends</li></ul><h2>Kesimpulan</h2><p>Masa depan pengembangan web menarik dan penuh kemungkinan. Developer yang tetap terupdate dengan tren ini akan diposisikan dengan baik untuk sukses.</p>',
    'Jelajahi tren dan teknologi terbaru yang akan membentuk pengembangan web di 2024 dan seterusnya.',
    'Masa Depan Pengembangan Web di 2024 - Tekna Solutions',
    'Temukan tren pengembangan web terbaru untuk 2024 termasuk PWAs, WebAssembly, alat AI, dan lainnya.',
    'pengembangan web, tren 2024, progressive web apps, webassembly, alat pengembangan AI'
);

-- Post tags
INSERT INTO post_tags (post_id, tag_id) VALUES
(
    (SELECT id FROM posts WHERE slug = 'future-of-web-development-2024'),
    (SELECT id FROM tags WHERE slug = 'web-development')
),
(
    (SELECT id FROM posts WHERE slug = 'future-of-web-development-2024'),
    (SELECT id FROM tags WHERE slug = 'technology')
);

-- =====================================================
-- PROJECTS
-- =====================================================

INSERT INTO projects (name, slug, client_name, project_url, github_url, start_date, end_date, status, featured_image_url, is_featured, is_active, sort_order) VALUES
(
    'E-Commerce Platform',
    'ecommerce-platform',
    'RetailCorp',
    'https://retailcorp-ecommerce.com',
    'https://github.com/teknasolutions/ecommerce-platform',
    '2024-01-01',
    '2024-06-01',
    'completed',
    '/images/projects/ecommerce-platform.jpg',
    TRUE,
    TRUE,
    1
),
(
    'Mobile Banking App',
    'mobile-banking-app',
    'BankDigital',
    'https://bankdigital.com/app',
    'https://github.com/teknasolutions/mobile-banking',
    '2024-03-01',
    '2024-08-01',
    'completed',
    '/images/projects/mobile-banking.jpg',
    TRUE,
    TRUE,
    2
),
(
    'Corporate Website Redesign',
    'corporate-website-redesign',
    'TechStartup Inc',
    'https://techstartup.com',
    NULL,
    '2024-05-01',
    '2024-07-01',
    'completed',
    '/images/projects/corporate-website.jpg',
    FALSE,
    TRUE,
    3
);

-- Project translations
INSERT INTO project_translations (project_id, language_id, description, short_description, challenges, solutions, technologies, results, meta_title, meta_description, meta_keywords) VALUES
-- E-Commerce Platform - English
(
    (SELECT id FROM projects WHERE slug = 'ecommerce-platform'),
    (SELECT id FROM languages WHERE code = 'en'),
    'A comprehensive e-commerce platform built with modern technologies to provide seamless online shopping experience.',
    'Modern e-commerce platform with advanced features and excellent user experience.',
    'Complex inventory management, High traffic handling, Secure payment processing, Mobile responsiveness',
    'Microservices architecture, Redis caching, CDN integration, Progressive Web App features, Advanced security measures',
    'React.js, Node.js, PostgreSQL, Redis, AWS, Stripe API',
    '50% increase in conversion rate, 40% improvement in page load speed, 99.9% uptime, 30% increase in mobile sales',
    'E-Commerce Platform Development - Tekna Solutions',
    'Professional e-commerce platform development with modern technologies and excellent performance.',
    'e-commerce platform, online shopping, web development, React.js, Node.js'
),
-- E-Commerce Platform - Indonesian
(
    (SELECT id FROM projects WHERE slug = 'ecommerce-platform'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Platform e-commerce komprehensif yang dibangun dengan teknologi modern untuk memberikan pengalaman berbelanja online yang mulus.',
    'Platform e-commerce modern dengan fitur canggih dan pengalaman pengguna yang luar biasa.',
    'Manajemen inventaris yang kompleks, Penanganan lalu lintas tinggi, Pemrosesan pembayaran yang aman, Responsivitas mobile',
    'Arsitektur microservices, Redis caching, Integrasi CDN, Fitur Progressive Web App, Langkah-langkah keamanan canggih',
    'React.js, Node.js, PostgreSQL, Redis, AWS, Stripe API',
    'Peningkatan 50% dalam tingkat konversi, Peningkatan 40% dalam kecepatan pemuatan halaman, 99.9% uptime, Peningkatan 30% dalam penjualan mobile',
    'Pengembangan Platform E-Commerce - Tekna Solutions',
    'Pengembangan platform e-commerce profesional dengan teknologi modern dan kinerja yang luar biasa.',
    'platform e-commerce, belanja online, pengembangan web, React.js, Node.js'
);

-- =====================================================
-- TESTIMONIALS
-- =====================================================

INSERT INTO testimonials (client_name, client_position, client_company, client_avatar_url, rating, is_active, is_featured, sort_order) VALUES
(
    'Maria Garcia',
    'CEO',
    'RetailCorp',
    '/images/testimonials/maria-garcia.jpg',
    5,
    TRUE,
    TRUE,
    1
),
(
    'Ahmed Hassan',
    'CTO',
    'BankDigital',
    '/images/testimonials/ahmed-hassan.jpg',
    5,
    TRUE,
    TRUE,
    2
),
(
    'Lisa Chen',
    'Marketing Director',
    'TechStartup Inc',
    '/images/testimonials/lisa-chen.jpg',
    5,
    TRUE,
    FALSE,
    3
);

-- Testimonial translations
INSERT INTO testimonial_translations (testimonial_id, language_id, content) VALUES
-- Maria Garcia - English
(
    (SELECT id FROM testimonials WHERE client_name = 'Maria Garcia'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Tekna Solutions delivered an exceptional e-commerce platform that exceeded our expectations. The team was professional, responsive, and delivered the project on time. Our online sales have increased by 50% since launch!'
),
-- Maria Garcia - Indonesian
(
    (SELECT id FROM testimonials WHERE client_name = 'Maria Garcia'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Tekna Solutions memberikan platform e-commerce yang luar biasa yang melampaui harapan kami. Tim sangat profesional, responsif, dan menyelesaikan proyek tepat waktu. Penjualan online kami telah meningkat 50% sejak peluncuran!'
),
-- Ahmed Hassan - English
(
    (SELECT id FROM testimonials WHERE client_name = 'Ahmed Hassan'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Working with Tekna Solutions on our mobile banking app was a game-changer. They understood our security requirements and delivered a robust, user-friendly application that our customers love.'
),
-- Ahmed Hassan - Indonesian
(
    (SELECT id FROM testimonials WHERE client_name = 'Ahmed Hassan'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Bekerja dengan Tekna Solutions pada aplikasi mobile banking kami adalah perubahan besar. Mereka memahami persyaratan keamanan kami dan memberikan aplikasi yang kuat dan ramah pengguna yang disukai pelanggan kami.'
);

-- =====================================================
-- PAGES
-- =====================================================

INSERT INTO pages (title, slug, template, status, is_homepage, is_active, sort_order) VALUES
('Home', 'home', 'home', 'published', TRUE, TRUE, 1),
('About Us', 'about', 'about', 'published', FALSE, TRUE, 2),
('Services', 'services', 'services', 'published', FALSE, TRUE, 3),
('Portfolio', 'portfolio', 'portfolio', 'published', FALSE, TRUE, 4),
('Blog', 'blog', 'blog', 'published', FALSE, TRUE, 5),
('Team', 'team', 'team', 'published', FALSE, TRUE, 6),
('Contact', 'contact', 'contact', 'published', FALSE, TRUE, 7);

-- Page translations
INSERT INTO page_translations (page_id, language_id, title, meta_title, meta_description, meta_keywords) VALUES
-- Home - English
(
    (SELECT id FROM pages WHERE slug = 'home'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Home',
    'Tekna Solutions - Leading Technology Solutions Provider',
    'Tekna Solutions provides innovative technology solutions for businesses. We specialize in web development, mobile apps, and digital transformation services.',
    'technology solutions, web development, mobile apps, digital transformation'
),
-- Home - Indonesian
(
    (SELECT id FROM pages WHERE slug = 'home'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Beranda',
    'Tekna Solutions - Penyedia Solusi Teknologi Terkemuka',
    'Tekna Solutions menyediakan solusi teknologi inovatif untuk bisnis. Kami mengkhususkan diri dalam pengembangan web, aplikasi mobile, dan layanan transformasi digital.',
    'solusi teknologi, pengembangan web, aplikasi mobile, transformasi digital'
);

-- =====================================================
-- SOCIAL MEDIA LINKS
-- =====================================================

INSERT INTO social_media_links (platform, url, icon, is_active, sort_order) VALUES
('linkedin', 'https://linkedin.com/company/teknasolutions', 'linkedin', TRUE, 1),
('twitter', 'https://twitter.com/teknasolutions', 'twitter', TRUE, 2),
('facebook', 'https://facebook.com/teknasolutions', 'facebook', TRUE, 3),
('instagram', 'https://instagram.com/teknasolutions', 'instagram', TRUE, 4),
('github', 'https://github.com/teknasolutions', 'github', TRUE, 5);

-- =====================================================
-- ACHIEVEMENTS
-- =====================================================

INSERT INTO achievements (title, year, image_url, is_active, sort_order) VALUES
('Best Technology Company 2023', 2023, '/images/achievements/best-tech-company-2023.jpg', TRUE, 1),
('Digital Innovation Award', 2023, '/images/achievements/digital-innovation-award.jpg', TRUE, 2),
('Top 10 Startups in Indonesia', 2022, '/images/achievements/top-10-startups.jpg', TRUE, 3),
('ISO 27001 Certification', 2022, '/images/achievements/iso-27001.jpg', TRUE, 4);

-- Achievement translations
INSERT INTO achievement_translations (achievement_id, language_id, description) VALUES
-- Best Technology Company 2023 - English
(
    (SELECT id FROM achievements WHERE title = 'Best Technology Company 2023'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Recognized as the best technology company in Indonesia for our innovative solutions and exceptional client service.'
),
-- Best Technology Company 2023 - Indonesian
(
    (SELECT id FROM achievements WHERE title = 'Best Technology Company 2023'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Diakui sebagai perusahaan teknologi terbaik di Indonesia untuk solusi inovatif kami dan layanan klien yang luar biasa.'
);
