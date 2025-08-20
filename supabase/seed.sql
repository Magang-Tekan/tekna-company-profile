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
-- PROJECTS (Updated with Tekna specific projects)
-- =====================================================

INSERT INTO projects (name, slug, project_url, status, featured_image_url, is_featured, is_active, sort_order) VALUES
(
    'Tekna Web Platform',
    'tekna-web-platform',
    'https://web.tekna.digital',
    'completed',
    '/images/projects/tekna-web.jpg',
    TRUE,
    TRUE,
    1
),
(
    'Tekna Mobile App',
    'tekna-mobile-app',
    'https://mobile.tekna.digital',
    'completed',
    '/images/projects/tekna-mobile.jpg',
    TRUE,
    TRUE,
    2
),
(
    'ERP Tekna',
    'erp-tekna',
    'https://erp.tekna.digital',
    'in-progress',
    '/images/projects/erp-tekna.jpg',
    TRUE,
    TRUE,
    3
),
(
    'Midea E-Warranty Mobile',
    'midea-e-warranty-mobile',
    'https://warranty.midea.id',
    'completed',
    '/images/projects/midea-warranty.jpg',
    TRUE,
    TRUE,
    4
);

-- Project translations
INSERT INTO project_translations (project_id, language_id, description, short_description, meta_title, meta_description, meta_keywords) VALUES
-- Tekna Web Platform - English
(
    (SELECT id FROM projects WHERE slug = 'tekna-web-platform'),
    (SELECT id FROM languages WHERE code = 'en'),
    'A comprehensive IoT monitoring platform designed to provide real-time insights and control over industrial equipment and environmental conditions. The platform features advanced dashboard capabilities with customizable widgets, real-time data visualization using interactive charts and graphs, intelligent alerting systems with configurable thresholds, and comprehensive reporting tools. Built with a microservices architecture, it ensures high availability and scalability while maintaining optimal performance even under heavy load. The system integrates seamlessly with existing industrial infrastructure and provides mobile-responsive interfaces for field engineers and managers.',
    'Advanced IoT monitoring platform with real-time dashboards, intelligent alerting, and comprehensive reporting for industrial environments',
    'Tekna Web Platform - IoT Monitoring Solution',
    'IoT monitoring platform with real-time dashboards and intelligent alerting systems for industrial environments.',
    'IoT monitoring, real-time dashboard, industrial IoT, React.js, Node.js'
),
-- Tekna Web Platform - Indonesian
(
    (SELECT id FROM projects WHERE slug = 'tekna-web-platform'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Platform monitoring IoT yang komprehensif dirancang untuk memberikan wawasan real-time dan kontrol atas peralatan industri dan kondisi lingkungan. Platform ini memiliki kemampuan dashboard canggih dengan widget yang dapat dikustomisasi, visualisasi data real-time menggunakan grafik dan chart interaktif, sistem peringatan cerdas dengan threshold yang dapat dikonfigurasi, dan alat pelaporan yang komprehensif. Dibangun dengan arsitektur microservices, memastikan ketersediaan tinggi dan skalabilitas sambil mempertahankan performa optimal bahkan di bawah beban berat. Sistem terintegrasi dengan mulus dengan infrastruktur industri yang ada dan menyediakan antarmuka responsif mobile untuk teknisi lapangan dan manajer.',
    'Platform monitoring IoT canggih dengan dashboard real-time, sistem peringatan cerdas, dan pelaporan komprehensif untuk lingkungan industri',
    'Tekna Web Platform - Solusi Monitoring IoT',
    'Platform monitoring IoT dengan dashboard real-time dan sistem peringatan cerdas untuk lingkungan industri.',
    'monitoring IoT, dashboard real-time, IoT industri, React.js, Node.js'
),
-- Tekna Mobile App - English
(
    (SELECT id FROM projects WHERE slug = 'tekna-mobile-app'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Native mobile application for IoT monitoring that provides field engineers and managers with on-the-go access to critical system data. The app features comprehensive offline capabilities with intelligent data synchronization, real-time push notifications for critical alerts, and advanced augmented reality features for equipment identification and maintenance guidance. Built with a robust offline-first architecture, it ensures reliable operation even in challenging industrial environments with poor connectivity. The app includes advanced features like barcode/QR code scanning, voice-to-text input for field reports, and integration with wearable devices for hands-free operation.',
    'Professional mobile app for IoT monitoring with advanced offline capabilities, AR features, and seamless field operations',
    'Tekna Mobile App - IoT Monitoring Mobile Solution',
    'Native mobile app for IoT monitoring with offline capabilities and augmented reality features.',
    'mobile IoT monitoring, React Native, offline app, augmented reality, field engineering'
),
-- Tekna Mobile App - Indonesian
(
    (SELECT id FROM projects WHERE slug = 'tekna-mobile-app'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Aplikasi mobile native untuk monitoring IoT yang memberikan akses on-the-go kepada teknisi lapangan dan manajer terhadap data sistem kritis. Aplikasi ini memiliki kemampuan offline komprehensif dengan sinkronisasi data cerdas, push notification real-time untuk alert kritis, dan fitur augmented reality canggih untuk identifikasi peralatan dan panduan maintenance. Dibangun dengan arsitektur offline-first yang robust, memastikan operasi yang reliabel bahkan di lingkungan industri yang menantang dengan konektivitas buruk. Aplikasi ini mencakup fitur canggih seperti scanning barcode/QR code, input suara-ke-teks untuk laporan lapangan, dan integrasi dengan perangkat wearable untuk operasi hands-free.',
    'Aplikasi mobile profesional untuk monitoring IoT dengan kemampuan offline canggih, fitur AR, dan operasi lapangan yang seamless',
    'Tekna Mobile App - Solusi Mobile Monitoring IoT',
    'Aplikasi mobile native untuk monitoring IoT dengan kemampuan offline dan fitur augmented reality.',
    'monitoring IoT mobile, React Native, aplikasi offline, augmented reality, teknik lapangan'
),
-- ERP Tekna - English
(
    (SELECT id FROM projects WHERE slug = 'erp-tekna'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Enterprise Resource Planning system tailored for modern businesses, featuring integrated modules for inventory management, financial tracking, human resources, and project management. The system provides comprehensive business intelligence with advanced analytics, customizable dashboards, and automated reporting capabilities. Built with scalability and customization in mind, it supports multi-tenant architecture and can be easily adapted to various industry requirements. The platform includes advanced features like workflow automation, document management, mobile accessibility, and seamless integration with third-party services. Real-time collaboration tools and comprehensive audit trails ensure transparency and compliance across all business operations.',
    'Comprehensive ERP system with advanced analytics, workflow automation, and multi-tenant architecture for modern businesses',
    'ERP Tekna - Modern Enterprise Resource Planning',
    'Modern ERP system with integrated modules for inventory, finance, HR, and project management.',
    'ERP system, enterprise resource planning, business management, Next.js, Supabase'
),
-- ERP Tekna - Indonesian
(
    (SELECT id FROM projects WHERE slug = 'erp-tekna'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Sistem Enterprise Resource Planning yang disesuaikan untuk bisnis modern, menampilkan modul terintegrasi untuk manajemen inventori, pelacakan keuangan, sumber daya manusia, dan manajemen proyek. Sistem ini menyediakan business intelligence komprehensif dengan analitik canggih, dashboard yang dapat dikustomisasi, dan kemampuan pelaporan otomatis. Dibangun dengan skalabilitas dan kustomisasi dalam pikiran, mendukung arsitektur multi-tenant dan dapat dengan mudah beradaptasi dengan berbagai persyaratan industri. Platform ini mencakup fitur canggih seperti otomatisasi workflow, manajemen dokumen, aksesibilitas mobile, dan integrasi seamless dengan layanan pihak ketiga. Alat kolaborasi real-time dan audit trail komprehensif memastikan transparansi dan kepatuhan di semua operasi bisnis.',
    'Sistem ERP komprehensif dengan analitik canggih, otomatisasi workflow, dan arsitektur multi-tenant untuk bisnis modern',
    'ERP Tekna - Sistem Perencanaan Sumber Daya Perusahaan Modern',
    'Sistem ERP modern dengan modul terintegrasi untuk inventori, keuangan, SDM, dan manajemen proyek.',
    'sistem ERP, perencanaan sumber daya perusahaan, manajemen bisnis, Next.js, Supabase'
),
-- Midea E-Warranty - English
(
    (SELECT id FROM projects WHERE slug = 'midea-e-warranty-mobile'),
    (SELECT id FROM languages WHERE code = 'en'),
    'Digital warranty management application for Midea home appliances, enabling customers to register products, claim warranties, and track service requests. The app features advanced QR code scanning with product verification, comprehensive multilingual support for global markets, and seamless integration with service centers and customer support systems. Built with a hybrid approach for cross-platform compatibility, it includes offline capabilities for areas with poor connectivity, secure API integration with existing legacy systems, and a user-friendly interface designed for all age groups. The platform also features automated warranty validation, digital receipt management, and real-time service tracking with push notifications.',
    'Comprehensive digital warranty management solution with QR scanning, multilingual support, and seamless service integration',
    'Midea E-Warranty - Digital Warranty Management',
    'Digital warranty management application for Midea home appliances with QR scanning and multilingual support.',
    'warranty management, mobile app, QR scanner, Midea, home appliances'
),
-- Midea E-Warranty - Indonesian
(
    (SELECT id FROM projects WHERE slug = 'midea-e-warranty-mobile'),
    (SELECT id FROM languages WHERE code = 'id'),
    'Aplikasi manajemen garansi digital untuk peralatan rumah tangga Midea, memungkinkan pelanggan untuk mendaftarkan produk, mengklaim garansi, dan melacak permintaan layanan. Aplikasi ini memiliki fitur QR code scanning canggih dengan verifikasi produk, dukungan multibahasa komprehensif untuk pasar global, dan integrasi seamless dengan pusat layanan dan sistem dukungan pelanggan. Dibangun dengan pendekatan hybrid untuk kompatibilitas cross-platform, mencakup kemampuan offline untuk area dengan konektivitas buruk, integrasi API aman dengan sistem legacy yang ada, dan antarmuka ramah pengguna yang dirancang untuk semua kelompok umur. Platform ini juga memiliki fitur validasi garansi otomatis, manajemen resi digital, dan pelacakan layanan real-time dengan push notification.',
    'Solusi manajemen garansi digital komprehensif dengan QR scanning, dukungan multibahasa, dan integrasi layanan seamless',
    'Midea E-Warranty - Manajemen Garansi Digital',
    'Aplikasi manajemen garansi digital untuk peralatan rumah tangga Midea dengan QR scanning dan dukungan multibahasa.',
    'manajemen garansi, aplikasi mobile, QR scanner, Midea, peralatan rumah tangga'
);

-- Project images for the new projects
INSERT INTO project_images (project_id, image_url, alt_text, caption, sort_order) VALUES
(
    (SELECT id FROM projects WHERE slug = 'tekna-web-platform'),
    '/images/projects/tekna-web-dashboard.jpg',
    'Tekna Web Platform Dashboard',
    'Main dashboard showing real-time IoT data visualization',
    1
),
(
    (SELECT id FROM projects WHERE slug = 'tekna-web-platform'),
    '/images/projects/tekna-web-analytics.jpg',
    'Tekna Web Platform Analytics',
    'Advanced analytics and reporting interface',
    2
),
(
    (SELECT id FROM projects WHERE slug = 'tekna-mobile-app'),
    '/images/projects/tekna-mobile-home.jpg',
    'Tekna Mobile App Home',
    'Mobile app home screen with quick access to monitoring tools',
    1
),
(
    (SELECT id FROM projects WHERE slug = 'tekna-mobile-app'),
    '/images/projects/tekna-mobile-ar.jpg',
    'Tekna Mobile App AR Feature',
    'Augmented reality feature for equipment identification',
    2
),
(
    (SELECT id FROM projects WHERE slug = 'erp-tekna'),
    '/images/projects/erp-dashboard.jpg',
    'ERP Tekna Dashboard',
    'Main ERP dashboard with business intelligence widgets',
    1
),
(
    (SELECT id FROM projects WHERE slug = 'erp-tekna'),
    '/images/projects/erp-modules.jpg',
    'ERP Tekna Modules',
    'Overview of integrated ERP modules and workflows',
    2
),
(
    (SELECT id FROM projects WHERE slug = 'midea-e-warranty-mobile'),
    '/images/projects/midea-warranty-home.jpg',
    'Midea E-Warranty Home',
    'Warranty app home screen with product registration',
    1
),
(
    (SELECT id FROM projects WHERE slug = 'midea-e-warranty-mobile'),
    '/images/projects/midea-warranty-qr.jpg',
    'Midea E-Warranty QR Scanner',
    'QR code scanning feature for product registration',
    2
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
