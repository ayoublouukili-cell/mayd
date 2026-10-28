const rows = `
Visiter le site|Visit website|زيارة الموقع
Votre pause, tout simplement.|Your pause, simply.|استراحة على ذوقك.
Un café de quartier, des pâtisseries et le plaisir de prendre son temps. Découvrez la carte et imaginez votre prochaine pause.|A neighbourhood café, pastries and time to unwind. Explore the menu and imagine your next break.|مقهى الحي وحلويات ولحظات هادئة. اكتشف القائمة وتخيّل استراحتك المقبلة.
Café de démonstration : boissons chaudes, douceurs et moments partagés.|A demo café: hot drinks, sweet treats and shared moments.|مقهى تجريبي: مشروبات ساخنة وحلويات ولحظات مشتركة.
La carte du café|The café menu|قائمة المقهى
Pause café|Coffee break|استراحة قهوة
Un café et le temps de souffler.|A coffee and a moment to breathe.|قهوة ولحظة راحة.
Petit-déjeuner|Breakfast|فطور
Une boisson chaude et une sélection de douceurs.|A hot drink and a selection of treats.|مشروب ساخن وتشكيلة من الحلويات.
Goûter à partager|A treat to share|وجبة خفيفة للمشاركة
Une pause gourmande à deux.|A delicious break for two.|استراحة لذيذة لشخصين.
Espresso|Espresso|إسبريسو
Un café court et généreux.|A short, rich coffee.|قهوة قصيرة وغنية.
Café & douceur|Coffee & a treat|قهوة وحلوى
Une boisson chaude et une pâtisserie.|A hot drink and a pastry.|مشروب ساخن وحلوى.
Petit-déjeuner maison|House breakfast|فطور الدار
Le plaisir d'une matinée au café.|The pleasure of a morning at the café.|متعة صباح في المقهى.
Un moment rien que pour vous.|A moment just for you.|لحظة لك وحدك.
Des rituels de soin, une atmosphère douce et une attention portée à chaque détail. Découvrez l'univers de l'institut.|Care rituals, a gentle atmosphere and attention to every detail. Discover the beauty institute.|طقوس عناية وأجواء هادئة واهتمام بكل التفاصيل. اكتشف عالم المعهد.
Institut de démonstration : soins et rituels de beauté.|A demo institute: beauty treatments and rituals.|معهد تجريبي: عناية وطقوس جمال.
Nos rituels de beauté|Our beauty rituals|طقوس الجمال لدينا
Simuler un rendez-vous beauté|Try a beauty appointment|جرّب موعد جمال تجريبياً
Soin découverte|Discovery treatment|عناية استكشافية
Un rituel visage imaginé pour une pause douceur.|A concept facial ritual for a gentle pause.|طقس عناية تجريبي بالوجه للحظة هدوء.
Beauté des mains|Hand care|جمال اليدين
Un soin des mains et une finition soignée.|Hand care with a polished finish.|عناية باليدين ولمسة نهائية متقنة.
Rituel détente|Relaxation ritual|طقس استرخاء
Un moment de bien-être dans une atmosphère apaisante.|A moment of well-being in a soothing atmosphere.|لحظة راحة في أجواء مطمئنة.
Le plaisir de se retrouver à table.|The joy of gathering around the table.|متعة اللقاء حول المائدة.
Une cuisine généreuse, des tables accueillantes et des plats à partager en famille. Découvrez notre carte de démonstration.|Generous cooking, welcoming tables and dishes to share with family. Explore our demo menu.|مطبخ سخي وطاولات مرحبة وأطباق للمشاركة مع العائلة. اكتشف قائمتنا التجريبية.
Restaurant familial de démonstration : cuisine et convivialité.|A demo family restaurant: food and togetherness.|مطعم عائلي تجريبي: طبخ وألفة.
Votre style, votre signature.|Your style, your signature.|أسلوبك، توقيعك.
Des silhouettes faciles à porter, des matières à découvrir et une sélection pensée pour composer votre style.|Easy-to-wear silhouettes, textures to discover and a selection to shape your style.|إطلالات سهلة وخامات لاكتشافها وتشكيلة تساعدك على ابتكار أسلوبك.
Boutique de mode de démonstration : vêtements et accessoires.|A demo fashion boutique: clothing and accessories.|متجر أزياء تجريبي: ملابس وإكسسوارات.
La sélection mode|The fashion edit|تشكيلة الأزياء
Simuler une demande produit|Try a product enquiry|جرّب طلب معلومات عن منتج
Conseil silhouette|Style advice|نصيحة للإطلالة
Imaginez les associations qui vous ressemblent.|Imagine combinations that feel like you.|تخيّل التنسيقات التي تشبهك.
Sélection personnelle|Personal selection|اختيار شخصي
Composez votre sélection depuis le catalogue.|Build your selection from the catalogue.|كوّن اختيارك من الكتالوج.
Essayage en boutique|In-store fitting|تجربة في المتجر
Simulez une demande de rendez-vous.|Try a simulated appointment request.|جرّب طلب موعد تجريبياً.
Chemise essentielle|Essential shirt|قميص أساسي
Prêt-à-porter|Ready-to-wear|ملابس جاهزة
Collection|Collection|مجموعة
Une pièce de démonstration pour composer votre silhouette. Photo d'ambiance.|A demo piece to compose your outfit. Mood photo.|قطعة تجريبية لتنسيق إطلالتك. صورة للأجواء.
Coupe confortable|Comfortable cut|قصة مريحة
Style quotidien|Everyday style|أسلوب يومي
Veste de saison|Seasonal jacket|سترة الموسم
Une veste conceptuelle à découvrir en boutique. Photo d'ambiance.|A concept jacket to discover in store. Mood photo.|سترة تجريبية لاكتشافها في المتجر. صورة للأجواء.
Pièce de saison|Seasonal piece|قطعة موسمية
Style polyvalent|Versatile style|أسلوب متعدد الاستخدامات
Accessoire signature|Signature accessory|إكسسوار مميز
Accessoires|Accessories|إكسسوارات
Sélection|Selection|تشكيلة
Un accessoire de démonstration pour compléter une tenue. Photo d'ambiance.|A demo accessory to complete an outfit. Mood photo.|إكسسوار تجريبي لإكمال الإطلالة. صورة للأجواء.
Finition soignée|Careful finishing|تشطيب متقن
Détail signature|Signature detail|تفصيل مميز
`;
export const portfolioWebsiteMessages = Object.fromEntries(
  rows
    .trim()
    .split("\n")
    .map((row) => {
      const [fr, en, ar] = row.split("|");
      return [fr!, { en: en!, ar: ar! }];
    }),
);
