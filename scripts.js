        const pageTitles = {
            en: "Assas Digital Systems - Premier Tech Solutions in Chad",
            fr: "Assas Digital Systems - Développement web, mobile et solutions digitales au Tchad",
            ar: "Assas Digital Systems - تطوير الويب والتطبيقات والحلول الرقمية في تشاد"
        };

        const uiTranslations = {
            en: {
                languageSwitcherLabel: "Language switcher",
                demoAlert: "Demo video coming soon! Contact us for a personalized demonstration.",
                serviceInterest: "Hi, I'm interested in your {{serviceName}} services. Please provide more details.",
                whatsappMessage: "Hello! I'm interested in your digital services. Can we discuss my project?",
                pullToRefresh: "Pull to refresh",
                releaseToRefresh: "Release to refresh",
                validationRequired: "This field is required",
                validationEmail: "Please enter a valid email address",
                validationPhone: "Please enter a valid phone number",
                validationMessageLength: "Message should be at least 10 characters long",
                sending: "Sending...",
                messageSent: "Message sent successfully! We'll get back to you soon."
            },
            fr: {
                languageSwitcherLabel: "Sélecteur de langue",
                demoAlert: "Notre démo vidéo arrive bientôt. Contactez-nous pour une présentation personnalisée.",
                serviceInterest: "Bonjour, je souhaite en savoir plus sur votre offre {{serviceName}}. Pouvez-vous me partager plus de détails ?",
                whatsappMessage: "Bonjour, j'ai un projet digital et j'aimerais en discuter avec votre équipe. Êtes-vous disponibles ?",
                pullToRefresh: "Tirez pour actualiser",
                releaseToRefresh: "Relâchez pour actualiser",
                validationRequired: "Ce champ est obligatoire",
                validationEmail: "Veuillez saisir une adresse e-mail valide",
                validationPhone: "Veuillez saisir un numéro de téléphone valide",
                validationMessageLength: "Le message doit contenir au moins 10 caractères",
                sending: "Envoi en cours...",
                messageSent: "Votre message a bien été envoyé. Notre équipe vous répondra très bientôt."
            },
            ar: {
                languageSwitcherLabel: "مبدل اللغة",
                demoAlert: "سيكون العرض التوضيحي متاحاً قريباً. تواصل معنا للحصول على عرض مخصص لمشروعك.",
                serviceInterest: "مرحباً، أود معرفة المزيد عن خدمة {{serviceName}}. هل يمكنكم تزويدي بالتفاصيل؟",
                whatsappMessage: "مرحباً، لدي مشروع رقمي وأرغب في مناقشته مع فريقكم. هل يمكننا التحدث؟",
                pullToRefresh: "اسحب للتحديث",
                releaseToRefresh: "اترك للتحديث",
                validationRequired: "هذا الحقل مطلوب",
                validationEmail: "يرجى إدخال بريد إلكتروني صحيح",
                validationPhone: "يرجى إدخال رقم هاتف صحيح",
                validationMessageLength: "يجب أن تتكون الرسالة من 10 أحرف على الأقل",
                sending: "جاري الإرسال...",
                messageSent: "تم إرسال رسالتك بنجاح. سيتواصل معك فريقنا قريباً."
            }
        };

        const textTranslations = {
            fr: {},
            ar: {}
        };

        const supportedLanguages = ["en", "fr", "ar"];
        const translatableTextNodes = [];
        const translatableAttributes = [];
        const languageButtons = document.querySelectorAll(".language-btn");
        let currentLanguage = "en";

        function normalizeText(text) {
            return text.replace(/\s+/g, " ").trim();
        }

        function collectTranslatableNodes() {
            if (translatableTextNodes.length || translatableAttributes.length) {
                return;
            }

            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    if (!node.parentElement) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentElement.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return normalizeText(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            });

            while (walker.nextNode()) {
                const node = walker.currentNode;
                translatableTextNodes.push({
                    node,
                    original: normalizeText(node.textContent)
                });
            }

            document.querySelectorAll("[placeholder]").forEach(element => {
                translatableAttributes.push({
                    element,
                    attr: "placeholder",
                    original: normalizeText(element.getAttribute("placeholder") || "")
                });
            });
        }

        function translateText(originalText, language) {
            return textTranslations[language]?.[originalText] || originalText;
        }

        function t(key, replacements = {}) {
            const template = uiTranslations[currentLanguage]?.[key] || uiTranslations.en[key] || "";
            return template.replace(/\{\{(\w+)\}\}/g, (_, token) => replacements[token] ?? "");
        }

        function updateLanguageButtons() {
            languageButtons.forEach(button => {
                button.classList.toggle("active", button.dataset.lang === currentLanguage);
            });
        }

        function updateValidationMessages() {
            document.querySelectorAll(".validation-message[data-message-key]").forEach(messageElement => {
                messageElement.textContent = t(messageElement.dataset.messageKey);
            });
        }

        function updatePullIndicatorText() {
            const indicator = document.querySelector(".pull-indicator");
            if (!indicator) {
                return;
            }

            const message = indicator.classList.contains("active") ? t("releaseToRefresh") : t("pullToRefresh");
            const iconClass = indicator.classList.contains("active") ? "fa-sync-alt" : "fa-arrow-down";
            indicator.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
        }

        function applyTranslations(language) {
            currentLanguage = supportedLanguages.includes(language) ? language : "en";
            collectTranslatableNodes();

            translatableTextNodes.forEach(({ node, original }) => {
                node.textContent = translateText(original, currentLanguage);
            });

            translatableAttributes.forEach(({ element, attr, original }) => {
                element.setAttribute(attr, translateText(original, currentLanguage));
            });

            document.title = pageTitles[currentLanguage] || pageTitles.en;
            document.documentElement.lang = currentLanguage;
            document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

            const languageSwitcher = document.querySelector(".language-switcher");
            if (languageSwitcher) {
                languageSwitcher.setAttribute("aria-label", t("languageSwitcherLabel"));
            }

            updateLanguageButtons();
            updateValidationMessages();
            updatePullIndicatorText();

            try {
                localStorage.setItem("preferred-language", currentLanguage);
            } catch (error) {
                // Ignore storage failures and keep the current session language.
            }
        }

        function getInitialLanguage() {
            try {
                const savedLanguage = localStorage.getItem("preferred-language");
                if (supportedLanguages.includes(savedLanguage)) {
                    return savedLanguage;
                }
            } catch (error) {
                // Ignore storage failures and fall back to browser preferences.
            }

            const browserLanguage = navigator.language?.slice(0, 2).toLowerCase();
            return supportedLanguages.includes(browserLanguage) ? browserLanguage : "en";
        }

        languageButtons.forEach(button => {
            button.addEventListener("click", () => {
                applyTranslations(button.dataset.lang);
            });
        });

        Object.assign(textTranslations.fr, {
            "Initializing Digital Excellence...": "Initialisation de l'excellence numérique...",
            "Chat with us on WhatsApp": "Échangeons sur WhatsApp",
            "Home": "Accueil",
            "About": "À propos",
            "Services": "Services",
            "Portfolio": "Portfolio",
            "Team": "Équipe",
            "Blog": "Blog",
            "Contact": "Contact",
            "Theme": "Apparence",
            "N'Djamena, Chad": "N'Djamena, Tchad",
            "Transforming": "Façonner",
            "Africa's Digital": "l'avenir numérique",
            "Landscape": "de l'Afrique",
            "We craft cutting-edge web and mobile applications that empower businesses across Central Africa. From concept to deployment, we turn your digital vision into reality.": "Nous concevons des sites web, des applications mobiles et des plateformes métiers qui aident les entreprises d'Afrique centrale à accélérer leur transformation digitale. De la stratégie au déploiement, nous donnons vie à vos idées.",
            "Projects": "Projets",
            "Years": "Années",
            "Success": "Succès",
            "Start Your Project": "Lancer votre projet",
            "Watch Demo": "Voir la démo",
            "Pioneering Technology in Central Africa": "L'innovation technologique au cœur de l'Afrique centrale",
            "Based in the heart of N'Djamena, Assas Digital Systems is at the forefront of Chad's digital transformation. We combine global technology standards with deep understanding of local markets to deliver exceptional digital solutions.": "Implantée à N'Djamena, Assas Digital Systems accompagne les entreprises tchadiennes dans leur transition numérique. Nous allions standards internationaux, connaissance du terrain et exigence produit pour livrer des solutions réellement utiles.",
            "Our team of expert developers and designers work with businesses across Chad and Central Africa to create powerful web platforms and mobile applications that drive growth and innovation in our rapidly evolving digital landscape.": "Nos développeurs, designers et chefs de projet collaborent avec des entreprises du Tchad et d'Afrique centrale pour créer des plateformes web et des applications mobiles pensées pour la performance, la simplicité et la croissance.",
            "Projects Completed": "Projets réalisés",
            "Happy Clients": "Clients satisfaits",
            "Years Experience": "Années d'expérience",
            "Client Satisfaction": "Satisfaction client",
            "Serving Central Africa": "Au service de l'Afrique centrale",
            "What We Offer": "Nos services",
            "Comprehensive Digital": "Des solutions digitales",
            "Solutions": "sur mesure",
            "From concept to deployment, we provide end-to-end technology services tailored for African businesses, combining global standards with local market expertise.": "De la définition du besoin à la mise en production, nous livrons des solutions digitales sur mesure pour les entreprises africaines, avec le bon équilibre entre ambition produit, fiabilité technique et réalité du marché."
        });

        Object.assign(textTranslations.fr, {
            "Most Popular": "Le favori des clients",
            "Web Development": "Développement web",
            "Powerful digital presence for your business": "Un site performant pour faire grandir votre activité",
            "Custom websites and web applications built with cutting-edge technology to establish your strong online presence and drive business growth.": "Nous créons des sites web et applications métier qui renforcent votre présence en ligne, améliorent l'expérience utilisateur et soutiennent vos objectifs commerciaux.",
            "Mobile-First Design": "Design mobile-first",
            "SEO Optimized": "Optimisé SEO",
            "Secure & Fast": "Sécurisé et rapide",
            "Key Features:": "Fonctionnalités clés :",
            "Responsive Design": "Design responsive",
            "E-commerce Solutions": "Solutions e-commerce",
            "CMS Development": "Développement CMS",
            "Multi-language Support": "Support multilingue",
            "Get Started": "Parler à l'équipe",
            "Mobile App Development": "Développement d'applications mobiles",
            "Native & cross-platform applications": "Applications natives ou cross-platform",
            "Native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android devices.": "Nous développons des applications mobiles fiables et fluides, capables d'offrir une vraie qualité d'usage sur iOS comme sur Android.",
            "iOS & Android": "iOS et Android",
            "Cross-Platform": "Multiplateforme",
            "Offline Support": "Fonctionnement hors ligne",
            "React Native & Flutter": "React Native et Flutter",
            "App Store Optimization": "Optimisation des stores",
            "Push Notifications": "Notifications intelligentes",
            "Analytics Integration": "Intégration des analytics",
            "Trending": "En forte demande",
            "Digital Transformation": "Transformation numérique",
            "Complete business modernization": "Moderniser votre organisation de bout en bout",
            "Complete digital solutions to modernize your business operations and improve efficiency across all departments and processes.": "Nous vous aidons à repenser vos outils, vos flux et vos opérations pour gagner en efficacité, en visibilité et en capacité d'exécution.",
            "Cloud Migration": "Migration cloud",
            "Automation": "Automatisation",
            "Analytics": "Analytique",
            "Cloud Infrastructure": "Architecture cloud",
            "Process Automation": "Automatisation des processus",
            "Data Analytics": "Analyse des données",
            "Security Implementation": "Mise en œuvre de la sécurité",
            "Consulting & Support": "Conseil & accompagnement",
            "Strategic guidance & ongoing support": "Vision produit et support dans la durée",
            "Strategic technology consulting and ongoing support to ensure your digital initiatives deliver maximum value and ROI.": "Nous vous aidons à prendre les bonnes décisions techniques, structurer vos priorités et faire avancer vos projets numériques avec un accompagnement durable.",
            "Strategy": "Stratégie",
            "24/7 Support": "Assistance 24/7",
            "Training": "Formation",
            "Technology Strategy": "Stratégie technologique",
            "Project Management": "Gestion de projet",
            "Team Training": "Formation des équipes",
            "Performance Optimization": "Optimisation des performances"
        });

        Object.assign(textTranslations.fr, {
            "Our Development Process": "Notre processus de développement",
            "Streamlined workflow ensuring quality delivery and client satisfaction": "Un processus clair pour livrer vite, bien et sans mauvaise surprise",
            "Discovery & Planning": "Découverte & planification",
            "We analyze your requirements and create a comprehensive project roadmap.": "Nous cadrons vos besoins, vos objectifs et vos contraintes afin de construire une feuille de route réaliste.",
            "Design & Prototype": "Design & prototype",
            "Creating user-friendly designs and interactive prototypes for validation.": "Nous concevons des interfaces claires et des prototypes interactifs pour valider l'expérience avant le développement.",
            "Development & Testing": "Développement & tests",
            "Building robust solutions with rigorous testing and quality assurance.": "Nous développons des solutions solides, testées et prêtes à tenir la charge dans la durée.",
            "Deployment & Support": "Déploiement & support",
            "Launching your solution and providing ongoing maintenance and support.": "Nous mettons votre solution en ligne puis restons à vos côtés pour le suivi, l'évolution et la maintenance.",
            "Average Response Time": "Temps moyen de réponse",
            "Expert Developers": "Développeurs experts",
            "Project Success Rate": "Taux de réussite des projets",
            "Free Support": "Support gratuit"
        });

        Object.assign(textTranslations.fr, {
            "Success Stories": "Réalisations clients",
            "Featured Projects": "Projets phares",
            "& Case Studies": "& cas clients",
            "Real-world solutions that drive business growth and digital transformation across Central Africa.": "Des produits digitaux déployés sur le terrain, avec un impact concret sur la croissance, l'efficacité et la transformation des entreprises.",
            "E-Commerce Platform": "Plateforme e-commerce",
            "Sales Growth": "Croissance des ventes",
            "Users": "Utilisateurs",
            "E-Commerce Solution": "Solution e-commerce",
            "Chad's Leading Online Marketplace": "La marketplace de référence au Tchad",
            "Revolutionary e-commerce platform that transformed local retail by connecting buyers and sellers across Chad, featuring advanced payment integration and inventory management optimized for African markets.": "Une plateforme e-commerce pensée pour le marché local, capable de connecter vendeurs et acheteurs à grande échelle avec paiements intégrés, gestion de stock et logistique adaptée au contexte africain.",
            "Local Payment Integration": "Intégration des paiements locaux",
            "Smart Delivery System": "Système de livraison intelligent",
            "Frontend:": "Frontend :",
            "Backend:": "Backend :",
            "Payment:": "Paiement :",
            "View Case Study": "Voir le cas client",
            "Technical Details": "Détails techniques",
            "Web Platform": "Plateforme web",
            "Telemedicine Platform": "Plateforme de télémédecine",
            "Connecting rural communities with healthcare providers through innovative mobile technology.": "Une solution mobile qui rapproche les populations rurales des professionnels de santé et facilite l'accès aux soins.",
            "Completed 2025": "Terminé en 2025",
            "10K+ patients served": "10K+ patients servis",
            "Education Management": "Gestion éducative",
            "Comprehensive school management system with student tracking and parent engagement features.": "Une plateforme scolaire complète pour suivre les élèves, fluidifier l'administration et renforcer la relation avec les parents.",
            "Completed 2024": "Terminé en 2024",
            "15 schools connected": "15 écoles connectées",
            "Enterprise Solution": "Solution d'entreprise",
            "Business Intelligence": "Informatique décisionnelle",
            "Real-time analytics dashboard with advanced reporting and data visualization capabilities.": "Un cockpit décisionnel en temps réel pour suivre la performance, explorer les données et accélérer la prise de décision.",
            "5 enterprises using": "5 entreprises utilisatrices",
            "Fleet Management": "Gestion de flotte",
            "Advanced logistics platform optimized for Central African delivery challenges and infrastructure.": "Une plateforme logistique conçue pour les réalités de terrain en Afrique centrale, avec suivi des véhicules, tournées et opérations de livraison.",
            "200+ vehicles tracked": "200+ véhicules suivis",
            "Logistics App": "Application logistique",
            "Community Network": "Réseau communautaire",
            "Social networking platform designed to connect local communities and facilitate knowledge sharing.": "Un réseau social local pensé pour rapprocher les communautés, structurer les échanges et favoriser le partage de connaissances.",
            "In Development": "En développement",
            "Beta testing phase": "Phase de bêta-test",
            "Social Platform": "Plateforme sociale",
            "Digital Payments": "Paiements numériques",
            "Secure mobile payment solution tailored for the Central African financial ecosystem.": "Une solution de paiement mobile sécurisée, conçue pour s'intégrer aux usages et aux contraintes de l'écosystème financier régional.",
            "25K+ transactions": "25K+ transactions",
            "FinTech Solution": "Solution FinTech",
            "Project Impact Metrics": "L'impact de nos projets",
            "Measurable results from our digital solutions": "Des résultats mesurables obtenus grâce aux solutions livrées",
            "Projects Delivered": "Projets livrés",
            "Users Impacted": "Utilisateurs touchés",
            "Avg. Growth": "Croissance moy.",
            "Satisfaction Rate": "Taux de satisfaction"
        });

        Object.assign(textTranslations.fr, {
            "Our Tech Arsenal": "Notre stack technologique",
            "Cutting-Edge Technologies": "Les technologies",
            "We Master": "que nous maîtrisons",
            "From frontend frameworks to cloud infrastructure, we leverage the most powerful and modern technologies to build exceptional digital solutions.": "Nous sélectionnons les bons outils, frameworks et infrastructures pour construire des produits robustes, maintenables et prêts à évoluer.",
            "Frontend": "Frontend",
            "Modern UI Frameworks": "Frameworks UI modernes",
            "Backend": "Backend",
            "Robust Server Solutions": "Solutions serveur robustes",
            "Mobile": "Mobile",
            "Cross-Platform Apps": "Apps multiplateformes",
            "Infrastructure": "Infrastructure",
            "Cloud & Database": "Cloud & bases de données",
            "Next-Gen Solutions": "Solutions nouvelle génération",
            "We stay ahead of the curve by continuously adopting emerging technologies and best practices to deliver future-ready applications.": "Nous gardons une longueur d'avance en adoptant continuellement les technologies émergentes et les meilleures pratiques pour livrer des applications prêtes pour l'avenir.",
            "AI Integration": "Intégration IA",
            "Microservices Architecture": "Architecture microservices",
            "DevOps & CI/CD": "DevOps & CI/CD",
            "Progressive Web Apps": "Progressive Web Apps"
        });

        Object.assign(textTranslations.fr, {
            "Our Team": "Notre équipe",
            "Meet the Innovators": "Les talents",
            "Behind Assas Digital Systems": "d'Assas Digital Systems",
            "Passionate developers, designers, and strategists working together to transform Chad's digital landscape.": "Une équipe pluridisciplinaire qui conçoit, construit et améliore des produits digitaux utiles pour les entreprises de la région.",
            "CEO & Lead Developer": "CEO & Lead Developer",
            "Full-stack developer with 8+ years experience. Passionate about bringing Silicon Valley innovation to Central Africa.": "Développeur full-stack avec plus de 8 ans d'expérience, engagé dans la création de produits ambitieux et adaptés aux réalités de l'Afrique centrale.",
            "Leadership": "Leadership",
            "Built his first app at age 15": "A créé sa première app à 15 ans",
            "CTO & Mobile Architect": "CTO & architecte mobile",
            "Mobile development expert specializing in Flutter and React Native. Advocates for accessible technology design.": "Experte mobile spécialisée en Flutter et React Native, avec une attention particulière portée à l'accessibilité et à la qualité d'usage.",
            "UX Design": "Design UX",
            "Speaks 4 languages fluently": "Parle 4 langues couramment",
            "Backend Engineer": "Ingénieur backend",
            "Cloud infrastructure specialist with expertise in scalable backend systems and DevOps practices.": "Spécialiste des architectures cloud et des systèmes backend scalables, avec une forte culture DevOps et fiabilité.",
            "Can code for 12 hours straight on coffee": "Peut coder 12 heures d'affilée au café",
            "UI/UX Designer": "Designer UI/UX",
            "Creative designer focused on user-centered design and building intuitive digital experiences for African users.": "Designer créative centrée sur l'utilisateur, qui transforme des idées complexes en expériences simples, claires et engageantes.",
            "Prototyping": "Prototypage",
            "Creates digital art in her free time": "Crée de l'art numérique pendant son temps libre",
            "Team Members": "Membres de l'équipe",
            "Years Combined Experience": "Années d'expérience cumulées",
            "Tech Certifications": "Certifications tech",
            "Passion for Innovation": "Passion pour l'innovation",
            "Insights & Updates": "Actualités & conseils",
            "Latest from Our": "Les nouveautés de notre",
            "Tech Blog": "blog tech",
            "Stay updated with the latest trends, insights, and case studies from the world of technology and digital transformation.": "Retrouvez nos analyses, retours d'expérience et lectures du marché autour du produit, de la tech et de la transformation digitale.",
            "Case Study": "Étude de cas",
            "March 10, 2026": "10 mars 2026",
            "How We Transformed Chad's Largest E-commerce Platform": "Comment nous avons repensé la plus grande plateforme e-commerce du Tchad",
            "Deep dive into our 6-month journey building a scalable e-commerce solution that now serves 50,000+ users across Central Africa.": "Retour détaillé sur six mois de conception et de développement pour bâtir une solution e-commerce scalable aujourd'hui utilisée à grande échelle en Afrique centrale.",
            "8 min read": "8 min de lecture",
            "Read Full Case Study": "Lire le cas client complet",
            "Tech Trends": "Tendances tech",
            "March 8, 2026": "8 mars 2026",
            "Mobile-First Development in Africa: Key Considerations": "Pourquoi le mobile-first reste essentiel en Afrique",
            "Why mobile-first approach is crucial for African markets and how to optimize for low-bandwidth environments.": "Un point de vue terrain sur les contraintes réseau, les usages mobiles et les bonnes pratiques produit pour construire des expériences vraiment adaptées.",
            "5 min read": "5 min de lecture",
            "Read Article": "Lire l'article",
            "Team Spotlight": "Focus équipe",
            "March 5, 2026": "5 mars 2026",
            "From Idea to Launch: Our Development Process": "De l'idée à la mise en ligne : notre méthode",
            "Behind-the-scenes look at how Assas Digital Systems approaches project development, from initial concept to successful deployment.": "Une immersion dans notre façon de cadrer, concevoir, développer et déployer un produit digital sans perdre le sens du besoin métier.",
            "6 min read": "6 min de lecture",
            "E-commerce": "E-commerce",
            "Africa": "Afrique",
            "Process": "Processus",
            "View All Articles": "Voir tous les articles"
        });

        Object.assign(textTranslations.fr, {
            "Get In Touch": "Contactez-nous",
            "Ready to transform your digital presence? Let's discuss how we can help your business succeed.": "Vous avez un projet web, mobile ou produit ? Parlons de vos objectifs et de la meilleure façon de les concrétiser.",
            "Contact Information": "Coordonnées",
            "Location": "Localisation",
            "N'Djamena, Republic of Chad": "N'Djamena, République du Tchad",
            "Central Africa": "Afrique centrale",
            "Phone": "Téléphone",
            "Email": "E-mail",
            "Working Hours": "Horaires de travail",
            "Monday - Friday: 8:00 - 18:00": "Lundi - Vendredi : 8:00 - 18:00",
            "Saturday: 9:00 - 15:00": "Samedi : 9:00 - 15:00",
            "Full Name": "Nom complet",
            "Email Address": "Adresse e-mail",
            "Phone Number": "Numéro de téléphone",
            "Subject": "Sujet",
            "Message": "Message",
            "Tell us about your project...": "Parlez-nous de votre projet...",
            "Send Message": "Envoyer le message",
            "About Assas Digital Systems": "À propos d'Assas Digital Systems",
            "Leading technology company in Chad, dedicated to driving digital transformation across Central Africa through innovative web and mobile solutions.": "Agence technologique basée au Tchad, spécialisée dans la création de solutions web, mobile et digitales pour accompagner la croissance des entreprises en Afrique centrale.",
            "E-Commerce Solutions": "Solutions e-commerce",
            "About Us": "À propos de nous",
            "Quick Links": "Liens rapides",
            "Contact Info": "Coordonnées",
            "Career": "Carrière",
            "© 2026 Assas Digital Systems. All rights reserved. | Proudly serving Chad and Central Africa": "© 2026 Assas Digital Systems. Tous droits réservés. Au service du Tchad et de l'Afrique centrale."
        });

        Object.assign(textTranslations.ar, {
            "Initializing Digital Excellence...": "جاري تهيئة التميز الرقمي...",
            "Chat with us on WhatsApp": "تحدث معنا عبر واتساب",
            "Home": "الرئيسية",
            "About": "من نحن",
            "Services": "الخدمات",
            "Portfolio": "الأعمال",
            "Team": "الفريق",
            "Blog": "المدونة",
            "Contact": "تواصل",
            "Theme": "المظهر",
            "N'Djamena, Chad": "إنجمينا، تشاد",
            "Transforming": "نرسم",
            "Africa's Digital": "مستقبل التحول الرقمي",
            "Landscape": "في إفريقيا",
            "We craft cutting-edge web and mobile applications that empower businesses across Central Africa. From concept to deployment, we turn your digital vision into reality.": "نطوّر مواقع إلكترونية وتطبيقات جوال ومنصات أعمال تساعد الشركات في إفريقيا الوسطى على النمو رقمياً. من التخطيط إلى الإطلاق، نحول الفكرة إلى منتج فعلي.",
            "Projects": "مشاريع",
            "Years": "سنوات",
            "Success": "نجاح",
            "Start Your Project": "ابدأ مشروعك معنا",
            "Watch Demo": "شاهد العرض",
            "Pioneering Technology in Central Africa": "نقود الابتكار التقني في إفريقيا الوسطى",
            "Based in the heart of N'Djamena, Assas Digital Systems is at the forefront of Chad's digital transformation. We combine global technology standards with deep understanding of local markets to deliver exceptional digital solutions.": "تنطلق Assas Digital Systems من إنجمينا لتواكب التحول الرقمي في تشاد. نجمع بين المعايير العالمية وفهم السوق المحلي لبناء حلول رقمية عملية وقابلة للنمو.",
            "Our team of expert developers and designers work with businesses across Chad and Central Africa to create powerful web platforms and mobile applications that drive growth and innovation in our rapidly evolving digital landscape.": "يعمل فريقنا من المطورين والمصممين والاستراتيجيين مع شركات في تشاد وإفريقيا الوسطى لبناء منصات ويب وتطبيقات جوال تدعم النمو وتُبسّط العمليات وتفتح فرصاً جديدة.",
            "Projects Completed": "مشاريع مكتملة",
            "Happy Clients": "عملاء سعداء",
            "Years Experience": "سنوات خبرة",
            "Client Satisfaction": "رضا العملاء",
            "Serving Central Africa": "نخدم إفريقيا الوسطى",
            "What We Offer": "خدماتنا",
            "Comprehensive Digital": "حلول رقمية",
            "Solutions": "تصنع فرقاً",
            "From concept to deployment, we provide end-to-end technology services tailored for African businesses, combining global standards with local market expertise.": "من دراسة الاحتياج إلى الإطلاق، نقدم حلولاً رقمية مصممة لواقع الشركات الإفريقية، تجمع بين الجودة التقنية والفهم الحقيقي للسوق."
        });

        Object.assign(textTranslations.ar, {
            "Most Popular": "الأكثر طلباً",
            "Web Development": "تطوير الويب",
            "Powerful digital presence for your business": "حضور رقمي احترافي يدعم نمو أعمالك",
            "Custom websites and web applications built with cutting-edge technology to establish your strong online presence and drive business growth.": "نصمم ونطوّر مواقع وتطبيقات ويب تمنحك حضوراً رقمياً أقوى، وتجربة استخدام أفضل، وأساساً تقنياً يساعد عملك على التوسع.",
            "Mobile-First Design": "تصميم يركز على الهاتف",
            "SEO Optimized": "مهيأ لمحركات البحث",
            "Secure & Fast": "آمن وسريع",
            "Key Features:": "الميزات الأساسية:",
            "Responsive Design": "تصميم متجاوب",
            "E-commerce Solutions": "حلول التجارة الإلكترونية",
            "CMS Development": "تطوير أنظمة إدارة المحتوى",
            "Multi-language Support": "دعم متعدد اللغات",
            "Get Started": "تواصل مع الفريق",
            "Mobile App Development": "تطوير تطبيقات الجوال",
            "Native & cross-platform applications": "تطبيقات أصلية أو متعددة المنصات",
            "Native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android devices.": "نطوّر تطبيقات جوال سريعة وموثوقة تمنح المستخدم تجربة سلسة على iOS وAndroid، سواء كانت أصلية أو متعددة المنصات.",
            "iOS & Android": "iOS وAndroid",
            "Cross-Platform": "متعدد المنصات",
            "Offline Support": "تشغيل دون اتصال",
            "React Native & Flutter": "React Native وFlutter",
            "App Store Optimization": "تحسين متاجر التطبيقات",
            "Push Notifications": "إشعارات ذكية",
            "Analytics Integration": "دمج أدوات التحليل",
            "Trending": "الأكثر طلباً",
            "Digital Transformation": "التحول الرقمي",
            "Complete business modernization": "تحديث أعمالك من الأساس",
            "Complete digital solutions to modernize your business operations and improve efficiency across all departments and processes.": "نساعدك على تطوير أدواتك وعملياتك الداخلية لتعمل فرقك بكفاءة أعلى ووضوح أفضل وسرعة أكبر في التنفيذ.",
            "Cloud Migration": "الهجرة إلى السحابة",
            "Automation": "الأتمتة",
            "Analytics": "التحليلات",
            "Cloud Infrastructure": "بنية تحتية سحابية",
            "Process Automation": "أتمتة العمليات",
            "Data Analytics": "تحليل البيانات",
            "Security Implementation": "تنفيذ الأمان",
            "Consulting & Support": "الاستشارات والدعم",
            "Strategic guidance & ongoing support": "رؤية تقنية ودعم مستمر",
            "Strategic technology consulting and ongoing support to ensure your digital initiatives deliver maximum value and ROI.": "نساعدك على اتخاذ القرارات التقنية الصحيحة، وترتيب الأولويات، وتحويل المبادرات الرقمية إلى نتائج قابلة للقياس.",
            "Strategy": "الاستراتيجية",
            "24/7 Support": "دعم على مدار الساعة",
            "Training": "التدريب",
            "Technology Strategy": "الاستراتيجية التقنية",
            "Project Management": "إدارة المشاريع",
            "Team Training": "تدريب الفريق",
            "Performance Optimization": "تحسين الأداء"
        });

        Object.assign(textTranslations.ar, {
            "Our Development Process": "عملية التطوير لدينا",
            "Streamlined workflow ensuring quality delivery and client satisfaction": "منهجية عمل واضحة تضمن جودة التنفيذ وراحة العميل في كل مرحلة",
            "Discovery & Planning": "الاكتشاف والتخطيط",
            "We analyze your requirements and create a comprehensive project roadmap.": "نبدأ بفهم الأهداف والتحديات ثم نبني خارطة طريق عملية تناسب المشروع والسوق.",
            "Design & Prototype": "التصميم والنموذج الأولي",
            "Creating user-friendly designs and interactive prototypes for validation.": "نصمم واجهات واضحة ونماذج أولية تفاعلية تساعدك على رؤية المنتج قبل بدء التطوير.",
            "Development & Testing": "التطوير والاختبار",
            "Building robust solutions with rigorous testing and quality assurance.": "نطوّر حلولاً قوية ومهيأة للنمو، مع اختبارات دقيقة وضمان جودة حقيقي.",
            "Deployment & Support": "الإطلاق والدعم",
            "Launching your solution and providing ongoing maintenance and support.": "نطلق المنتج ثم نواصل دعمه وتطويره وتحسينه وفق احتياجات الاستخدام الفعلي.",
            "Average Response Time": "متوسط وقت الاستجابة",
            "Expert Developers": "مطورون خبراء",
            "Project Success Rate": "معدل نجاح المشاريع",
            "Free Support": "دعم مجاني"
        });

        Object.assign(textTranslations.ar, {
            "Success Stories": "نجاحات عملائنا",
            "Featured Projects": "مشاريع مميزة",
            "& Case Studies": "ودراسات حالة",
            "Real-world solutions that drive business growth and digital transformation across Central Africa.": "حلول رقمية مطبقة على أرض الواقع، تنعكس مباشرة على النمو والكفاءة والتحول الرقمي.",
            "E-Commerce Platform": "منصة تجارة إلكترونية",
            "Sales Growth": "نمو المبيعات",
            "Users": "مستخدمون",
            "E-Commerce Solution": "حل تجارة إلكترونية",
            "Chad's Leading Online Marketplace": "السوق الإلكتروني الأبرز في تشاد",
            "Revolutionary e-commerce platform that transformed local retail by connecting buyers and sellers across Chad, featuring advanced payment integration and inventory management optimized for African markets.": "منصة تجارة إلكترونية مصممة للسوق المحلي، تربط بين البائعين والمشترين على نطاق واسع مع نظام مدفوعات متكامل وإدارة مخزون وتجربة تشغيل مناسبة للسوق الإفريقية.",
            "Local Payment Integration": "دمج المدفوعات المحلية",
            "Smart Delivery System": "نظام توصيل ذكي",
            "Frontend:": "الواجهة الأمامية:",
            "Backend:": "الواجهة الخلفية:",
            "Payment:": "الدفع:",
            "View Case Study": "عرض دراسة الحالة",
            "Technical Details": "التفاصيل التقنية",
            "Web Platform": "منصة ويب",
            "Telemedicine Platform": "منصة طب عن بُعد",
            "Connecting rural communities with healthcare providers through innovative mobile technology.": "حل رقمي يقرّب الخدمات الصحية من المجتمعات الريفية ويجعل الوصول إلى الرعاية أسهل وأكثر سرعة.",
            "Completed 2025": "اكتمل في 2025",
            "10K+ patients served": "خدمة أكثر من 10 آلاف مريض",
            "Education Management": "إدارة التعليم",
            "Comprehensive school management system with student tracking and parent engagement features.": "منصة متكاملة لإدارة المدارس ومتابعة الطلاب وتحسين التواصل مع أولياء الأمور.",
            "Completed 2024": "اكتمل في 2024",
            "15 schools connected": "ربط 15 مدرسة",
            "Enterprise Solution": "حل مؤسسي",
            "Business Intelligence": "ذكاء الأعمال",
            "Real-time analytics dashboard with advanced reporting and data visualization capabilities.": "لوحة تحكم تحليلية فورية تساعد الفرق والإدارات على فهم الأداء واتخاذ القرار بسرعة.",
            "5 enterprises using": "تستخدمه 5 مؤسسات",
            "Fleet Management": "إدارة الأسطول",
            "Advanced logistics platform optimized for Central African delivery challenges and infrastructure.": "منصة لوجستية مصممة لواقع التوصيل في إفريقيا الوسطى، مع تتبع للمركبات وتنظيم للعمليات ومتابعة ميدانية دقيقة.",
            "200+ vehicles tracked": "تتبع أكثر من 200 مركبة",
            "Logistics App": "تطبيق لوجستي",
            "Community Network": "شبكة مجتمعية",
            "Social networking platform designed to connect local communities and facilitate knowledge sharing.": "منصة اجتماعية محلية تهدف إلى ربط المجتمعات وتسهيل تبادل المعرفة والمبادرات والخبرات.",
            "In Development": "قيد التطوير",
            "Beta testing phase": "مرحلة الاختبار التجريبي",
            "Social Platform": "منصة اجتماعية",
            "Digital Payments": "المدفوعات الرقمية",
            "Secure mobile payment solution tailored for the Central African financial ecosystem.": "حل دفع رقمي آمن يتوافق مع الاستخدامات المحلية واحتياجات المنظومة المالية في المنطقة.",
            "25K+ transactions": "أكثر من 25 ألف معاملة",
            "FinTech Solution": "حل تقني مالي",
            "Project Impact Metrics": "أثر مشاريعنا",
            "Measurable results from our digital solutions": "نتائج قابلة للقياس حققتها الحلول التي طوّرناها",
            "Projects Delivered": "مشاريع تم تسليمها",
            "Users Impacted": "مستخدمون مستفيدون",
            "Avg. Growth": "متوسط النمو",
            "Satisfaction Rate": "معدل الرضا"
        });

        Object.assign(textTranslations.ar, {
            "Our Tech Arsenal": "تقنياتنا الأساسية",
            "Cutting-Edge Technologies": "أحدث التقنيات",
            "We Master": "نتقنها",
            "From frontend frameworks to cloud infrastructure, we leverage the most powerful and modern technologies to build exceptional digital solutions.": "نختار الأدوات والأطر والبنية التحتية المناسبة لكل مشروع حتى نبني منتجات قوية، قابلة للتوسع، وسهلة التطوير مستقبلاً.",
            "Frontend": "الواجهة الأمامية",
            "Modern UI Frameworks": "أطر واجهات حديثة",
            "Backend": "الواجهة الخلفية",
            "Robust Server Solutions": "حلول خوادم قوية",
            "Mobile": "الجوال",
            "Cross-Platform Apps": "تطبيقات متعددة المنصات",
            "Infrastructure": "البنية التحتية",
            "Cloud & Database": "السحابة وقواعد البيانات",
            "Next-Gen Solutions": "حلول الجيل القادم",
            "We stay ahead of the curve by continuously adopting emerging technologies and best practices to deliver future-ready applications.": "نحافظ على تقدمنا من خلال تبني التقنيات الناشئة وأفضل الممارسات باستمرار لتقديم تطبيقات جاهزة للمستقبل.",
            "AI Integration": "دمج الذكاء الاصطناعي",
            "Microservices Architecture": "هندسة الخدمات المصغرة",
            "DevOps & CI/CD": "DevOps وCI/CD",
            "Progressive Web Apps": "تطبيقات ويب تقدمية"
        });

        Object.assign(textTranslations.ar, {
            "Our Team": "فريقنا",
            "Meet the Innovators": "تعرّف على العقول",
            "Behind Assas Digital Systems": "التي تقود Assas Digital Systems",
            "Passionate developers, designers, and strategists working together to transform Chad's digital landscape.": "فريق متعدد التخصصات يعمل معاً لبناء منتجات رقمية مفيدة وقابلة للنمو للشركات في تشاد والمنطقة.",
            "CEO & Lead Developer": "المدير التنفيذي وكبير المطورين",
            "Full-stack developer with 8+ years experience. Passionate about bringing Silicon Valley innovation to Central Africa.": "مطوّر Full-stack بخبرة تتجاوز 8 سنوات، يركز على بناء منتجات رقمية طموحة تناسب احتياجات السوق المحلي.",
            "Leadership": "القيادة",
            "Built his first app at age 15": "بنى أول تطبيق له في سن 15",
            "CTO & Mobile Architect": "المديرة التقنية ومعمارية الجوال",
            "Mobile development expert specializing in Flutter and React Native. Advocates for accessible technology design.": "خبيرة في تطوير تطبيقات الجوال باستخدام Flutter وReact Native، وتؤمن بأن التجربة الجيدة يجب أن تكون بسيطة ومتاحة للجميع.",
            "UX Design": "تصميم تجربة المستخدم",
            "Speaks 4 languages fluently": "تتحدث 4 لغات بطلاقة",
            "Backend Engineer": "مهندس خلفية",
            "Cloud infrastructure specialist with expertise in scalable backend systems and DevOps practices.": "متخصص في البنية التحتية السحابية والأنظمة الخلفية القابلة للتوسع، مع خبرة قوية في التشغيل والاعتمادية وDevOps.",
            "Can code for 12 hours straight on coffee": "يمكنه البرمجة 12 ساعة متواصلة بالقهوة",
            "UI/UX Designer": "مصممة UI/UX",
            "Creative designer focused on user-centered design and building intuitive digital experiences for African users.": "مصممة مبدعة تترجم الأفكار المعقدة إلى تجارب رقمية واضحة وسهلة وملائمة للمستخدمين في السوق الإفريقية.",
            "Prototyping": "النمذجة الأولية",
            "Creates digital art in her free time": "تصنع فناً رقمياً في وقت فراغها",
            "Team Members": "أعضاء الفريق",
            "Years Combined Experience": "سنوات الخبرة المشتركة",
            "Tech Certifications": "شهادات تقنية",
            "Passion for Innovation": "شغف بالابتكار",
            "Insights & Updates": "مقالات ورؤى",
            "Latest from Our": "أحدث ما ننشره في",
            "Tech Blog": "مدونتنا التقنية",
            "Stay updated with the latest trends, insights, and case studies from the world of technology and digital transformation.": "تابع مقالاتنا ودراساتنا العملية حول بناء المنتجات الرقمية والتقنية والتحول الرقمي في الأسواق الناشئة.",
            "Case Study": "دراسة حالة",
            "March 10, 2026": "10 مارس 2026",
            "How We Transformed Chad's Largest E-commerce Platform": "كيف أعدنا بناء أكبر منصة تجارة إلكترونية في تشاد",
            "Deep dive into our 6-month journey building a scalable e-commerce solution that now serves 50,000+ users across Central Africa.": "نستعرض هنا رحلة استمرت 6 أشهر لبناء منصة تجارة إلكترونية قابلة للتوسع تخدم اليوم عدداً كبيراً من المستخدمين في إفريقيا الوسطى.",
            "8 min read": "8 دقائق قراءة",
            "Read Full Case Study": "قراءة دراسة الحالة الكاملة",
            "Tech Trends": "اتجاهات تقنية",
            "March 8, 2026": "8 مارس 2026",
            "Mobile-First Development in Africa: Key Considerations": "لماذا يبقى نهج الجوال أولاً أساسياً في إفريقيا",
            "Why mobile-first approach is crucial for African markets and how to optimize for low-bandwidth environments.": "رؤية عملية حول سلوك المستخدمين، وضعف الاتصال، وكيفية بناء تجارب رقمية تعمل بكفاءة في الواقع اليومي.",
            "5 min read": "5 دقائق قراءة",
            "Read Article": "اقرأ المقال",
            "Team Spotlight": "تسليط الضوء على الفريق",
            "March 5, 2026": "5 مارس 2026",
            "From Idea to Launch: Our Development Process": "من الفكرة إلى الإطلاق: كيف نعمل",
            "Behind-the-scenes look at how Assas Digital Systems approaches project development, from initial concept to successful deployment.": "نظرة من الداخل على طريقتنا في فهم الاحتياج، وتصميم المنتج، وتطويره، ثم إطلاقه بشكل منظم وعملي.",
            "6 min read": "6 دقائق قراءة",
            "E-commerce": "التجارة الإلكترونية",
            "Africa": "إفريقيا",
            "Process": "العملية",
            "View All Articles": "عرض كل المقالات"
        });

        Object.assign(textTranslations.ar, {
            "Get In Touch": "تواصل معنا",
            "Ready to transform your digital presence? Let's discuss how we can help your business succeed.": "هل لديك مشروع ويب أو تطبيق أو منتج رقمي؟ تحدث معنا وسنساعدك على تحويله إلى حل واضح وقابل للتنفيذ.",
            "Contact Information": "معلومات التواصل",
            "Location": "الموقع",
            "N'Djamena, Republic of Chad": "إنجمينا، جمهورية تشاد",
            "Central Africa": "إفريقيا الوسطى",
            "Phone": "الهاتف",
            "Email": "البريد الإلكتروني",
            "Working Hours": "ساعات العمل",
            "Monday - Friday: 8:00 - 18:00": "الاثنين - الجمعة: 8:00 - 18:00",
            "Saturday: 9:00 - 15:00": "السبت: 9:00 - 15:00",
            "Full Name": "الاسم الكامل",
            "Email Address": "عنوان البريد الإلكتروني",
            "Phone Number": "رقم الهاتف",
            "Subject": "الموضوع",
            "Message": "الرسالة",
            "Tell us about your project...": "حدثنا عن مشروعك...",
            "Send Message": "إرسال الرسالة",
            "About Assas Digital Systems": "حول Assas Digital Systems",
            "Leading technology company in Chad, dedicated to driving digital transformation across Central Africa through innovative web and mobile solutions.": "شركة تقنية في تشاد متخصصة في تطوير حلول الويب والجوال والمنتجات الرقمية لمساعدة الشركات على النمو والتحول بثقة.",
            "E-Commerce Solutions": "حلول التجارة الإلكترونية",
            "About Us": "من نحن",
            "Quick Links": "روابط سريعة",
            "Contact Info": "معلومات الاتصال",
            "Career": "الوظائف",
            "© 2026 Assas Digital Systems. All rights reserved. | Proudly serving Chad and Central Africa": "© 2026 Assas Digital Systems. جميع الحقوق محفوظة. نخدم تشاد وإفريقيا الوسطى بكل فخر."
        });

        Object.assign(textTranslations.fr, {
            "Mobile App": "Application mobile",
            "48hrs": "48h",
            "3 months": "3 mois",
            "Scroll to explore": "Faites défiler pour explorer"
        });

        Object.assign(textTranslations.ar, {
            "Mobile App": "تطبيق جوال",
            "48hrs": "48 ساعة",
            "3 months": "3 أشهر",
            "Scroll to explore": "مرر للاستكشاف"
        });

        applyTranslations(getInitialLanguage());

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileSlideMenu = document.getElementById('mobile-slide-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const body = document.body;

        function toggleMobileMenu() {
            mobileMenuBtn.classList.toggle('active');
            mobileSlideMenu.classList.toggle('active');
            body.style.overflow = mobileSlideMenu.classList.contains('active') ? 'hidden' : '';
        }

        mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
        mobileMenuClose?.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-menu-item').forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu();
            });
        });

        // Dock navigation active state
        function updateDockNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const dockItems = document.querySelectorAll('.dock-item[href]');
            
            let current = 'home';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            dockItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        }

        // Theme switcher
        const themeSwitch = document.querySelector('.theme-switch');
        let currentTheme = 'light';

        themeSwitch?.addEventListener('click', () => {
            if (currentTheme === 'light') {
                document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
                currentTheme = 'dark';
            } else {
                document.documentElement.style.filter = '';
                currentTheme = 'light';
            }
        });

        // Parallax effect for hero shapes
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.shape');
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * (-0.1 - index * 0.05);
                element.style.transform = `translateY(${rate}px)`;
            });
        }

        // Dock navigation hide/show on scroll
        let lastScrollTop = 0;
        const dockNav = document.getElementById('dock-nav');

        function handleDockScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (window.innerWidth > 768) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    dockNav.style.transform = 'translateX(-50%) translateY(100px)';
                    dockNav.style.opacity = '0';
                } else {
                    // Scrolling up
                    dockNav.style.transform = 'translateX(-50%) translateY(0)';
                    dockNav.style.opacity = '1';
                }
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }

        // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 50%;
                    animation: float-particle ${5 + Math.random() * 10}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                particlesContainer.appendChild(particle);
            }
        }

        // Add particle animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
                50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // CTA button actions
        document.querySelector('.cta-primary')?.addEventListener('click', () => {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });

        document.querySelector('.cta-secondary')?.addEventListener('click', () => {
            alert(t('demoAlert'));
        });

        // Service CTA buttons
        document.querySelectorAll('.service-cta').forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceCard = e.target.closest('.service-card-modern');
                const serviceName = serviceCard?.querySelector('h3')?.textContent || 'service';
                
                // Scroll to contact section with service info
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Optional: Pre-fill contact form subject
                setTimeout(() => {
                    const messageField = document.querySelector('textarea[name="message"]');
                    if (messageField) {
                        messageField.value = t('serviceInterest', { serviceName });
                        messageField.focus();
                    }
                }, 800);
            });
        });

        // Scroll reveal animation
        function reveal() {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }

        // Animate floating cards on hover
        document.querySelectorAll('.floating-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.animationPlayState = 'paused';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.animationPlayState = 'running';
            });
        });

        // Event listeners
        window.addEventListener('scroll', () => {
            updateDockNavigation();
            handleDockScroll();
            updateParallax();
            reveal();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileSlideMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Initialize
        window.addEventListener('load', () => {
            updateDockNavigation();
            createParticles();
            reveal();
            
            // Animate hero elements
            const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-stats, .hero-actions');
            heroElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease';
                element.style.transitionDelay = `${index * 0.1}s`;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            });
        });

        // Animate statistics on scroll
        function animateStats() {
            const stats = document.querySelectorAll('.stat-number');

            stats.forEach(stat => {
                if (stat.dataset.animated === 'true') {
                    return;
                }

                const originalText = stat.textContent.trim();
                const match = originalText.match(/(\d+)/);
                if (!match) {
                    return;
                }

                const finalNumber = Number.parseInt(match[1], 10);
                const prefix = originalText.slice(0, match.index);
                const suffix = originalText.slice(match.index + match[1].length);
                const increment = Math.max(1, Math.ceil(finalNumber / 50));
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        current = finalNumber;
                        clearInterval(timer);
                        stat.dataset.animated = 'true';
                    }
                    stat.textContent = `${prefix}${current}${suffix}`;
                }, 50);
            });
        }

        // Trigger stats animation when about section is visible
        const aboutSection = document.querySelector('.about');
        let statsAnimated = false;
        
        if (aboutSection) {
            window.addEventListener('scroll', () => {
                if (!statsAnimated) {
                    const rect = aboutSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom >= 0) {
                        animateStats();
                        statsAnimated = true;
                    }
                }
            });
        }

        // Loading Screen Animation
        window.addEventListener('load', function() {
            const loadingScreen = document.getElementById('loading-screen');
            
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger page animations after loading
                    triggerPageAnimations();
                }, 500);
            }, 1500);
        });

        // Scroll Progress Indicator
        function updateScrollProgress() {
            const scrollProgress = document.getElementById('scroll-progress');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            scrollProgress.style.width = scrollPercent + '%';
        }

        window.addEventListener('scroll', updateScrollProgress);

        // WhatsApp Integration
        const whatsappFloat = document.getElementById('whatsapp-float');
        whatsappFloat.addEventListener('click', function() {
            const phoneNumber = '+23566XXXXXX'; // Replace with actual number
            const message = encodeURIComponent(t('whatsappMessage'));
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });

        // Touch Gesture Support
        let startX, startY, currentX, currentY;
        let isSwipeEnabled = false;

        // Add touch-friendly classes
        document.querySelectorAll('button, .cta-primary, .cta-secondary, .service-cta').forEach(element => {
            element.classList.add('touch-friendly');
        });

        // Swipe Navigation for Portfolio
        const portfolioGrid = document.querySelector('.portfolio-grid-modern');
        if (portfolioGrid) {
            portfolioGrid.classList.add('swipeable');
            
            portfolioGrid.addEventListener('touchstart', handleTouchStart, { passive: true });
            portfolioGrid.addEventListener('touchmove', handleTouchMove, { passive: true });
            portfolioGrid.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        function handleTouchStart(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipeEnabled = true;
        }

        function handleTouchMove(e) {
            if (!isSwipeEnabled) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Prevent vertical scroll when swiping horizontally
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                e.preventDefault();
            }
        }

        function handleTouchEnd(e) {
            if (!isSwipeEnabled) return;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swiped left - next
                        navigatePortfolio('next');
                    } else {
                        // Swiped right - prev
                        navigatePortfolio('prev');
                    }
                }
            }
            
            isSwipeEnabled = false;
        }

        function navigatePortfolio(direction) {
            const cards = document.querySelectorAll('.project-card');
            const visibleCard = document.querySelector('.project-card.active') || cards[0];
            let index = Array.from(cards).indexOf(visibleCard);
            
            // Remove current active state
            cards.forEach(card => card.classList.remove('active'));
            
            if (direction === 'next') {
                index = (index + 1) % cards.length;
            } else {
                index = (index - 1 + cards.length) % cards.length;
            }
            
            // Add active state to new card
            cards[index].classList.add('active');
            cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Pull to Refresh (for mobile)
        let startPullY = 0;
        let pullDistance = 0;
        let isPulling = false;

        document.addEventListener('touchstart', function(e) {
            if (window.scrollY === 0) {
                startPullY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (isPulling && window.scrollY === 0) {
                pullDistance = e.touches[0].clientY - startPullY;
                
                if (pullDistance > 0) {
                    const pullIndicator = document.querySelector('.pull-indicator');
                    if (!pullIndicator) {
                        createPullIndicator();
                    }
                    
                    const indicator = document.querySelector('.pull-indicator');
                    if (pullDistance > 60) {
                        indicator.classList.add('active');
                        indicator.innerHTML = `<i class="fas fa-sync-alt"></i><span>${t('releaseToRefresh')}</span>`;
                    } else {
                        indicator.classList.remove('active');
                        indicator.innerHTML = `<i class="fas fa-arrow-down"></i><span>${t('pullToRefresh')}</span>`;
                    }
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (isPulling && pullDistance > 60) {
                refreshPage();
            }
            
            const pullIndicator = document.querySelector('.pull-indicator');
            if (pullIndicator) {
                pullIndicator.remove();
            }
            
            isPulling = false;
            pullDistance = 0;
        }, { passive: true });

        function createPullIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'pull-indicator';
            indicator.innerHTML = `<i class="fas fa-arrow-down"></i><span>${t('pullToRefresh')}</span>`;
            document.body.appendChild(indicator);
        }

        function refreshPage() {
            // Simulate refresh with loading animation
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('fade-out');
            
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }

        // Page Transition Animations
        function triggerPageAnimations() {
            // Animate hero elements with stagger
            const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-stats, .hero-actions');
            heroElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.8s ease';
                element.style.transitionDelay = `${index * 0.15}s`;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            });

            // Animate technology cards with stagger
            const techCards = document.querySelectorAll('.tech-card-floating');
            techCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px) scale(0.8)';
                card.style.transition = 'all 0.6s ease';
                card.style.transitionDelay = `${0.5 + (index * 0.1)}s`;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 100);
            });
        }

        // Blog Post Interactions
        document.querySelectorAll('.blog-post').forEach(post => {
            post.addEventListener('click', function() {
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'ripple-effect';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(59, 130, 246, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Team Member Interactions
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('mouseenter', function() {
                const avatar = this.querySelector('.avatar-placeholder');
                avatar.style.transform = 'rotateY(180deg)';
            });
            
            member.addEventListener('mouseleave', function() {
                const avatar = this.querySelector('.avatar-placeholder');
                avatar.style.transform = 'rotateY(0)';
            });
        });

        // Enhanced Button Interactions
        document.querySelectorAll('button, .cta-primary, .cta-secondary').forEach(button => {
            button.addEventListener('mousedown', function(e) {
                // Create ripple effect
                const ripple = document.createElement('div');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.position = 'absolute';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation CSS
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        // Enhanced Form Validation with Real-time Feedback
        const contactForm = document.querySelector('form');
        if (contactForm) {
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    validateField(this);
                });
                
                input.addEventListener('blur', function() {
                    validateField(this);
                });
            });
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });
                
                if (isValid) {
                    submitForm(this);
                }
            });
        }

        function validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;
            let messageKey = '';
            
            // Remove existing validation styling
            field.classList.remove('valid', 'invalid');
            const existingMessage = field.parentNode.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Check if required field is empty
            if (field.required && !value) {
                isValid = false;
                messageKey = 'validationRequired';
            }
            // Email validation
            else if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    messageKey = 'validationEmail';
                }
            }
            // Phone validation
            else if (type === 'tel' && value) {
                const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    messageKey = 'validationPhone';
                }
            }
            // Text length validation
            else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
                isValid = false;
                messageKey = 'validationMessageLength';
            }
            
            // Apply validation styling
            if (isValid && value) {
                field.classList.add('valid');
            } else if (!isValid) {
                field.classList.add('invalid');
                
                // Add validation message
                const messageElement = document.createElement('div');
                messageElement.className = 'validation-message';
                messageElement.dataset.messageKey = messageKey;
                messageElement.textContent = t(messageKey);
                messageElement.style.color = 'var(--danger-color)';
                messageElement.style.fontSize = '0.8rem';
                messageElement.style.marginTop = '5px';
                field.parentNode.appendChild(messageElement);
            }
            
            return isValid;
        }

        function submitForm(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('sending')}`;
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                showNotification(t('messageSent'), 'success');
                form.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Remove validation classes
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
            }, 2000);
        }

        function showNotification(message, type) {
            const notification = document.createElement('div');
            const isRtl = document.documentElement.dir === 'rtl';
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = isRtl ? 'auto' : '20px';
            notification.style.left = isRtl ? '20px' : 'auto';
            notification.style.background = type === 'success' ? 'var(--success-color)' : 'var(--danger-color)';
            notification.style.color = 'white';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '10px';
            notification.style.boxShadow = 'var(--shadow)';
            notification.style.zIndex = '10000';
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.gap = '10px';
            notification.style.transform = isRtl ? 'translateX(-100%)' : 'translateX(100%)';
            notification.style.transition = 'transform 0.3s ease';
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Auto remove
            setTimeout(() => {
                notification.style.transform = isRtl ? 'translateX(-100%)' : 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 4000);
        }

        // Initialize all animations and interactions
        window.addEventListener('load', () => {
            updateScrollProgress();
            
            // Add touch-friendly classes to all interactive elements
            document.querySelectorAll('button, a, .card, .team-member, .blog-post').forEach(element => {
                element.classList.add('touch-friendly');
            });
        });
