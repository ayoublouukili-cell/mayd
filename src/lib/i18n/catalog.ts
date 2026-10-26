import { showroomSourceMessages } from "./showroom-messages";
import { trialMessages } from "../trial-messages";
// Shared French source keys; English and Modern Standard Arabic are authored below.
const rows = `
Votre message est prêt sur WhatsApp.|Your message is ready in WhatsApp.|رسالتك جاهزة على واتساب.
Appuyez sur Envoyer dans WhatsApp pour nous transmettre votre demande.|Tap Send in WhatsApp to send us your request.|اضغط على إرسال في واتساب لإرسال طلبك إلينا.
Ouvrir WhatsApp|Open WhatsApp|افتح واتساب
Votre demande s'ouvre dans WhatsApp. Vous confirmez l'envoi.|Your request opens in WhatsApp. You confirm sending it.|يُفتح طلبك في واتساب لتأكيد إرساله.
Continuer sur WhatsApp|Continue on WhatsApp|متابعة عبر واتساب
Un autre regard sur nos projets|A new perspective on our projects|نظرة جديدة إلى مشاريعنا
Explorez autrement|A different way to explore|اكتشف بطريقة مختلفة
Un tour.|One turn.|دورة واحدة.
Un nouvel univers.|A whole new world.|عالم جديد.
Faites défiler. Le téléphone tourne, les projets se révèlent. Une nouvelle perspective à chaque tour.|Scroll to turn the phone and reveal our projects. A new perspective with every turn.|مرّر الصفحة ليدور الهاتف وتظهر مشاريعنا. منظور جديد مع كل دورة.
Explorer les projets à 360 degrés|Explore projects in 360 degrees|اكتشف المشاريع بزاوية 360 درجة
Au fil du scroll|Scroll to explore|مرّر لتكتشف
Projet publié|Published project|مشروع منشور
Découvrir le projet|Discover the project|اكتشف المشروع
Explorer le concept|Explore the concept|اكتشف التصور
Projet précédent|Previous project|المشروع السابق
Projet suivant|Next project|المشروع التالي
Choisir un projet|Choose a project|اختر مشروعًا
La créativité, sous tous les angles.|Creativity from every angle.|الإبداع من كل الزوايا.
L'essentiel|The essentials|الأساسيات
Une expérience à votre image.|An experience that feels like you.|تجربة تعبّر عنك.
Chaque détail compte.|Every detail matters.|كل تفصيل يصنع الفرق.
Les projets clients sont temporairement indisponibles. Les démonstrations restent accessibles.|Client projects are temporarily unavailable. Demos are still accessible.|مشاريع العملاء غير متاحة مؤقتًا. يمكنك تصفح النماذج التجريبية.
Login|Login|دخول
Connexion admin|Admin login|دخول المسؤول
Identifiant|Username|اسم المستخدم
Connectez-vous avec votre identifiant et votre mot de passe.|Sign in with your username and password.|سجّل الدخول باسم المستخدم وكلمة المرور.
Afficher le mot de passe|Show password|إظهار كلمة المرور
Masquer le mot de passe|Hide password|إخفاء كلمة المرور
Connexion en cours…|Signing in…|جارٍ تسجيل الدخول…
Identifiant ou mot de passe incorrect.|Incorrect username or password.|اسم المستخدم أو كلمة المرور غير صحيحة.
Le compte administrateur doit être activé dans Supabase.|The admin account must be activated in Supabase.|يجب تفعيل حساب المسؤول في Supabase.
Ce compte ne dispose pas des droits administrateur.|This account does not have admin access.|هذا الحساب لا يملك صلاحيات المسؤول.
Connexion impossible. Réessayez dans un instant.|Unable to sign in. Try again shortly.|تعذر تسجيل الدخول. حاول مجددًا بعد قليل.
Langue|Language|اللغة
Passer au thème clair|Switch to light theme|التبديل إلى المظهر الفاتح
Passer au thème sombre|Switch to dark theme|التبديل إلى المظهر الداكن
Clair|Light|فاتح
Sombre|Dark|داكن
Accueil|Home|الرئيسية
Services|Services|الخدمات
Réalisations|Our work|أعمالنا
Réalisation|Project|مشروع
Explorez onze concepts fictifs : immobilier, gaming, coiffure, location de voitures, restaurant, sport et commerce. Sites web, Instagram, Facebook et TikTok.|Explore eleven fictional concepts across real estate, gaming, hair, car rental, restaurants, sport and retail. Websites, Instagram, Facebook and TikTok.|استكشف أحد عشر تصوراً افتراضياً للعقارات والألعاب وتصفيف الشعر وتأجير السيارات والمطاعم والرياضة والتجارة. مواقع إلكترونية وInstagram وFacebook وTikTok.
Démonstrations|Demos|نماذج تجريبية
À propos|About us|من نحن
Contact|Contact|تواصل معنا
accueil|home|الرئيسية
Champ obligatoire.|This field is required.|هذا الحقل مطلوب.
Indiquez un email valide.|Please enter a valid email address.|يرجى إدخال بريد إلكتروني صالح.
Valeur invalide.|Please enter a valid value.|يرجى إدخال قيمة صالحة.
Choisissez une date à partir d’aujourd’hui.|Please choose today or a later date.|يرجى اختيار تاريخ اليوم أو تاريخ لاحق.
Minimum deux caractères.|Please enter at least two characters.|يرجى إدخال حرفين على الأقل.
Connexion|Sign in|تسجيل الدخول
Connexion · Espace administrateur|Sign in · Admin area|تسجيل الدخول · لوحة الإدارة
Créer le compte administrateur|Create the admin account|إنشاء حساب المسؤول
Accès réservé à l'administrateur du portfolio.|Access is restricted to the portfolio administrator.|الدخول مخصص لمسؤول معرض الأعمال.
Premier accès : le compte créé ici devient l'unique administrateur du site.|First access: the account created here becomes the site’s only administrator.|الدخول الأول: يصبح الحساب المنشأ هنا حساب المسؤول الوحيد للموقع.
Accès privé à l'espace d'administration du portfolio.|Private access to the portfolio admin area.|وصول خاص إلى لوحة إدارة معرض الأعمال.
Gérez vos réalisations, vos médias et vos coordonnées sans toucher au code.|Manage your projects, media and contact details without editing code.|أدر أعمالك ووسائطك وبيانات التواصل دون تعديل الكود.
Espace|Admin|لوحة
administrateur|area|الإدارة
Retour au site|Back to the website|العودة إلى الموقع
Continuer avec Google|Continue with Google|المتابعة عبر Google
Continuer avec Lovable|Continue with Lovable|المتابعة عبر Lovable
ou par email|or by email|أو عبر البريد الإلكتروني
Mot de passe|Password|كلمة المرور
Se connecter|Sign in|تسجيل الدخول
Créer mon compte|Create my account|إنشاء حسابي
J'ai déjà un compte|I already have an account|لدي حساب بالفعل
Première visite ? Créer le compte administrateur|First visit? Create the admin account|الزيارة الأولى؟ أنشئ حساب المسؤول
Adresse email invalide.|Please enter a valid email address.|يرجى إدخال بريد إلكتروني صالح.
Le mot de passe doit contenir au moins 8 caractères.|Your password must contain at least 8 characters.|يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.
Email ou mot de passe incorrect.|Incorrect email or password.|البريد الإلكتروني أو كلمة المرور غير صحيحة.
La connexion n'a pas abouti. Réessayez.|Sign-in was unsuccessful. Please try again.|لم ينجح تسجيل الدخول. حاول مجدداً.
Compte créé. Ouvrez l'email de confirmation que vous venez de recevoir, puis connectez-vous.|Account created. Open the confirmation email you received, then sign in.|تم إنشاء الحساب. افتح رسالة التأكيد التي تلقيتها، ثم سجّل الدخول.
Carte|Menu|قائمة الطعام
L'atelier|The studio|الاستوديو
Café · Pâtisserie|Café · Patisserie|مقهى · حلويات
Le goût des matins lents.|The taste of slow mornings.|مذاق الصباح الهادئ.
Café de spécialité, pâtisseries maison et ambiance chaleureuse.|Speciality coffee, homemade pastries and a warm atmosphere.|قهوة مختصة وحلويات منزلية وأجواء دافئة.
Voir la carte|View the menu|تصفح قائمة الطعام
Passez nous voir.|Come and visit.|تفضل بزيارتنا.
Du mardi au dimanche|Tuesday to Sunday|من الثلاثاء إلى الأحد
Abonnés|Followers|المتابعون
Suivis|Following|المتابَعون
Café · Pâtisserie maison|Café · Homemade pastries|مقهى · حلويات منزلية
Ouvert du mardi au dimanche ☕|Open Tuesday to Sunday ☕|مفتوح من الثلاثاء إلى الأحد ☕
Contacter|Contact|تواصل
Itinéraire|Directions|الاتجاهات
Lieu|Location|المكان
Avis|Reviews|الآراء
Infos|Info|المعلومات
Restaurant · Cuisine maison|Restaurant · Homemade food|مطعم · أطباق منزلية
Message|Message|رسالة
Photos|Photos|الصور
Menu de la semaine|This week’s menu|قائمة الأسبوع
Nouveau menu du midi à découvrir dès lundi. Réservations ouvertes.|Discover our new lunch menu from Monday. Bookings are open.|اكتشف قائمة الغداء الجديدة ابتداءً من الاثنين. الحجز متاح.
vidéos|videos|فيديوهات
Suivre|Follow|متابعة
Nouveautés chaque semaine ✨|Something new every week ✨|جديد كل أسبوع ✨
Aperçu d'un site web|Website preview|معاينة موقع إلكتروني
Aperçu d'un profil Instagram|Instagram profile preview|معاينة حساب Instagram
Aperçu d'une page professionnelle|Business page preview|معاينة صفحة مهنية
Aucun projet ne correspond à ces filtres.|No projects match these filters.|لا توجد مشاريع تطابق هذه التصفية.
Navigation|Navigation|التنقل
Navigation principale|Main navigation|التنقل الرئيسي
Navigation mobile|Mobile navigation|التنقل على الهاتف
Ouvrir le menu|Open menu|فتح القائمة
Fermer le menu|Close menu|إغلاق القائمة
Démarrer un projet|Start a project|لنبدأ مشروعك
Explorer nos réalisations|Explore our work|استكشف أعمالنا
Discutons de votre projet|Let’s talk about your project|لنتحدث عن مشروعك
Choisir mon secteur · Nos démonstrations|Find my industry · Explore our demos|اختر مجالك · استكشف نماذجنا
Votre entreprise. Notre créativité.|Your business. Our creativity.|شركتك. إبداعنا.
Une nouvelle dimension digitale.|A new digital dimension.|بُعد رقمي جديد.
Sites web, réseaux sociaux et identité digitale : nous transformons votre activité en une présence professionnelle, moderne et attractive.|Websites, social media and digital identity: we give your business a professional, modern and engaging online presence.|مواقع إلكترونية وشبكات تواصل وهوية رقمية: نمنح نشاطك حضوراً احترافياً وعصرياً وجذاباً على الإنترنت.
Défiler|Scroll to explore|مرّر للاستكشاف
Secteurs accompagnés|Industries we serve|القطاعات التي نخدمها
Restaurants|Restaurants|المطاعم
Cafés|Cafés|المقاهي
Salons de beauté|Beauty salons|صالونات التجميل
Boutiques|Shops|المتاجر
Entrepreneurs|Entrepreneurs|رواد الأعمال
Artisans|Craft businesses|الحرفيون
Petites entreprises|Small businesses|المقاولات الصغيرة
Commerces de proximité|Local businesses|المتاجر المحلية
Votre présence digitale,|Your digital presence,|حضورك الرقمي،
de A à Z.|from start to finish.|من البداية إلى النهاية.
Des solutions adaptées pour valoriser votre activité et faciliter votre découverte par de nouveaux clients.|Tailored solutions that showcase your business and help new customers find you.|حلول مصممة لإبراز نشاطك وتسهيل وصول عملاء جدد إليك.
Création de sites web|Website design|إنشاء المواقع الإلكترونية
Création de site web|Website design|إنشاء موقع إلكتروني
Un site web moderne et professionnel conçu pour présenter votre activité, valoriser vos services et faciliter la prise de contact.|A modern, professional website that introduces your business, showcases your services and makes it easy to get in touch.|موقع إلكتروني عصري واحترافي يعرّف بنشاطك ويبرز خدماتك ويسهّل التواصل معك.
Instagram professionnel|Instagram for business|Instagram للأعمال
Un profil Instagram soigné qui reflète l'identité de votre entreprise et met en valeur vos produits et services.|A polished Instagram profile that reflects your business identity and showcases your products and services.|حساب Instagram متقن يعكس هوية شركتك ويبرز منتجاتك وخدماتك.
Facebook professionnel|Facebook for business|Facebook للأعمال
Une page Facebook complète et professionnelle pour renforcer votre visibilité et faciliter les échanges avec vos clients.|A complete, professional Facebook page that helps people find you and makes customer conversations easier.|صفحة Facebook متكاملة واحترافية لتعزيز ظهورك وتسهيل التواصل مع عملائك.
TikTok professionnel|TikTok for business|TikTok للأعمال
Une présence TikTok adaptée à votre activité pour présenter votre univers et renforcer votre visibilité digitale.|A TikTok presence tailored to your business, introducing your world and building your online visibility.|حضور على TikTok يناسب نشاطك ويعرّف بعالمك ويعزز ظهورك الرقمي.
En savoir plus|Learn more|اكتشف المزيد
Demander ce service|Enquire about this service|استفسر عن هذه الخدمة
Voir des réalisations|View our work|شاهد أعمالنا
Design sur mesure, adapté à votre image|Custom design that fits your identity|تصميم مخصص يعكس هويتك
Consultation parfaite sur mobile, tablette et ordinateur|A smooth experience on phones, tablets and computers|تجربة سلسة على الهاتف واللوحة الإلكترونية والحاسوب
Présentation de vos services, horaires et coordonnées|Your services, opening hours and contact details|عرض خدماتك وأوقات عملك وبيانات التواصل
Boutons de contact, d'appel et d'itinéraire|Contact, call and directions buttons|أزرار للتواصل والاتصال والوصول إلى موقعك
Bases du référencement naturel|Essential search engine optimisation|أساسيات تحسين الظهور في محركات البحث
Création ou reprise du compte professionnel|Set up or refresh your business account|إنشاء حسابك المهني أو تطويره
Photo de profil, biographie et lien optimisés|An optimised profile photo, bio and link|صورة شخصية ونبذة ورابط محسّنة
Highlights (stories à la une) cohérents|Consistent story highlights|قصص مميزة متناسقة
Ligne graphique pour vos publications|A consistent visual style for your posts|أسلوب بصري متناسق لمنشوراتك
Boutons de contact configurés|Ready-to-use contact buttons|إعداد أزرار التواصل
Création de la page et des informations clés|Page setup and essential business information|إنشاء الصفحة وإضافة المعلومات الأساسية
Photo de couverture et visuels à votre image|A cover photo and visuals that reflect your identity|صورة غلاف ومرئيات تعكس هويتك
Bouton d'action : réserver, appeler, envoyer un message|Action button: book, call or send a message|زر إجراء للحجز أو الاتصال أو إرسال رسالة
Sections services, horaires et localisation|Services, opening hours and location sections|أقسام للخدمات وأوقات العمل والموقع
Premières publications de présentation|Introductory posts to get you started|منشورات تعريفية أولى
Création du compte professionnel|Business account setup|إنشاء الحساب المهني
Profil, biographie et lien configurés|Profile, bio and link setup|إعداد الملف الشخصي والنبذة والرابط
Identité visuelle des couvertures de vidéos|A visual identity for your video covers|هوية بصرية لأغلفة الفيديو
Idées de formats adaptées à votre activité|Content format ideas tailored to your business|أفكار لمحتوى يناسب نشاطك
Conseils de publication|Posting guidance|إرشادات للنشر
Service|Service|الخدمة
Identité visuelle|Visual identity|الهوية البصرية
Présence digitale complète|Complete digital presence|حضور رقمي متكامل
Autre / je ne sais pas encore|Other / I’m not sure yet|أخرى / لم أحدد بعد
Nos réalisations|Our work|أعمالنا
Portfolio|Portfolio|معرض الأعمال
Portfolio ·|Portfolio ·|معرض الأعمال ·
Découvrez comment nous donnons une nouvelle dimension digitale aux projets.|See how we bring a new digital dimension to each project.|اكتشف كيف نمنح المشاريع بُعداً رقمياً جديداً.
Voir toutes les réalisations|View all projects|شاهد جميع الأعمال
Toutes les réalisations|All projects|جميع الأعمال
Tous les projets|All projects|جميع المشاريع
Tous|All|الكل
Projets clients|Client projects|مشاريع العملاء
Origine des projets|Project type|نوع المشروع
Filtrer les réalisations par plateforme|Filter projects by platform|تصفية المشاريع حسب المنصة
Projet de démonstration|Demo project|مشروع تجريبي
Services réalisés|Services delivered|الخدمات المنجزة
Plateformes proposées|Available platforms|المنصات المقترحة
Voir le projet|View project|عرض المشروع
Voir le projet en ligne|View live project|زيارة موقع المشروع
Projet suivant|Next project|المشروع التالي
Les premières réalisations arrivent bientôt.|Our first projects are coming soon.|أعمالنا الأولى قريباً.
En attendant, parlons de votre projet.|In the meantime, let’s talk about your project.|في انتظار ذلك، لنتحدث عن مشروعك.
Nous contacter|Contact us|تواصل معنا
Les projets clients et les concepts fictifs sont présentés séparément grâce au filtre. Chaque concept porte le badge « Projet de démonstration ».|Use the filter to distinguish client projects from fictional concepts. Each concept is marked “Demo project”.|استخدم التصفية للتمييز بين مشاريع العملاء والتصورات الافتراضية. يحمل كل تصور شارة «مشروع تجريبي».
Aucun projet client publié ne correspond à ces filtres.|No published client projects match these filters.|لا توجد مشاريع عملاء منشورة تطابق هذه التصفية.
Réinitialiser les filtres|Reset filters|إعادة ضبط التصفية
Votre entreprise pourrait être|Your business could be|يمكن أن تكون شركتك
la prochaine.|next.|التالية.
Catégories|Categories|الفئات
L'entreprise|The business|النشاط التجاري
Le besoin|The brief|الاحتياج
Ce que nous avons réalisé|What we created|ما أنجزناه
Avant|Before|قبل
Après|After|بعد
Comparer avant et après|Compare before and after|المقارنة قبل وبعد
Agrandir l'image|Enlarge image|تكبير الصورة
Agrandir l'image principale|Enlarge main image|تكبير الصورة الرئيسية
Visionneuse d'images|Image viewer|عارض الصور
Image précédente|Previous image|الصورة السابقة
Image suivante|Next image|الصورة التالية
Fermer|Close|إغلاق
Précédente|Previous|السابقة
Suivante|Next|التالية
Pourquoi nous|Why choose us|لماذا تختارنا
Une présence digitale qui|A digital presence that|حضور رقمي
fait la différence.|makes a difference.|يصنع الفرق.
Pas de promesses chiffrées : un travail soigné, pensé pour votre activité et vos clients.|No inflated promises. Just thoughtful work designed for your business and your customers.|بدون وعود رقمية مبالغ فيها: عمل متقن مصمم لنشاطك وعملائك.
Une image professionnelle|A professional image|صورة احترافية
Une présentation soignée qui inspire confiance dès le premier regard.|A polished presentation that inspires confidence at first glance.|تقديم متقن يمنح الثقة منذ النظرة الأولى.
Une meilleure visibilité en ligne|Greater online visibility|ظهور أفضل على الإنترنت
Être présent là où vos futurs clients vous cherchent : Google et les réseaux sociaux.|Be where your future customers look for you: Google and social media.|كن حاضراً حيث يبحث عنك عملاؤك المحتملون: Google وشبكات التواصل الاجتماعي.
Une identité digitale cohérente|A consistent digital identity|هوية رقمية متناسقة
Les mêmes couleurs, le même ton et le même style sur chaque plateforme.|Consistent colours, tone and style across every platform.|ألوان ونبرة وأسلوب متناسقة على جميع المنصات.
Des solutions adaptées à chaque activité|Solutions tailored to each business|حلول تناسب كل نشاط
Un restaurant, un salon ou une boutique n'ont pas les mêmes besoins. Nous nous adaptons au vôtre.|Restaurants, salons and shops have different needs. We adapt to yours.|تختلف احتياجات المطاعم والصالونات والمتاجر. ونحن نتكيف مع احتياجاتك.
Un contact plus simple avec les clients|An easier way to connect with customers|تواصل أسهل مع العملاء
Appel, message, itinéraire ou réservation : vos clients vous joignent en un geste.|Calls, messages, directions or bookings: customers can reach you with a tap.|اتصال أو رسالة أو اتجاهات أو حجز: يصل إليك عملاؤك بلمسة واحدة.
Méthode|Our process|منهجيتنا
Une méthode simple,|A simple process,|منهجية بسيطة،
en quatre étapes.|in four steps.|في أربع خطوات.
Échange|Let’s talk|نتحاور
Nous discutons de votre activité, de vos besoins et de vos objectifs.|We discuss your business, your needs and your goals.|نتحدث عن نشاطك واحتياجاتك وأهدافك.
Proposition|Our proposal|نقترح
Nous vous proposons une solution digitale adaptée à votre projet.|We propose a digital solution tailored to your project.|نقترح عليك حلاً رقمياً يناسب مشروعك.
Création|Creation|نبدع
Nous concevons votre présence digitale avec une attention particulière aux détails.|We craft your digital presence with particular attention to detail.|نصمم حضورك الرقمي مع اهتمام خاص بالتفاصيل.
Mise en ligne|Launch|ننشر
Votre projet prend vie sur le web et les plateformes adaptées à votre activité.|Your project goes live on the web and the platforms that suit your business.|يرى مشروعك النور على الإنترنت والمنصات المناسبة لنشاطك.
Deux personnes dans un bureau MAYD DIGITAL|Two people in a MAYD DIGITAL office|شخصان في مكتب MAYD DIGITAL
Fondateurs de|Founders of|مؤسسا
Mehdi et Ayoub|Mehdi and Ayoub|Mehdi وAyoub
Derrière chaque projet,|Behind every project,|وراء كل مشروع،
une vision.|a vision.|رؤية.
est un studio de création digitale fondé par Mehdi et Ayoub.|is a digital design studio founded by Mehdi and Ayoub.|استوديو للإبداع الرقمي أسسه Mehdi وAyoub.
Nous accompagnons les entreprises dans la création de sites web modernes et le développement de leur présence professionnelle sur Instagram, Facebook et TikTok.|We help businesses create modern websites and build a professional presence on Instagram, Facebook and TikTok.|نرافق الشركات في إنشاء مواقع إلكترونية عصرية وتطوير حضورها المهني على Instagram وFacebook وTikTok.
Notre objectif : transformer leurs idées en réalisations digitales concrètes, modernes et adaptées à leur activité.|Our goal: turn their ideas into tangible, modern digital experiences that fit their business.|هدفنا تحويل أفكارهم إلى إنجازات رقمية ملموسة وعصرية تناسب نشاطهم.
En savoir plus sur nous|Learn more about us|تعرّف علينا أكثر
Et si votre projet était|What if your project were|ماذا لو كان مشروعك
le prochain ?|next?|التالي؟
Parlons de votre activité et construisons ensemble votre présence digitale.|Let’s talk about your business and build your digital presence together.|لنتحدث عن نشاطك ونبنِ معاً حضورك الرقمي.
Nom *|Name *|الاسم *
Nom de l'entreprise|Business name|اسم الشركة
Votre nom|Your name|اسمك
Votre entreprise|Your business|شركتك
Téléphone ou email *|Phone or email *|الهاتف أو البريد الإلكتروني *
Pour vous recontacter|So we can get back to you|للتواصل معك
Service souhaité|Service you’re interested in|الخدمة المطلوبة
Choisir un service|Choose a service|اختر خدمة
Description du projet *|Project description *|وصف المشروع *
Parlez-nous de votre activité et de ce que vous souhaitez…|Tell us about your business and what you have in mind…|حدثنا عن نشاطك وما ترغب في تحقيقه…
* Champs obligatoires. Vos informations servent uniquement à vous recontacter.|* Required fields. We only use your details to get back to you.|* حقول مطلوبة. نستخدم بياناتك فقط للتواصل معك.
Envoi en cours…|Sending…|جارٍ الإرسال…
Envoyer ma demande|Send my enquiry|إرسال طلبي
Merci, message bien reçu.|Thank you. We’ve received your message.|شكراً، لقد تلقينا رسالتك.
Nous revenons vers vous très vite pour parler de votre projet.|We’ll be in touch soon to discuss your project.|سنتواصل معك قريباً للحديث عن مشروعك.
Envoyer un autre message|Send another message|إرسال رسالة أخرى
Votre message n'a pas pu être envoyé.|Your message could not be sent.|تعذر إرسال رسالتك.
Votre message n'a pas pu être envoyé. Merci de réessayer.|Your message could not be sent. Please try again.|تعذر إرسال رسالتك. يرجى المحاولة مجدداً.
Indiquez votre nom|Please enter your name|يرجى إدخال اسمك
100 caractères maximum|Up to 100 characters|100 حرف كحد أقصى
120 caractères maximum|Up to 120 characters|120 حرفاً كحد أقصى
160 caractères maximum|Up to 160 characters|160 حرفاً كحد أقصى
2000 caractères maximum|Up to 2,000 characters|2000 حرف كحد أقصى
Indiquez un téléphone ou un email|Please enter a phone number or email address|يرجى إدخال رقم هاتف أو بريد إلكتروني
Indiquez un email valide ou un numéro de téléphone|Please enter a valid email address or phone number|يرجى إدخال بريد إلكتروني أو رقم هاتف صالح
Décrivez votre projet en quelques mots (10 caractères minimum)|Describe your project briefly (at least 10 characters)|صف مشروعك بإيجاز (10 أحرف على الأقل)
Écrire sur WhatsApp|Message us on WhatsApp|راسلنا على WhatsApp
Bonjour, je souhaite discuter de mon projet digital.|Hello, I’d like to discuss my digital project.|مرحباً، أود مناقشة مشروعي الرقمي.
Voir notre Instagram|Visit our Instagram|زر حسابنا على Instagram
Email|Email|البريد الإلكتروني
Téléphone|Phone|الهاتف
Réseaux|Social media|شبكات التواصل
Bientôt disponibles|Coming soon|قريباً
Formulaire de contact|Contact form|نموذج التواصل
. Tous droits réservés.|. All rights reserved.|. جميع الحقوق محفوظة.
Tous droits réservés.|All rights reserved.|جميع الحقوق محفوظة.
Espace administrateur|Admin area|لوحة الإدارة
Aller au contenu|Skip to content|انتقل إلى المحتوى
Erreur 404|Error 404|خطأ 404
Page introuvable|Page not found|الصفحة غير موجودة
La page que vous cherchez n'existe pas ou a été déplacée.|The page you’re looking for does not exist or has moved.|الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
Retour à l'accueil|Back to home|العودة إلى الرئيسية
Cette page n'a pas pu se charger|This page could not be loaded|تعذر تحميل هذه الصفحة
Une erreur est survenue. Vous pouvez réessayer ou revenir à l'accueil.|Something went wrong. Please try again or return to the home page.|حدث خطأ. يمكنك المحاولة مجدداً أو العودة إلى الصفحة الرئيسية.
Réessayer|Try again|حاول مجدداً
Projet introuvable|Project not found|المشروع غير موجود
Ce projet n'est pas disponible.|This project is not available.|هذا المشروع غير متاح.
Impossible de charger ce projet.|This project could not be loaded.|تعذر تحميل هذا المشروع.
Impossible de charger les réalisations.|The projects could not be loaded.|تعذر تحميل الأعمال.
Nos démonstrations · Choisissez votre univers|Our demos · Choose your world|نماذجنا التجريبية · اختر عالمك
Nos démonstrations|Our demos|نماذجنا التجريبية
Imaginez votre entreprise|Imagine your business|تخيّل شركتك
en digital.|online.|في العالم الرقمي.
Explorez nos concepts de sites web et de pages professionnelles sur Instagram, Facebook et TikTok.|Explore our website concepts and professional pages on Instagram, Facebook and TikTok.|استكشف تصوراتنا للمواقع الإلكترونية والصفحات المهنية على Instagram وFacebook وTikTok.
Onze marques fictives, onze identités. Aucun de ces concepts ne représente un client réel.|Eleven fictional brands, eleven identities. None of these concepts represents a real client.|إحدى عشرة علامة افتراضية وهويات مختلفة. لا يمثل أي من هذه التصورات عميلاً حقيقياً.
Concept de démonstration|Demo concept|تصور تجريبي
Concept|Concept|تصور
Concept introuvable|Concept not found|التصور غير موجود
Explorer la démonstration|Explore the demo|استكشف النموذج
Toutes les démonstrations|All demos|جميع النماذج
Une même entreprise, cinq façons de donner vie à sa présence digitale.|One business, five ways to bring its digital presence to life.|شركة واحدة وخمس طرق لإحياء حضورها الرقمي.
Entreprise fictive imaginée par MAYD DIGITAL|Fictional business imagined by MAYD DIGITAL|شركة افتراضية من تصور MAYD DIGITAL
Entreprise fictive · Une identité, cinq expériences digitales.|Fictional business · One identity, five digital experiences.|شركة افتراضية · هوية واحدة وخمس تجارب رقمية.
Plateformes de|Platforms for|منصات
Site web|Website|موقع إلكتروني
Sites web|Websites|مواقع إلكترونية
Une identité qui se reconnaît|An instantly recognisable identity|هوية يسهل تمييزها
Une première impression mémorable.|A memorable first impression.|انطباع أول لا يُنسى.
La vitrine de proximité|Your local digital storefront|واجهتك الرقمية المحلية
Raconter. Présenter. Donner envie.|Tell your story. Showcase your business. Inspire interest.|اروِ قصتك. قدّم نشاطك. ألهم الاهتمام.
Le mouvement, en intention|Movement, imagined|الحركة، في تصور بصري
Des idées qui captent le regard.|Ideas that catch the eye.|أفكار تلفت الأنظار.
Maquette éditoriale · Entreprise fictive · Aucune audience ni résultat revendiqué. Les interactions ouvrent les contenus de démonstration.|Editorial mockup · Fictional business · No audience or results claimed. Interactions open demo content.|ماكيت تحريري · شركة افتراضية · لا توجد ادعاءات بشأن الجمهور أو النتائج. تفتح التفاعلات محتويات تجريبية.
Aperçus de contenu uniquement : aucune vidéo n’est disponible et aucune lecture n’est simulée.|Content previews only: no videos are available and no playback is simulated.|معاينات محتوى فقط: لا تتوفر فيديوهات ولا تتم محاكاة تشغيلها.
Page professionnelle|Business page|صفحة مهنية
Découvrir le site de démonstration|Explore the demo website|استكشف الموقع التجريبي
Stories à la une|Story highlights|القصص المميزة
Publications|Posts|المنشورات
publications|posts|منشورات
Galerie & publications|Gallery and posts|المعرض والمنشورات
Publication de démonstration|Demo post|منشور تجريبي
Exemple de publication · Pas de compte réel|Sample post · Not a real account|مثال لمنشور · ليس حساباً حقيقياً
Aperçus de contenu|Content previews|معاينات المحتوى
Aperçu de contenu|Content preview|معاينة محتوى
Maquette|Mockup|ماكيت
Concept de démonstration · Aperçu éditorial fictif|Demo concept · Fictional editorial preview|تصور تجريبي · معاينة تحريرية افتراضية
Aperçu visuel, aucune vidéo disponible.|Visual preview, no video available.|معاينة بصرية، لا يتوفر فيديو.
Photographie d’illustration.|Illustrative photo.|صورة توضيحية.
Un site à explorer, pas une simple image.|A website to explore, not just a picture.|موقع قابل للاستكشاف، وليس مجرد صورة.
Catalogue, galerie et formulaire simulé : essayez les interactions ci-dessous.|Catalogue, gallery and simulated form: try the interactions below.|كتالوج ومعرض ونموذج محاكاة: جرّب التفاعلات أدناه.
Explorer en page complète|Explore the full website|استكشف الموقع في صفحة كاملة
Site de démonstration|Demo website|موقع تجريبي
Site fictif|Fictional website|موقع افتراضي
Démonstration|Demo|نموذج تجريبي
Retour à la démonstration|Back to the demo|العودة إلى النموذج
Concept de démonstration · Entreprise fictive|Demo concept · Fictional business|تصور تجريبي · شركة افتراضية
Catalogue|Catalogue|الكتالوج
Galerie|Gallery|المعرض
Prestations|Services|الخدمات
Réserver|Book|احجز
Visiter|Arrange a visit|اطلب زيارة
Explorer la sélection|Explore the collection|استكشف التشكيلة
Découvrir notre univers|Discover our world|اكتشف عالمنا
01 — L’expérience|01 — The experience|01 — التجربة
Jouez à votre rythme|Play at your own pace|العب على إيقاعك
Pensé pour vous|Designed for you|مصمم لأجلك
Un parcours simple, une expérience soignée.|A simple journey, a thoughtful experience.|مسار بسيط وتجربة متقنة.
Essayer ce parcours →|Try this journey →|جرّب هذا المسار ←
Tous les tarifs sont illustratifs. Aucune offre réelle n’est proposée.|All prices are illustrative. No real offers are being made.|جميع الأسعار توضيحية. لا يتم تقديم أي عرض حقيقي.
La sélection|Our selection|تشكيلتنا
Catalogue fictif · Photos d’illustration · Prix illustratifs en dirhams marocains (MAD).|Fictional catalogue · Illustrative photos · Example prices in Moroccan dirhams (MAD).|كتالوج افتراضي · صور توضيحية · أسعار تجريبية بالدرهم المغربي.
Type de|Type of|نوع
bien|property|العقار
véhicule|vehicle|المركبة
Filtrer par type|Filter by type|التصفية حسب النوع
Tous les types|All types|جميع الأنواع
Votre projet|Your project|مشروعك
Transmission|Transmission|ناقل الحركة
Filtrer achat ou location|Filter by sale or rental|التصفية حسب البيع أو الإيجار
Filtrer par transmission|Filter by transmission|التصفية حسب ناقل الحركة
Toutes les options|All options|جميع الخيارات
Réinitialiser|Reset|إعادة الضبط
Découvrir la fiche|View details|عرض التفاصيل
Aucun exemple pour ces filtres. Essayez une autre combinaison.|No examples match these filters. Try another combination.|لا توجد أمثلة تطابق هذه التصفية. جرّب مجموعة أخرى.
Bien ou véhicule fictif · Concept de démonstration|Fictional property or vehicle · Demo concept|عقار أو مركبة افتراضية · تصور تجريبي
Tarif illustratif|Illustrative price|سعر توضيحي
Au-delà de la partie|Beyond the game|ما بعد اللعب
La communauté au centre du jeu.|A community at the heart of the game.|مجتمع في قلب التجربة.
Événement fictif · Programme conceptuel|Fictional event · Concept programme|فعالية افتراضية · برنامج تصوري
Simuler ma participation →|Simulate joining →|محاكاة المشاركة ←
L’univers en images|Our world in pictures|عالمنا بالصور
Le détail fait la différence.|Details make the difference.|التفاصيل تصنع الفرق.
Entrez dans l’expérience.|Step into the experience.|انغمس في التجربة.
Photographies d’illustration. Cliquez sur une image pour l’agrandir.|Illustrative photos. Select an image to enlarge it.|صور توضيحية. اختر صورة لتكبيرها.
Essayez le parcours|Try the journey|جرّب المسار
Ce formulaire est une simulation locale. Utilisez des données fictives ; rien n’est enregistré ni transmis.|This form is a local simulation. Use fictional details; nothing is saved or sent.|هذا النموذج محاكاة محلية. استخدم بيانات افتراضية؛ لا يتم حفظ أي شيء أو إرساله.
Créneaux et disponibilités fictifs. Tarifs illustratifs, sans valeur commerciale.|Fictional times and availability. Illustrative prices with no commercial value.|أوقات وتوفر افتراضية. أسعار توضيحية بلا قيمة تجارية.
Nom fictif|Fictional name|اسم افتراضي
Email fictif|Fictional email|بريد إلكتروني افتراضي
Exemple : Camille Démo|Example: Alex Demo|مثال: اسم تجريبي
Bien à visiter|Property to visit|العقار المطلوب زيارته
Véhicule|Vehicle|المركبة
Prestation|Service|الخدمة
Choisir|Choose|اختر
Date de départ|Pick-up date|تاريخ الاستلام
Date de retour|Return date|تاريخ الإرجاع
Date souhaitée|Preferred date|التاريخ المطلوب
Créneau fictif|Demo time slot|موعد تجريبي
Choisir un créneau|Choose a time|اختر موعداً
Votre idée (facultatif)|Your idea (optional)|فكرتك (اختياري)
Données fictives uniquement|Fictional details only|بيانات افتراضية فقط
Tester la demande simulée →|Test the simulated request →|اختبر الطلب التجريبي ←
Indiquez un nom d’au moins deux caractères.|Please enter a name with at least two characters.|يرجى إدخال اسم من حرفين على الأقل.
La date de retour doit être après la date de départ.|The return date must be after the pick-up date.|يجب أن يكون تاريخ الإرجاع بعد تاريخ الاستلام.
Démonstration uniquement : aucune demande réelle n’a été envoyée.|Demo only: no real request has been sent.|للعرض التجريبي فقط: لم يتم إرسال أي طلب حقيقي.
Entreprise fictive · Concept de démonstration par MAYD DIGITAL|Fictional business · Demo concept by MAYD DIGITAL|شركة افتراضية · تصور تجريبي من MAYD DIGITAL
Retour en haut ↑|Back to top ↑|العودة إلى الأعلى ↑
Votre projet commence ici|Your project starts here|مشروعك يبدأ هنا
Et si votre entreprise était|What if your business were|ماذا لو كانت شركتك
la prochaine ?|next?|التالية؟
Demander un devis|Request a quote|اطلب عرض سعر
Restaurant|Restaurant|مطعم
Salle de sport|Gym|نادي رياضي
Salle de jeux & gaming center|Gaming centre|مركز ألعاب إلكترونية
Agence immobilière|Real estate agency|وكالة عقارية
Salon de coiffure|Hair salon|صالون تصفيف الشعر
Location de voitures|Car rental|تأجير السيارات
Simulation|Simulation|محاكاة
Passez au niveau supérieur.|Take your game to the next level.|ارتقِ بمستوى اللعب.
Du premier match à la dernière manche : un espace imaginé pour jouer ensemble, progresser et partager la même passion.|From the first match to the final round: a space imagined for playing together, improving and sharing a passion.|من أول مباراة إلى آخر جولة: فضاء مصمم للعب معاً والتطور ومشاركة الشغف نفسه.
PC, consoles et esprit d’équipe. Découvrez notre univers gaming, nos sessions et nos rendez-vous communautaires.|PCs, consoles and team spirit. Explore our gaming world, sessions and community events.|حواسيب ومنصات ألعاب وروح الفريق. اكتشف عالم الألعاب وجلساتنا وفعالياتنا الجماعية.
Simuler une réservation|Simulate a booking|محاكاة حجز
Choisissez votre terrain de jeu|Choose your playground|اختر مساحة اللعب
L’espace|The space|الفضاء
PC & consoles|PCs and consoles|الحواسيب ومنصات الألعاب
Forfaits|Packages|الباقات
Événements|Events|الفعاليات
Votre prochain terrain de jeu|Your next playground|وجهتك القادمة للعب
Le setup qui change tout|A setup that changes everything|تجهيزات تصنع الفرق
Une partie entre amis|A game with friends|جولة مع الأصدقاء
Précision. Immersion. Émotion.|Precision. Immersion. Excitement.|دقة. اندماج. حماس.
Dans les coulisses du gaming|Behind the gaming scenes|في كواليس الألعاب
Prêts pour la prochaine manche ?|Ready for the next round?|هل أنتم مستعدون للجولة القادمة؟
Session découverte|Discovery session|جلسة اكتشاف
Un poste PC et une heure pour entrer dans la partie.|One PC station and one hour to get into the game.|محطة حاسوب وساعة للانضمام إلى اللعب.
Duo console|Console duo|ثنائي منصة الألعاب
Une console et deux manettes pour partager la session.|One console and two controllers to share a session.|منصة ألعاب وذراعا تحكم لمشاركة الجلسة.
Pass escouade|Squad pass|باقة الفريق
Quatre postes PC pendant deux heures, pour jouer en équipe.|Four PC stations for two hours of team play.|أربع محطات حاسوب لساعتين من اللعب الجماعي.
La soirée des équipes|Team night|أمسية الفرق
Concept de rencontre : parties coopératives et découverte des jeux du moment.|Event concept: cooperative games and a chance to discover current favourites.|تصور للقاء: ألعاب تعاونية واكتشاف الألعاب الرائجة.
Le défi du week-end|The weekend challenge|تحدي نهاية الأسبوع
Concept de tournoi amical sur console. Programme et date à définir.|A friendly console tournament concept. Schedule and date to be confirmed.|تصور لدوري ودي على منصات الألعاب. البرنامج والتاريخ غير محددين بعد.
Un lieu. Une nouvelle vie.|A place. A new chapter.|مكان. بداية جديدة.
Des espaces lumineux, des lignes singulières et une recherche qui commence par vos envies. Imaginez votre prochaine adresse.|Light-filled spaces, distinctive lines and a search that begins with your wishes. Imagine your next address.|مساحات مضيئة وخطوط مميزة وبحث يبدأ من رغباتك. تخيّل عنوانك القادم.
Des lieux à vivre, des projets à imaginer. Sélection de biens fictifs à découvrir en achat et en location.|Places to live, possibilities to imagine. Explore a fictional collection of properties for sale and rent.|أماكن للعيش ومشاريع للتصور. اكتشف مجموعة عقارات افتراضية للبيع والإيجار.
Simuler une demande de visite|Simulate a viewing request|محاكاة طلب زيارة
Des lieux qui vous ressemblent|Spaces that feel like you|أماكن تشبهك
À vendre|For sale|للبيع
À louer|For rent|للإيجار
Intérieurs|Interiors|تصاميم داخلية
Conseils|Tips|نصائح
L’art de se sentir chez soi|The art of feeling at home|فن الشعور بالانتماء إلى المنزل
Lumière naturelle, chaque jour|Natural light, every day|ضوء طبيعي كل يوم
Une autre idée de l’espace|A different perspective on space|رؤية مختلفة للمساحة
Des détails qui font un lieu|Details that make a place|تفاصيل تمنح المكان هويته
Votre prochain chapitre|Your next chapter|فصلك القادم
Un intérieur à imaginer|An interior to imagine|تصميم داخلي تتخيله
Achat|Buy|شراء
Sur étude du projet|Based on your project|حسب دراسة المشروع
Un parcours de recherche pensé autour de votre mode de vie.|A property search designed around your lifestyle.|مسار بحث عن عقار مصمم وفق نمط حياتك.
Location|Rent|إيجار
Selon le bien|Depending on the property|حسب العقار
Comparez les espaces et trouvez la configuration qui vous convient.|Compare spaces and find the layout that suits you.|قارن المساحات واعثر على التوزيع الذي يناسبك.
Accompagnement|Guidance|المواكبة
À définir|To be confirmed|يُحدد لاحقاً
Une présentation claire du bien et de ses caractéristiques.|A clear presentation of the property and its features.|عرض واضح للعقار ومميزاته.
Appartement|Apartment|شقة
Appartement Lumière|Lumière Apartment|شقة Lumière
Appartement Atelier|Atelier Apartment|شقة Atelier
Villa Jardin|Jardin Villa|فيلا Jardin
Villa Patio|Patio Villa|فيلا Patio
Un appartement fictif ouvert sur une pièce de vie lumineuse, avec terrasse et cuisine intégrée.|A fictional apartment with a bright living area, a terrace and an integrated kitchen.|شقة افتراضية تضم غرفة معيشة مضيئة وشرفة ومطبخاً مدمجاً.
Une villa de démonstration avec volumes généreux, jardin privatif et espaces de détente.|A demo villa with generous spaces, a private garden and relaxation areas.|فيلا تجريبية بمساحات رحبة وحديقة خاصة وفضاءات للاسترخاء.
Un intérieur fictif aux matières douces, imaginé pour un quotidien simple et confortable.|A fictional interior with soft textures, designed for comfortable, uncomplicated living.|تصميم داخلي افتراضي بمواد ناعمة، مصمم لحياة يومية بسيطة ومريحة.
Une maison de démonstration organisée autour de la lumière, avec un patio pour les moments calmes.|A demo home designed around natural light, with a patio for quiet moments.|منزل تجريبي يستفيد من الضوء الطبيعي، مع فناء للحظات الهادئة.
Terrasse|Terrace|شرفة
Villa|Villa|فيلا
Jardin|Garden|حديقة
Cuisine équipée|Equipped kitchen|مطبخ مجهز
Patio|Patio|فناء
Votre style, naturellement.|Your style, naturally.|أسلوبك، بكل طبيعية.
Un moment pour vous. Des gestes précis, des matières chaleureuses et une approche de la coiffure qui respecte votre personnalité.|A moment for yourself. Precise techniques, warm textures and an approach to hair that respects your personality.|لحظة خاصة بك. لمسات دقيقة ومواد دافئة ورؤية لتصفيف الشعر تحترم شخصيتك.
Coupes, couleurs et soins. Un salon fictif où le détail et le bien-être prennent toute leur place.|Cuts, colour and care. A fictional salon where detail and wellbeing matter.|قصات وألوان وعناية. صالون افتراضي يمنح التفاصيل والراحة المكانة التي تستحقها.
Simuler un rendez-vous|Simulate an appointment|محاكاة موعد
Une attention pour chaque envie|Care for every wish|اهتمام بكل رغبة
Le salon|The salon|الصالون
Coupes|Cuts|القصات
Couleurs|Colour|الألوان
Soins|Treatments|العناية
Le luxe de prendre son temps|The luxury of taking your time|رفاهية الاستمتاع بالوقت
Une coupe, du mouvement|A cut full of movement|قصة تنبض بالحيوية
La couleur en douceur|Colour, softly expressed|ألوان بلمسات ناعمة
Le geste et la matière|Technique and texture|اللمسة والخامة
Un rituel pour vos cheveux|A ritual for your hair|طقس للعناية بشعرك
Révéler votre éclat|Reveal your radiance|أبرزي تألقك
Coupe & coiffage|Cut and styling|قص وتصفيف
Un diagnostic, une coupe personnalisée et une finition soignée.|A consultation, a personalised cut and a polished finish.|استشارة وقصة مخصصة ولمسة نهائية متقنة.
Couleur & lumière|Colour and highlights|ألوان وإشراق
Une proposition de nuances adaptée à votre style et à vos envies.|A colour palette tailored to your style and wishes.|اقتراح درجات ألوان تناسب أسلوبك ورغباتك.
Rituel de soin|Care ritual|طقس العناية
Un temps de soin et de détente pour sublimer la matière.|A moment of care and relaxation to bring out your hair’s beauty.|لحظة للعناية والاسترخاء لإبراز جمال شعرك.
La liberté prend la route.|Freedom takes the road.|الحرية تنطلق على الطريق.
Une citadine pour le quotidien, un SUV pour s’évader, une berline pour le plaisir du voyage. Imaginez la prochaine étape.|A city car for everyday life, an SUV for adventure, a saloon for the joy of travelling. Imagine your next stop.|سيارة صغيرة لليوميات وأخرى رياضية متعددة الاستخدامات للمغامرة وسيارة مريحة لمتعة السفر. تخيّل محطتك القادمة.
L’envie de prendre la route. Découvrez notre collection fictive de véhicules pour chaque type de trajet.|The urge to hit the road. Explore our fictional vehicle collection for every kind of journey.|رغبة في الانطلاق. اكتشف مجموعتنا الافتراضية من السيارات لكل نوع من الرحلات.
À chaque voyage, sa voiture|The right car for every journey|لكل رحلة سيارتها
Citadines|City cars|سيارات المدينة
SUV|SUV|سيارات رياضية متعددة الاستخدامات
Berlines|Saloons|سيارات سيدان
Voyages|Journeys|الرحلات
Le départ d’une nouvelle histoire|The start of a new story|انطلاقة حكاية جديدة
La ville à votre rythme|The city at your pace|المدينة على إيقاعك
L’élégance en mouvement|Elegance in motion|أناقة في الحركة
Cap sur les grands espaces|Head for the open road|نحو الآفاق الرحبة
Le plaisir du détail|The pleasure of detail|متعة التفاصيل
Votre prochaine escapade|Your next escape|رحلتك القادمة
Escapade urbaine|City escape|جولة في المدينة
Une sélection compacte pour vos trajets du quotidien.|A compact selection for your everyday journeys.|تشكيلة من السيارات الصغيرة لتنقلاتك اليومية.
Voyage en famille|Family trip|رحلة عائلية
Plus d’espace pour les bagages et les longues distances.|More room for luggage and long-distance trips.|مساحة أكبر للأمتعة والرحلات الطويلة.
Trajet premium|Premium journey|رحلة مميزة
Confort et élégance pour les occasions particulières.|Comfort and elegance for special occasions.|راحة وأناقة للمناسبات الخاصة.
Citadine|City car|سيارة مدينة
Citadine Essentielle|Essential City Car|سيارة المدينة الأساسية
SUV Évasion|Escape SUV|سيارة المغامرة
Berline Signature|Signature Saloon|سيارة Signature
SUV Grand Tour|Grand Tour SUV|سيارة الرحلات الكبرى
Manuelle|Manual|يدوي
Automatique|Automatic|أوتوماتيكي
Climatisation|Air conditioning|تكييف
Essence|Petrol|بنزين
Diesel|Diesel|ديزل
Grand coffre|Large boot|صندوق أمتعة واسع
Intérieur premium|Premium interior|مقصورة راقية
Véhicule fictif compact, pensé pour les déplacements urbains. Photo d’ambiance non contractuelle.|A fictional compact vehicle designed for city trips. Illustrative, non-contractual photo.|سيارة صغيرة افتراضية مصممة للتنقل في المدينة. صورة توضيحية غير تعاقدية.
Véhicule fictif spacieux pour voyager ensemble. Photo d’ambiance non contractuelle.|A fictional spacious vehicle for travelling together. Illustrative, non-contractual photo.|سيارة افتراضية رحبة للسفر معاً. صورة توضيحية غير تعاقدية.
Véhicule fictif alliant confort et lignes élégantes. Photo d’ambiance non contractuelle.|A fictional vehicle combining comfort and elegant lines. Illustrative, non-contractual photo.|سيارة افتراضية تجمع بين الراحة والخطوط الأنيقة. صورة توضيحية غير تعاقدية.
Véhicule de démonstration pour les envies d’évasion. Photo d’ambiance non contractuelle.|A demo vehicle for getting away from it all. Illustrative, non-contractual photo.|سيارة تجريبية لرغبات الانطلاق والمغامرة. صورة توضيحية غير تعاقدية.
Le goût des moments partagés.|A taste for shared moments.|مذاق اللحظات المشتركة.
Une table imaginée autour des saveurs, de la saison et du plaisir de recevoir. Entrez dans un univers de matières naturelles et de cuisine généreuse.|A table imagined around flavour, the seasons and the joy of hosting. Step into a world of natural materials and generous cooking.|مائدة تتمحور حول النكهات والموسم ومتعة الضيافة. ادخل عالماً من المواد الطبيعية والمطبخ السخي.
Une cuisine de saison, une table chaleureuse, des instants à savourer. Restaurant fictif imaginé pour cette démonstration.|Seasonal cooking, a welcoming table and moments to savour. A fictional restaurant created for this demo.|مطبخ موسمي ومائدة دافئة ولحظات تستحق التذوق. مطعم افتراضي صُمم لهذا العرض التجريبي.
Simuler une réservation de table|Simulate a table booking|محاكاة حجز طاولة
À la carte, tout simplement|Simply à la carte|قائمة طعام، بكل بساطة
La table|The table|المائدة
La carte|The menu|قائمة الطعام
En cuisine|In the kitchen|في المطبخ
À partager|To share|للمشاركة
Le plaisir de se retrouver|The joy of getting together|متعة اللقاء
Une assiette de saison|A seasonal plate|طبق موسمي
Des saveurs à partager|Flavours to share|نكهات للمشاركة
La douceur d’une pause|A little pause, a little sweetness|حلاوة الاستراحة
Le geste en cuisine|The craft of cooking|فن الطهي
Votre prochaine table|Your next table|مائدتك القادمة
Déjeuner de saison|Seasonal lunch|غداء موسمي
Une entrée et un plat imaginés autour de produits de saison.|A starter and a main course inspired by seasonal produce.|مقبّلات وطبق رئيسي مستوحيان من المنتجات الموسمية.
Dîner à partager|Dinner to share|عشاء للمشاركة
Un parcours gourmand pour prendre le temps de se retrouver.|A delicious journey that leaves time to enjoy being together.|رحلة مذاق تمنحكم الوقت للاستمتاع باللقاء.
Pause gourmande|A sweet break|استراحة لذيذة
Un dessert et une boisson chaude pour prolonger le moment.|A dessert and a hot drink to make the moment last.|تحلية ومشروب ساخن لإطالة متعة اللحظة.
Votre énergie. Votre rythme.|Your energy. Your rhythm.|طاقتك. إيقاعك.
Un club imaginé pour trouver votre équilibre : entraînement libre, mouvement collectif et accompagnement. Un espace pour avancer à votre rythme.|A club imagined for finding your balance: independent training, group movement and guidance. A space to progress at your own pace.|نادٍ مصمم لإيجاد توازنك: تدريب حر وحركة جماعية ومواكبة. فضاء للتقدم على إيقاعك.
Musculation, cours collectifs et mobilité. Découvrez l’univers d’un club fictif où chaque séance commence par votre envie de bouger.|Strength training, group classes and mobility. Explore a fictional club where every session starts with your desire to move.|تمارين قوة وحصص جماعية ومرونة. اكتشف عالم نادٍ افتراضي تبدأ فيه كل حصة برغبتك في الحركة.
Simuler une séance découverte|Simulate a trial session|محاكاة حصة اكتشاف
Trouvez votre façon de bouger|Find your way to move|اكتشف طريقتك في الحركة
Le club|The club|النادي
Musculation|Strength training|تمارين القوة
Cours|Classes|الحصص
Mobilité|Mobility|المرونة والحركة
Le mouvement commence ici|Movement starts here|الحركة تبدأ هنا
Construire sa routine|Build your routine|ابنِ روتينك
L’énergie du collectif|The energy of the group|طاقة الجماعة
Un temps pour soi|Time for yourself|وقت لنفسك
Trouver son équilibre|Find your balance|اعثر على توازنك
La prochaine séance vous attend|Your next session awaits|حصتك القادمة بانتظارك
Séance découverte|Trial session|حصة اكتشاف
Un premier aperçu de l’espace et des équipements, en toute simplicité.|A simple introduction to the space and equipment.|تعرّف ببساطة على الفضاء والتجهيزات.
Accès liberté|Flexible access|دخول مرن
Une formule fictive pour organiser vos entraînements à votre rythme.|A fictional plan for organising your training at your own pace.|صيغة افتراضية لتنظيم تدريباتك وفق إيقاعك.
Cours collectifs|Group classes|حصص جماعية
Renforcement, cardio ou mobilité : explorez différents mouvements.|Strength, cardio or mobility: explore different ways to move.|تقوية أو تمارين قلبية أو مرونة: اكتشف طرقاً متنوعة للحركة.
Sites web & réseaux sociaux pour entreprises|Websites and social media for businesses|مواقع إلكترونية وشبكات تواصل للشركات
Sites web, Instagram, Facebook et TikTok professionnels : une présence digitale moderne et attractive pour les commerces, restaurants, salons et entrepreneurs.|Professional websites, Instagram, Facebook and TikTok: a modern, engaging digital presence for shops, restaurants, salons and entrepreneurs.|مواقع إلكترونية وInstagram وFacebook وTikTok احترافية: حضور رقمي عصري وجذاب للمتاجر والمطاعم والصالونات ورواد الأعمال.
Sites web, Instagram, Facebook et TikTok professionnels pour les entreprises locales et les entrepreneurs.|Professional websites, Instagram, Facebook and TikTok for local businesses and entrepreneurs.|مواقع إلكترونية وInstagram وFacebook وTikTok احترافية للشركات المحلية ورواد الأعمال.
Sites web, réseaux sociaux et identité digitale pour les entreprises locales et les entrepreneurs.|Websites, social media and digital identity for local businesses and entrepreneurs.|مواقع إلكترونية وشبكات تواصل وهوية رقمية للشركات المحلية ورواد الأعمال.
Sites web, profils Instagram, pages Facebook et comptes TikTok : découvrez les réalisations et projets de présence digitale.|Websites, Instagram profiles, Facebook pages and TikTok accounts: explore our digital presence projects.|مواقع إلكترونية وحسابات Instagram وصفحات Facebook وحسابات TikTok: اكتشف أعمال الحضور الرقمي.
Création de sites web, Instagram, Facebook et TikTok professionnels : découvrez les services pour construire votre présence digitale de A à Z.|Professional websites, Instagram, Facebook and TikTok: explore the services that build your digital presence from start to finish.|إنشاء مواقع إلكترونية وInstagram وFacebook وTikTok احترافية: اكتشف خدمات بناء حضورك الرقمي من البداية إلى النهاية.
Parlons de votre activité et construisons ensemble votre présence digitale : site web, Instagram, Facebook ou TikTok.|Let’s talk about your business and build your digital presence together: a website, Instagram, Facebook or TikTok.|لنتحدث عن نشاطك ونبنِ معاً حضورك الرقمي: موقع إلكتروني أو Instagram أو Facebook أو TikTok.
`;
export const messages: Record<string, { en: string; ar: string }> = Object.fromEntries(
  rows
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [fr, en, ar] = line.split("|");
      return [fr!, { en: en!, ar: ar! }];
    }),
);
Object.assign(messages, showroomSourceMessages);
Object.assign(messages, trialMessages);
