/* =========================================================
   Modern Agriculture Technology (MAT) — app logic
   Full site translation, simplified light/dark button,
   plant deletion, and general polish.
   ========================================================= */

/* Set your Gemini API key here (or inject it at build/deploy time).
   NOTE: any key placed in client-side JS is visible to site visitors.
   For production, call Gemini from a small server-side proxy instead
   of exposing a key in the browser. */

const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.5-flash-lite"];

/* ---------- Plant + library data (language-neutral IDs) ---------- */
const PLANTS_DEFAULT = () => ([
  { name:"Tomato", emoji:"🍅", score:72, waterKey:"Check soil regularly", sunKey:"6–8h", nutrients:"N, P, K + Ca, Mg", issueKey:"Possible water/nutrient stress", soilKey:"Fertile, well-drained", temp:"18–30°C", humidityKey:"Moderate", growthKey:"Fruit vegetable", careKey:"Monitor moisture, support stems and inspect leaves.", custom:false },
  { name:"Basil", emoji:"🌿", score:91, waterKey:"Keep soil lightly moist", sunKey:"6–8h", nutrients:"N, P, K + Mg", issueKey:"Healthy", soilKey:"Rich, well-drained", temp:"18–30°C", humidityKey:"Moderate–high", growthKey:"Herb", careKey:"Pinch growing tips and avoid waterlogged soil.", custom:false },
  { name:"Mango", emoji:"🥭", score:88, waterKey:"Deep watering when needed", sunKey:"Full sun", nutrients:"N, P, K + Mg, Ca", issueKey:"Healthy", soilKey:"Deep, well-drained", temp:"21–32°C", humidityKey:"Moderate", growthKey:"Fruit tree", careKey:"Give strong light and avoid constantly waterlogged roots.", custom:false },
  { name:"Aloe Vera", emoji:"🌵", score:96, waterKey:"Let soil dry between waterings", sunKey:"Bright light", nutrients:"Balanced micronutrients", issueKey:"Healthy", soilKey:"Very well-drained", temp:"15–30°C", humidityKey:"Low–moderate", growthKey:"Succulent", careKey:"Use a draining container and avoid frequent watering.", custom:false }
]);

const LIBRARY = [
  { name:"Tomato", emoji:"🍅", sunKey:"6–8h", humKey:"Moderate–high", nutrients:"N, P, K, Ca, Mg" },
  { name:"Basil", emoji:"🌿", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Mg" },
  { name:"Mango", emoji:"🥭", sunKey:"Full sun", humKey:"Moderate", nutrients:"N, P, K, Mg, Ca" },
  { name:"Aloe Vera", emoji:"🌵", sunKey:"Bright", humKey:"Low", nutrients:"Balanced micronutrients" },
  { name:"Banana", emoji:"🍌", sunKey:"Full sun", humKey:"High", nutrients:"K, N, Mg" },
  { name:"Mint", emoji:"🌱", sunKey:"4–6h", humKey:"Moderate", nutrients:"N, P, K" },
  { name:"Lettuce", emoji:"🥬", sunKey:"4–6h", humKey:"Moderate", nutrients:"N, P, K, Ca" },
  { name:"Lemon", emoji:"🍋", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Mg, Ca" },
  { name:"Rosemary", emoji:"🌿", sunKey:"6–8h", humKey:"Low–moderate", nutrients:"N, P, K" },
  { name:"Avocado", emoji:"🥑", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Ca, Mg" },
  { name:"Spinach", emoji:"🥬", sunKey:"4–6h", humKey:"Moderate", nutrients:"N, P, K, Mg, Fe" },
  { name:"Strawberry", emoji:"🍓", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Ca, Mg" },
  { name:"Cucumber", emoji:"🥒", sunKey:"6–8h", humKey:"High", nutrients:"N, P, K, Ca, Mg" },
  { name:"Pepper", emoji:"🌶️", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Ca, Mg" },
  { name:"Carrot", emoji:"🥕", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K" },
  { name:"Potato", emoji:"🥔", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Mg" },
  { name:"Rice", emoji:"🌾", sunKey:"Full sun", humKey:"High", nutrients:"N, P, K, Zn" },
  { name:"Maize", emoji:"🌽", sunKey:"Full sun", humKey:"Moderate–high", nutrients:"N, P, K, Zn" },
  { name:"Peach", emoji:"🍑", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Ca, Mg" },
  { name:"Apple", emoji:"🍎", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Ca" },
  { name:"Cactus", emoji:"🌵", sunKey:"Bright/full sun", humKey:"Low", nutrients:"Balanced micronutrients" },
  { name:"Peace Lily", emoji:"🌱", sunKey:"Low–medium", humKey:"Moderate", nutrients:"N, P, K, Mg" },
  { name:"Snake Plant", emoji:"🪴", sunKey:"Low–bright", humKey:"Low", nutrients:"Balanced micronutrients" },
  { name:"Pothos", emoji:"🌿", sunKey:"Medium–bright", humKey:"Moderate", nutrients:"N, P, K, Mg" },
  { name:"Rose", emoji:"🌹", sunKey:"6–8h", humKey:"Moderate", nutrients:"N, P, K, Ca, Mg" }
];

const GEMINI_LANG_NAMES = { en:"English", pt:"Portuguese", fr:"French", es:"Spanish", tr:"Turkish", sw:"Swahili", de:"German", ar:"Arabic" };

/* ---------- Plant display-name translations ---------- */
const NAMES = {
  en:{Tomato:"Tomato",Basil:"Basil",Mango:"Mango","Aloe Vera":"Aloe Vera",Banana:"Banana",Mint:"Mint",Lettuce:"Lettuce",Lemon:"Lemon",Rosemary:"Rosemary",Avocado:"Avocado",Spinach:"Spinach",Strawberry:"Strawberry",Cucumber:"Cucumber",Pepper:"Pepper",Carrot:"Carrot",Potato:"Potato",Rice:"Rice",Maize:"Maize",Peach:"Peach",Apple:"Apple",Cactus:"Cactus","Peace Lily":"Peace Lily","Snake Plant":"Snake Plant",Pothos:"Pothos",Rose:"Rose"},
  pt:{Tomato:"Tomate",Basil:"Manjericão",Mango:"Manga","Aloe Vera":"Aloe Vera",Banana:"Banana",Mint:"Hortelã",Lettuce:"Alface",Lemon:"Limão",Rosemary:"Alecrim",Avocado:"Abacate",Spinach:"Espinafre",Strawberry:"Morango",Cucumber:"Pepino",Pepper:"Pimento",Carrot:"Cenoura",Potato:"Batata",Rice:"Arroz",Maize:"Milho",Peach:"Pêssego",Apple:"Maçã",Cactus:"Cato","Peace Lily":"Lírio-da-paz","Snake Plant":"Espada-de-São-Jorge",Pothos:"Jiboia",Rose:"Rosa"},
  fr:{Tomato:"Tomate",Basil:"Basilic",Mango:"Mangue","Aloe Vera":"Aloe vera",Banana:"Banane",Mint:"Menthe",Lettuce:"Laitue",Lemon:"Citron",Rosemary:"Romarin",Avocado:"Avocat",Spinach:"Épinard",Strawberry:"Fraise",Cucumber:"Concombre",Pepper:"Poivron",Carrot:"Carotte",Potato:"Pomme de terre",Rice:"Riz",Maize:"Maïs",Peach:"Pêche",Apple:"Pomme",Cactus:"Cactus","Peace Lily":"Lys de la paix","Snake Plant":"Sansevière",Pothos:"Pothos",Rose:"Rose"},
  es:{Tomato:"Tomate",Basil:"Albahaca",Mango:"Mango","Aloe Vera":"Aloe vera",Banana:"Plátano",Mint:"Menta",Lettuce:"Lechuga",Lemon:"Limón",Rosemary:"Romero",Avocado:"Aguacate",Spinach:"Espinaca",Strawberry:"Fresa",Cucumber:"Pepino",Pepper:"Pimiento",Carrot:"Zanahoria",Potato:"Patata",Rice:"Arroz",Maize:"Maíz",Peach:"Melocotón",Apple:"Manzana",Cactus:"Cactus","Peace Lily":"Lirio de la paz","Snake Plant":"Sansevieria",Pothos:"Poto",Rose:"Rosa"},
  tr:{Tomato:"Domates",Basil:"Fesleğen",Mango:"Mango","Aloe Vera":"Aloe vera",Banana:"Muz",Mint:"Nane",Lettuce:"Marul",Lemon:"Limon",Rosemary:"Biberiye",Avocado:"Avokado",Spinach:"Ispanak",Strawberry:"Çilek",Cucumber:"Salatalık",Pepper:"Biber",Carrot:"Havuç",Potato:"Patates",Rice:"Pirinç",Maize:"Mısır",Peach:"Şeftali",Apple:"Elma",Cactus:"Kaktüs","Peace Lily":"Barış çiçeği","Snake Plant":"Paşa kılıcı",Pothos:"Salon sarmaşığı",Rose:"Gül"},
  sw:{Tomato:"Nyanya",Basil:"Basil",Mango:"Embe","Aloe Vera":"Aloe vera",Banana:"Ndizi",Mint:"Mnanaa",Lettuce:"Letusi",Lemon:"Limau",Rosemary:"Rosemary",Avocado:"Parachichi",Spinach:"Spinachi",Strawberry:"Stroberi",Cucumber:"Tango",Pepper:"Pilipili",Carrot:"Karoti",Potato:"Viazi",Rice:"Mchele",Maize:"Mahindi",Peach:"Pichi",Apple:"Tufaha",Cactus:"Kaktasi","Peace Lily":"Peace lily","Snake Plant":"Mkonge wa nyoka",Pothos:"Pothos",Rose:"Waridi"},
  de:{Tomato:"Tomate",Basil:"Basilikum",Mango:"Mango","Aloe Vera":"Aloe vera",Banana:"Banane",Mint:"Minze",Lettuce:"Salat",Lemon:"Zitrone",Rosemary:"Rosmarin",Avocado:"Avocado",Spinach:"Spinat",Strawberry:"Erdbeere",Cucumber:"Gurke",Pepper:"Paprika",Carrot:"Karotte",Potato:"Kartoffel",Rice:"Reis",Maize:"Mais",Peach:"Pfirsich",Apple:"Apfel",Cactus:"Kaktus","Peace Lily":"Einblatt","Snake Plant":"Bogenhanf",Pothos:"Efeutute",Rose:"Rose"},
  ar:{Tomato:"طماطم",Basil:"ريحان",Mango:"مانجو","Aloe Vera":"ألوفيرا",Banana:"موز",Mint:"نعناع",Lettuce:"خس",Lemon:"ليمون",Rosemary:"إكليل الجبل",Avocado:"أفوكادو",Spinach:"سبانخ",Strawberry:"فراولة",Cucumber:"خيار",Pepper:"فلفل",Carrot:"جزر",Potato:"بطاطس",Rice:"أرز",Maize:"ذرة",Peach:"خوخ",Apple:"تفاح",Cactus:"صبار","Peace Lily":"زنبق السلام","Snake Plant":"نبات الثعبان",Pothos:"بوتس",Rose:"ورد"}
};

/* ---------- Short phrase tokens reused across plants + library ---------- */
const PHRASE_BANK = {
  "Check soil regularly": {pt:"Verifique o solo regularmente",fr:"Vérifiez régulièrement le sol",es:"Revisa el suelo con regularidad",tr:"Toprağı düzenli kontrol edin",sw:"Kagua udongo mara kwa mara",de:"Boden regelmäßig prüfen",ar:"افحص التربة بانتظام"},
  "Keep soil lightly moist": {pt:"Mantenha o solo ligeiramente húmido",fr:"Gardez le sol légèrement humide",es:"Mantén la tierra ligeramente húmeda",tr:"Toprağı hafif nemli tutun",sw:"Weka udongo na unyevu kidogo",de:"Erde leicht feucht halten",ar:"حافظ على رطوبة التربة قليلًا"},
  "Deep watering when needed": {pt:"Regue profundamente quando necessário",fr:"Arrosez abondamment si nécessaire",es:"Riega profundamente cuando sea necesario",tr:"Gerektiğinde derin sulayın",sw:"Mwagilia kwa kina inapohitajika",de:"Bei Bedarf gründlich gießen",ar:"اسقِ بعمق عند الحاجة"},
  "Let soil dry between waterings": {pt:"Deixe o solo secar entre regas",fr:"Laissez sécher le sol entre les arrosages",es:"Deja secar la tierra entre riegos",tr:"Sulamalar arasında toprağı kurutun",sw:"Acha udongo ukauke kati ya umwagiliaji",de:"Erde zwischen dem Gießen trocknen lassen",ar:"اترك التربة تجف بين مرات الري"},
  "Possible water/nutrient stress": {pt:"Possível stress hídrico/nutricional",fr:"Stress hydrique/nutritionnel possible",es:"Posible estrés hídrico/nutricional",tr:"Olası su/besin stresi",sw:"Msongo wa maji/virutubisho unaowezekana",de:"Möglicher Wasser-/Nährstoffstress",ar:"إجهاد محتمل بسبب الماء/العناصر الغذائية"},
  "Full sun": {pt:"Sol pleno",fr:"Plein soleil",es:"Pleno sol",tr:"Tam güneş",sw:"Jua kamili",de:"Volle Sonne",ar:"شمس كاملة"},
  "Bright light": {pt:"Luz intensa",fr:"Lumière vive",es:"Luz brillante",tr:"Parlak ışık",sw:"Mwanga mkali",de:"Helles Licht",ar:"ضوء ساطع"},
  "Bright": {pt:"Luz intensa",fr:"Lumière vive",es:"Luz brillante",tr:"Parlak ışık",sw:"Mwanga mkali",de:"Helles Licht",ar:"ضوء ساطع"},
  "Bright/full sun": {pt:"Luz intensa / sol pleno",fr:"Lumière vive / plein soleil",es:"Luz brillante / pleno sol",tr:"Parlak ışık / tam güneş",sw:"Mwanga mkali / jua kamili",de:"Helles Licht / volle Sonne",ar:"ضوء ساطع / شمس كاملة"},
  "Low–medium": {pt:"Baixa–média",fr:"Faible–moyenne",es:"Baja–media",tr:"Düşük–orta",sw:"Chini–wastani",de:"Niedrig–mittel",ar:"منخفض–متوسط"},
  "Low–bright": {pt:"Baixa–intensa",fr:"Faible–vive",es:"Baja–brillante",tr:"Düşük–parlak",sw:"Chini–mkali",de:"Niedrig–hell",ar:"منخفض–ساطع"},
  "Medium–bright": {pt:"Média–intensa",fr:"Moyenne–vive",es:"Media–brillante",tr:"Orta–parlak",sw:"Wastani–mkali",de:"Mittel–hell",ar:"متوسط–ساطع"},
  "Moderate": {pt:"Moderada",fr:"Modérée",es:"Moderada",tr:"Orta",sw:"Wastani",de:"Mäßig",ar:"معتدلة"},
  "Moderate–high": {pt:"Moderada–alta",fr:"Modérée–élevée",es:"Moderada–alta",tr:"Orta–yüksek",sw:"Wastani–juu",de:"Mäßig–hoch",ar:"معتدلة–عالية"},
  "Low": {pt:"Baixa",fr:"Faible",es:"Baja",tr:"Düşük",sw:"Chini",de:"Niedrig",ar:"منخفضة"},
  "High": {pt:"Alta",fr:"Élevée",es:"Alta",tr:"Yüksek",sw:"Juu",de:"Hoch",ar:"عالية"},
  "Low–moderate": {pt:"Baixa–moderada",fr:"Faible–modérée",es:"Baja–moderada",tr:"Düşük–orta",sw:"Chini–wastani",de:"Niedrig–mäßig",ar:"منخفضة–معتدلة"},
  "Fertile, well-drained": {pt:"Fértil e bem drenado",fr:"Fertile et bien drainé",es:"Fértil y bien drenado",tr:"Verimli, iyi drene",sw:"Wenye rutuba, unaotoa maji vizuri",de:"Fruchtbar, gut durchlässig",ar:"خصبة وجيدة الصرف"},
  "Rich, well-drained": {pt:"Rico e bem drenado",fr:"Riche et bien drainé",es:"Rico y bien drenado",tr:"Zengin, iyi drene",sw:"Wenye virutubisho, unaotoa maji vizuri",de:"Nährstoffreich, gut durchlässig",ar:"غنية وجيدة الصرف"},
  "Deep, well-drained": {pt:"Profundo e bem drenado",fr:"Profond et bien drainé",es:"Profundo y bien drenado",tr:"Derin, iyi drene",sw:"Wenye kina, unaotoa maji vizuri",de:"Tiefgründig, gut durchlässig",ar:"عميقة وجيدة الصرف"},
  "Very well-drained": {pt:"Muito bem drenado",fr:"Très bien drainé",es:"Muy bien drenado",tr:"Çok iyi drene",sw:"Unaotoa maji vizuri sana",de:"Sehr gut durchlässig",ar:"جيدة الصرف جدًا"},
  "Fruit vegetable": {pt:"Hortícola-fruto",fr:"Légume-fruit",es:"Hortaliza de fruto",tr:"Meyve sebzesi",sw:"Mboga-tunda",de:"Fruchtgemüse",ar:"خضروات ثمرية"},
  "Herb": {pt:"Erva aromática",fr:"Herbe aromatique",es:"Hierba aromática",tr:"Ot/baharat bitkisi",sw:"Mmea wa viungo",de:"Kräuterpflanze",ar:"عشبة"},
  "Fruit tree": {pt:"Árvore de fruto",fr:"Arbre fruitier",es:"Árbol frutal",tr:"Meyve ağacı",sw:"Mti wa matunda",de:"Obstbaum",ar:"شجرة مثمرة"},
  "Succulent": {pt:"Suculenta",fr:"Plante succulente",es:"Suculenta",tr:"Sukulent",sw:"Mmea unaotunza maji",de:"Sukkulente",ar:"نبات عصاري"},
  "Monitor moisture, support stems and inspect leaves.": {pt:"Monitorize a humidade, apoie os caules e inspecione as folhas.",fr:"Surveillez l'humidité, soutenez les tiges et inspectez les feuilles.",es:"Supervisa la humedad, apoya los tallos e inspecciona las hojas.",tr:"Nemi izleyin, gövdeleri destekleyin ve yaprakları inceleyin.",sw:"Fuatilia unyevu, saidia mashina na kagua majani.",de:"Feuchtigkeit überwachen, Stängel stützen und Blätter untersuchen.",ar:"راقب الرطوبة، وادعم السيقان، وافحص الأوراق."},
  "Pinch growing tips and avoid waterlogged soil.": {pt:"Belisque as pontas de crescimento e evite solo encharcado.",fr:"Pincez les pousses et évitez un sol détrempé.",es:"Pellizca las puntas de crecimiento y evita el suelo encharcado.",tr:"Uç sürgünleri sıkıştırın ve su birikintili topraktan kaçının.",sw:"Bana ncha za ukuaji na epuka udongo uliojaa maji.",de:"Triebspitzen kneifen und staunasse Erde vermeiden.",ar:"اقرص أطراف النمو وتجنب تشبع التربة بالماء."},
  "Give strong light and avoid constantly waterlogged roots.": {pt:"Dê luz intensa e evite raízes constantemente encharcadas.",fr:"Offrez une lumière forte et évitez des racines constamment détrempées.",es:"Ofrece luz intensa y evita raíces constantemente encharcadas.",tr:"Güçlü ışık verin ve köklerin sürekli su birikintili kalmasından kaçının.",sw:"Toa mwanga mkali na epuka mizizi kujaa maji mara kwa mara.",de:"Für starkes Licht sorgen und dauerhaft nasse Wurzeln vermeiden.",ar:"وفّر ضوءًا قويًا وتجنب بقاء الجذور مشبعة بالماء باستمرار."},
  "Use a draining container and avoid frequent watering.": {pt:"Use um recipiente com boa drenagem e evite regas frequentes.",fr:"Utilisez un contenant bien drainé et évitez les arrosages fréquents.",es:"Usa un recipiente con buen drenaje y evita riegos frecuentes.",tr:"Drenajlı bir kap kullanın ve sık sulamadan kaçının.",sw:"Tumia chombo chenye mifereji ya maji na epuka kumwagilia mara kwa mara.",de:"Einen Topf mit gutem Abfluss verwenden und häufiges Gießen vermeiden.",ar:"استخدم وعاءً جيد الصرف وتجنب الري المتكرر."},
  "Balanced micronutrients": {pt:"Micronutrientes equilibrados",fr:"Micronutriments équilibrés",es:"Micronutrientes equilibrados",tr:"Dengeli mikrobesinler",sw:"Virutubisho vidogo vilivyosawazishwa",de:"Ausgewogene Mikronährstoffe",ar:"عناصر دقيقة متوازنة"},
  "Depends on conditions": {pt:"Depende das condições",fr:"Dépend des conditions",es:"Depende de las condiciones",tr:"Koşullara bağlıdır",sw:"Inategemea hali",de:"Abhängig von den Bedingungen",ar:"يعتمد على الظروف"},
  "To be determined": {pt:"A determinar",fr:"À déterminer",es:"Por determinar",tr:"Belirlenecek",sw:"Itaamuliwa baadaye",de:"Noch zu bestimmen",ar:"سيتم تحديده"},
  "Species profile needed": {pt:"Necessário perfil da espécie",fr:"Profil de l'espèce nécessaire",es:"Se necesita el perfil de la especie",tr:"Tür profili gerekli",sw:"Wasifu wa spishi unahitajika",de:"Artprofil erforderlich",ar:"يلزم ملف تعريف النوع"},
  "Newly added — monitor": {pt:"Recém-adicionada — monitorizar",fr:"Récemment ajoutée — à surveiller",es:"Recién añadida — supervisar",tr:"Yeni eklendi — izleyin",sw:"Imeongezwa hivi karibuni — fuatilia",de:"Neu hinzugefügt — beobachten",ar:"أُضيف حديثًا — راقبه"},
  "Well-drained where appropriate": {pt:"Bem drenado quando aplicável",fr:"Bien drainé si approprié",es:"Bien drenado cuando corresponda",tr:"Uygun olduğunda iyi drene",sw:"Unaotoa maji vizuri inapofaa",de:"Wo passend gut durchlässig",ar:"جيدة الصرف حسب الحاجة"},
  "Species dependent": {pt:"Depende da espécie",fr:"Dépend de l'espèce",es:"Depende de la especie",tr:"Türe bağlıdır",sw:"Inategemea spishi",de:"Artabhängig",ar:"يعتمد على النوع"},
  "Plant": {pt:"Planta",fr:"Plante",es:"Planta",tr:"Bitki",sw:"Mmea",de:"Pflanze",ar:"نبات"},
  "Monitor regularly and follow the species profile.": {pt:"Monitorize regularmente e siga o perfil da espécie.",fr:"Surveillez régulièrement et suivez le profil de l'espèce.",es:"Supervisa regularmente y sigue el perfil de la especie.",tr:"Düzenli olarak izleyin ve tür profilini takip edin.",sw:"Fuatilia mara kwa mara na fuata wasifu wa spishi.",de:"Regelmäßig beobachten und dem Artprofil folgen.",ar:"راقب بانتظام واتبع ملف تعريف النوع."},
  "Healthy": {pt:"Saudável",fr:"En bonne santé",es:"Saludable",tr:"Sağlıklı",sw:"Mwenye afya",de:"Gesund",ar:"سليم"}
};
function tr(token){
  if(!token) return token;
  const l = state.lang;
  if(l==="en") return token;
  return (PHRASE_BANK[token] && PHRASE_BANK[token][l]) || token;
}
function plantName(englishName){
  const d = NAMES[state.lang] || NAMES.en;
  return d[englishName] || englishName;
}

/* ---------- Nutrient center content (name/description/note per language) ---------- */
const NUTRIENTS = {
  en:[["🍃","Nitrogen (N)","Supports leaf and vegetative growth.","Yellowing older leaves can have many causes; confirm with testing."],
      ["🌱","Phosphorus (P)","Important for roots, energy transfer and reproduction.","Availability depends strongly on soil chemistry."],
      ["💪","Potassium (K)","Supports water regulation and many plant processes.","Symptoms vary by crop and environment."],
      ["🧱","Calcium (Ca)","Important for cell walls and growing tissues.","Movement within the plant is limited."],
      ["🌿","Magnesium (Mg)","Central component of chlorophyll.","Deficiency patterns can resemble other stresses."],
      ["🟢","Iron (Fe)","Needed for chlorophyll formation and electron-transfer processes.","Young leaves can show deficiency symptoms."],
      ["🔬","Zinc (Zn)","Supports enzyme activity and plant growth.","Deficiency is best confirmed with testing."],
      ["🧬","Sulfur (S)","Used in amino acids and proteins.","Symptoms can resemble nitrogen deficiency."]],
  pt:[["🍃","Azoto (N)","Apoia o crescimento das folhas e da parte vegetativa.","O amarelecimento de folhas mais velhas pode ter várias causas; confirme com testes."],
      ["🌱","Fósforo (P)","Importante para as raízes, transferência de energia e reprodução.","A disponibilidade depende fortemente da química do solo."],
      ["💪","Potássio (K)","Apoia a regulação da água e muitos processos da planta.","Os sintomas variam consoante a cultura e o ambiente."],
      ["🧱","Cálcio (Ca)","Importante para as paredes celulares e os tecidos em crescimento.","A circulação dentro da planta é limitada."],
      ["🌿","Magnésio (Mg)","Componente central da clorofila.","Os padrões de deficiência podem assemelhar-se a outros tipos de stress."],
      ["🟢","Ferro (Fe)","Necessário para a formação de clorofila e processos de transferência de eletrões.","As folhas mais jovens podem mostrar sinais de deficiência."],
      ["🔬","Zinco (Zn)","Apoia a atividade enzimática e o crescimento da planta.","A deficiência é melhor confirmada através de testes."],
      ["🧬","Enxofre (S)","Utilizado em aminoácidos e proteínas.","Os sintomas podem assemelhar-se a uma deficiência de azoto."]],
  fr:[["🍃","Azote (N)","Favorise la croissance des feuilles et des parties végétatives.","Le jaunissement des feuilles plus âgées peut avoir plusieurs causes ; confirmez par des tests."],
      ["🌱","Phosphore (P)","Important pour les racines, le transfert d'énergie et la reproduction.","La disponibilité dépend fortement de la chimie du sol."],
      ["💪","Potassium (K)","Favorise la régulation de l'eau et de nombreux processus de la plante.","Les symptômes varient selon la culture et l'environnement."],
      ["🧱","Calcium (Ca)","Important pour les parois cellulaires et les tissus en croissance.","Sa circulation dans la plante est limitée."],
      ["🌿","Magnésium (Mg)","Composant central de la chlorophylle.","Les signes de carence peuvent ressembler à d'autres stress."],
      ["🟢","Fer (Fe)","Nécessaire à la formation de la chlorophylle et aux processus de transfert d'électrons.","Les jeunes feuilles peuvent montrer des signes de carence."],
      ["🔬","Zinc (Zn)","Favorise l'activité enzymatique et la croissance de la plante.","Une carence se confirme au mieux par des tests."],
      ["🧬","Soufre (S)","Utilisé dans les acides aminés et les protéines.","Les symptômes peuvent ressembler à une carence en azote."]],
  es:[["🍃","Nitrógeno (N)","Favorece el crecimiento de las hojas y la parte vegetativa.","El amarilleo de las hojas más viejas puede tener muchas causas; confírmalo con pruebas."],
      ["🌱","Fósforo (P)","Importante para las raíces, la transferencia de energía y la reproducción.","La disponibilidad depende en gran medida de la química del suelo."],
      ["💪","Potasio (K)","Favorece la regulación del agua y muchos procesos de la planta.","Los síntomas varían según el cultivo y el entorno."],
      ["🧱","Calcio (Ca)","Importante para las paredes celulares y los tejidos en crecimiento.","Su movimiento dentro de la planta es limitado."],
      ["🌿","Magnesio (Mg)","Componente central de la clorofila.","Los patrones de deficiencia pueden parecerse a otros tipos de estrés."],
      ["🟢","Hierro (Fe)","Necesario para la formación de clorofila y los procesos de transferencia de electrones.","Las hojas jóvenes pueden mostrar signos de deficiencia."],
      ["🔬","Zinc (Zn)","Favorece la actividad enzimática y el crecimiento de la planta.","La deficiencia se confirma mejor con pruebas."],
      ["🧬","Azufre (S)","Se utiliza en aminoácidos y proteínas.","Los síntomas pueden parecerse a una deficiencia de nitrógeno."]],
  tr:[["🍃","Azot (N)","Yaprak ve vejetatif büyümeyi destekler.","Eski yaprakların sararması birçok nedenden kaynaklanabilir; testle doğrulayın."],
      ["🌱","Fosfor (P)","Kökler, enerji aktarımı ve üreme için önemlidir.","Kullanılabilirliği toprak kimyasına büyük ölçüde bağlıdır."],
      ["💪","Potasyum (K)","Su düzenlemesini ve birçok bitki sürecini destekler.","Belirtiler ürüne ve ortama göre değişir."],
      ["🧱","Kalsiyum (Ca)","Hücre duvarları ve büyüyen dokular için önemlidir.","Bitki içindeki hareketi sınırlıdır."],
      ["🌿","Magnezyum (Mg)","Klorofilin ana bileşenidir.","Eksiklik belirtileri diğer stres türlerine benzeyebilir."],
      ["🟢","Demir (Fe)","Klorofil oluşumu ve elektron transfer süreçleri için gereklidir.","Genç yapraklarda eksiklik belirtileri görülebilir."],
      ["🔬","Çinko (Zn)","Enzim aktivitesini ve bitki büyümesini destekler.","Eksiklik en iyi testle doğrulanır."],
      ["🧬","Kükürt (S)","Amino asitler ve proteinlerde kullanılır.","Belirtiler azot eksikliğine benzeyebilir."]],
  sw:[["🍃","Nitrojeni (N)","Inasaidia ukuaji wa majani na sehemu za mmea.","Njano kwenye majani ya zamani inaweza kuwa na sababu nyingi; thibitisha kwa kupima."],
      ["🌱","Fosforasi (P)","Muhimu kwa mizizi, uhamishaji wa nishati na uzazi.","Upatikanaji unategemea sana kemia ya udongo."],
      ["💪","Potasiamu (K)","Inasaidia udhibiti wa maji na michakato mingi ya mmea.","Dalili hutofautiana kulingana na zao na mazingira."],
      ["🧱","Kalsiamu (Ca)","Muhimu kwa kuta za seli na tishu zinazokua.","Msogeo wake ndani ya mmea ni mdogo."],
      ["🌿","Magnesiamu (Mg)","Kiungo kikuu cha klorofili.","Dalili za upungufu zinaweza kufanana na msongo mwingine."],
      ["🟢","Chuma (Fe)","Kinahitajika kwa uundaji wa klorofili na michakato ya uhamishaji elektroni.","Majani machanga yanaweza kuonyesha dalili za upungufu."],
      ["🔬","Zinki (Zn)","Inasaidia shughuli za enzaimu na ukuaji wa mmea.","Upungufu unathibitishwa vyema kwa kupima."],
      ["🧬","Salfa (S)","Inatumika katika amino asidi na protini.","Dalili zinaweza kufanana na upungufu wa nitrojeni."]],
  de:[["🍃","Stickstoff (N)","Unterstützt Blatt- und Vegetationswachstum.","Vergilbung älterer Blätter kann viele Ursachen haben; durch Tests bestätigen."],
      ["🌱","Phosphor (P)","Wichtig für Wurzeln, Energietransfer und Fortpflanzung.","Die Verfügbarkeit hängt stark von der Bodenchemie ab."],
      ["💪","Kalium (K)","Unterstützt die Wasserregulation und viele Pflanzenprozesse.","Die Symptome variieren je nach Pflanze und Umgebung."],
      ["🧱","Kalzium (Ca)","Wichtig für Zellwände und wachsendes Gewebe.","Die Beweglichkeit innerhalb der Pflanze ist begrenzt."],
      ["🌿","Magnesium (Mg)","Zentraler Bestandteil des Chlorophylls.","Mangelsymptome können anderem Stress ähneln."],
      ["🟢","Eisen (Fe)","Notwendig für die Chlorophyllbildung und Elektronentransportprozesse.","Junge Blätter können Mangelerscheinungen zeigen."],
      ["🔬","Zink (Zn)","Unterstützt Enzymaktivität und Pflanzenwachstum.","Ein Mangel wird am besten durch Tests bestätigt."],
      ["🧬","Schwefel (S)","Wird in Aminosäuren und Proteinen verwendet.","Die Symptome können einem Stickstoffmangel ähneln."]],
  ar:[["🍃","النيتروجين (N)","يدعم نمو الأوراق والنمو الخضري.","اصفرار الأوراق الأقدم قد يكون له أسباب عديدة؛ تأكد عبر الفحص."],
      ["🌱","الفوسفور (P)","مهم للجذور ونقل الطاقة والتكاثر.","يعتمد توفره بشكل كبير على كيمياء التربة."],
      ["💪","البوتاسيوم (K)","يدعم تنظيم الماء والعديد من عمليات النبات.","تختلف الأعراض حسب المحصول والبيئة."],
      ["🧱","الكالسيوم (Ca)","مهم لجدران الخلايا والأنسجة النامية.","حركته داخل النبات محدودة."],
      ["🌿","المغنيسيوم (Mg)","مكوّن أساسي في الكلوروفيل.","أنماط النقص قد تشبه أنواع إجهاد أخرى."],
      ["🟢","الحديد (Fe)","ضروري لتكوين الكلوروفيل وعمليات نقل الإلكترونات.","قد تظهر الأوراق الصغيرة أعراض النقص."],
      ["🔬","الزنك (Zn)","يدعم نشاط الإنزيمات ونمو النبات.","يُفضَّل تأكيد النقص عبر الفحص."],
      ["🧬","الكبريت (S)","يُستخدم في الأحماض الأمينية والبروتينات.","قد تشبه الأعراض نقص النيتروجين."]]
};

/* ---------- Achievements ---------- */
const ACHIEVEMENTS = {
  en:[["🌱","First Plant","Added your first plant"],["📷","Plant Detective","Completed 5 scans"],["💧","Water Warrior","Completed 10 care tasks"],["🔥","Green Thumb","Maintained a care streak"]],
  pt:[["🌱","Primeira Planta","Adicionou a sua primeira planta"],["📷","Detetive das Plantas","Concluiu 5 análises"],["💧","Guerreiro da Água","Concluiu 10 tarefas de cuidado"],["🔥","Mão Verde","Manteve uma sequência de cuidados"]],
  fr:[["🌱","Première Plante","Vous avez ajouté votre première plante"],["📷","Détective des Plantes","5 analyses effectuées"],["💧","Guerrier de l'Eau","10 tâches de soin effectuées"],["🔥","Pouce Vert","Série de soins maintenue"]],
  es:[["🌱","Primera Planta","Añadiste tu primera planta"],["📷","Detective de Plantas","Completaste 5 escaneos"],["💧","Guerrero del Agua","Completaste 10 tareas de cuidado"],["🔥","Buena Mano","Mantuviste una racha de cuidados"]],
  tr:[["🌱","İlk Bitki","İlk bitkinizi eklediniz"],["📷","Bitki Dedektifi","5 tarama tamamlandı"],["💧","Su Savaşçısı","10 bakım görevi tamamlandı"],["🔥","Yeşil Parmak","Bakım serisi sürdürüldü"]],
  sw:[["🌱","Mmea wa Kwanza","Umeongeza mmea wako wa kwanza"],["📷","Upelelezi wa Mimea","Umekamilisha uchanganuzi 5"],["💧","Shujaa wa Maji","Umekamilisha kazi 10 za utunzaji"],["🔥","Kidole cha Kijani","Umedumisha mfululizo wa utunzaji"]],
  de:[["🌱","Erste Pflanze","Du hast deine erste Pflanze hinzugefügt"],["📷","Pflanzendetektiv","5 Scans abgeschlossen"],["💧","Wasserkrieger","10 Pflegeaufgaben erledigt"],["🔥","Grüner Daumen","Pflegeserie beibehalten"]],
  ar:[["🌱","أول نبتة","أضفت أول نبتة لك"],["📷","محقق النباتات","أكملت 5 عمليات فحص"],["💧","محارب الماء","أكملت 10 مهام عناية"],["🔥","بصمة خضراء","حافظت على تسلسل العناية"]]
};

/* ---------- Full UI text dictionary ---------- */
const UI = {
en:{brandName:"Modern Agriculture Technology",greet:"Good morning,",subtitle:"Your personalized plant-care dashboard.",ready:"Modern Agriculture Technology is ready",myDetails:"My details",navDashboard:"Dashboard",navPlants:"My Plants",navScan:"Scan Plant",navLibrary:"Plant Library",navAI:"AI Assistant",navReminders:"Reminders",navAnalytics:"Analytics",navNutrients:"Nutrients",navSettings:"Settings",heroEyebrow:"AI-POWERED PLANT CARE",heroTitle:"Understand your plants. Help them grow.",heroText:"Identify plants, monitor health, learn their sunlight and nutrient needs, and build a personalized care routine.",scan:"📷 Scan a Plant",add:"＋ Add Plant",careChecks:"Care checks today",lightTracked:"Light tracked",nutrientWarning:"Nutrient warning",overallHealth:"Overall health",carePlan:"🔔 Today's care plan",personalized:"Personalized tasks based on your plants.",insight:"🤖 Modern Agriculture Technology insight",insightGood:"Your plants are looking great. Keep up the good care routine!",insightBad:"{plant} needs attention.",insightBadBody:"Your latest profile shows moderate water stress and a possible nutrient issue. Check soil before watering or fertilizing.",askMAT:"Ask Modern Agriculture Technology AI →",environment:"🌦️ Environment",temperature:"Temperature",humidity:"Humidity",conditions:"Conditions",yourPlants:"Your plants",scanIdentify:"📷 Scan & Identify",plantLibrary:"📚 Plant Library",explore:"Explore light, water, soil, climate, nutrients and common care notes.",searchPlaceholder:"Search 25+ plants...",remindersTitle:"🔔 Smart Reminders",reminderExplain:"Reminders encourage you to check conditions rather than blindly following a fixed watering schedule.",addReminder:"＋ Add plant reminder",tablePlant:"Plant",tableTask:"Task",tableTime:"Time",tableStatus:"Status",plantsTrackedLabel:"Plants tracked",tasksCompletedLabel:"Tasks completed",scansCompletedLabel:"Scans completed",careStreakLabel:"Care streak",healthTrend:"📈 Health trend",achievements:"🏆 Achievements",nutrientCenter:"🧪 Nutrient Center",nutrientExplain:"Learn what nutrients do. A visible symptom alone cannot reliably prove a deficiency, so soil or tissue testing is recommended before treating a suspected deficiency.",note:"Note",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Ask about plant care, symptoms, sunlight, watering, soil or nutrients.",aiWelcome:"🌱 Hi! I'm MAT AI. Ask me about a plant or describe a problem.",askPlaceholder:"Ask MAT AI...",send:"Send",displayName:"Display name",defaultReminder:"Default reminder time",language:"Language",appearance:"Appearance / Theme",save:"Save settings",lightClassic:"Light — Classic",darkForest:"Dark — Forest",lightMint:"Light — Mint",lightOcean:"Light — Ocean",darkMidnight:"Dark — Midnight",darkSage:"Dark — Sage",myProfile:"👤 Your MAT profile",profileHelp:"You only need to enter a name or nickname. MAT uses it to personalize your dashboard.",yourName:"Your name",exampleName:"e.g. Alex",saveName:"Save my name",addPlantTitle:"🌱 Add a Plant",addHelp:"Keep it simple: enter a plant name, or use Scan Plant to identify it.",plantName:"Plant name",where:"Where is it?",indoor:"Indoor",outdoor:"Outdoor",balcony:"Balcony",garden:"Garden",greenhouse:"Greenhouse",reminderTime:"Reminder time",addToMyPlants:"Add to My Plants",scannerTitle:"📷 Modern Agriculture Technology Plant Scanner",scannerNote:"Upload a clear photo. MAT AI will analyze it and suggest possible care needs.",choosePhoto:"Choose a plant photo",scanBusyTitle:"🌿 MAT AI is analyzing...",waitScan:"Please wait while I examine your plant.",scanUnavailable:"⚠️ Scanner unavailable",tryAnotherPhoto:"Please try another clear plant photo.",analysisComplete:"🌱 Plant analysis complete!",scanResultHeading:"🌿 MAT AI result",scanImportantNote:"Important: a photo can suggest possible stress or deficiency, but it cannot confirm a nutrient deficiency. Soil/tissue testing is more reliable.",reviewBeforeAdd:"Review the result before adding this plant.",footerText:"Modern Agriculture Technology AI • Semantic HTML • Modular CSS • JavaScript state • Responsive UI",darkMode:"Dark mode",lightMode:"Light mode",remove:"Remove",removeConfirm:"Remove this plant from My Plants? This can't be undone.",confirm:"Remove",cancel:"Cancel",viewProfile:"View full profile",healthy:"Healthy",monitor:"Monitor",water:"Water",sun:"Sun",keyNutrients:"Nutrients",issue:"Issue",noPlants:"No plants yet. Add one to get started.",plantAdded:"{plant} added to My Plants 🌱",plantRemoved:"Plant removed 🌱",languageUpdated:"Language updated ✓",settingsSaved:"Settings saved ✓",needAttention:"Needs attention",scheduled:"Scheduled",taskCompleted:"Task completed ✓",taskReopened:"Task reopened",checkSoil:"Check soil moisture",waterCheck:"Water/check soil",inspectLeaves:"Inspect leaves",rotatePlant:"Rotate",today:"Today",daily:"Daily",dayMonday:"Monday",dayWednesday:"Wednesday",dayFriday:"Friday",soil:"Soil",temperatureLabel:"Temperature",humidityLabel:"Humidity",growth:"Type",care:"Care",confidence:"Identification confidence",estimatedHealth:"Estimated health",waterNeed:"Water need",aiFindings:"AI findings",detailsTitle:"Plant profile",close:"Close",nameFieldRequired:"Please enter a plant name",scannerKeyMissing:"AI scanning isn't configured yet. Add a Gemini API key to enable it.",aiKeyMissing:"AI chat isn't configured yet. Add a Gemini API key to enable it.",aiBusy:"⚠️ AI is temporarily busy. Please try again in a few seconds.",scanFailed:"Plant scan failed"},
pt:{brandName:"Tecnologia Agrícola Moderna",greet:"Bom dia,",subtitle:"O seu painel personalizado de cuidados com plantas.",ready:"A Modern Agriculture Technology está pronta",myDetails:"Os meus dados",navDashboard:"Painel",navPlants:"Minhas plantas",navScan:"Analisar planta",navLibrary:"Biblioteca de plantas",navAI:"Assistente IA",navReminders:"Lembretes",navAnalytics:"Análises",navNutrients:"Nutrientes",navSettings:"Definições",heroEyebrow:"CUIDADOS COM PLANTAS COM IA",heroTitle:"Compreenda as suas plantas. Ajude-as a crescer.",heroText:"Identifique plantas, acompanhe a saúde, conheça as necessidades de luz e nutrientes e crie uma rotina personalizada.",scan:"📷 Analisar uma planta",add:"＋ Adicionar planta",careChecks:"Verificações de hoje",lightTracked:"Luz monitorizada",nutrientWarning:"Aviso de nutrientes",overallHealth:"Saúde geral",carePlan:"🔔 Plano de cuidados de hoje",personalized:"Tarefas personalizadas com base nas suas plantas.",insight:"🤖 Dica da Modern Agriculture Technology",insightGood:"As suas plantas estão ótimas. Continue com a boa rotina de cuidados!",insightBad:"{plant} precisa de atenção.",insightBadBody:"O seu perfil mais recente mostra stress hídrico moderado e um possível problema de nutrientes. Verifique o solo antes de regar ou adubar.",askMAT:"Perguntar à IA MAT →",environment:"🌦️ Ambiente",temperature:"Temperatura",humidity:"Humidade",conditions:"Condições",yourPlants:"As suas plantas",scanIdentify:"📷 Analisar e identificar",plantLibrary:"📚 Biblioteca de plantas",explore:"Explore luz, água, solo, clima, nutrientes e cuidados comuns.",searchPlaceholder:"Pesquisar mais de 25 plantas...",remindersTitle:"🔔 Lembretes inteligentes",reminderExplain:"Os lembretes ajudam a verificar as condições em vez de seguir horários fixos de rega.",addReminder:"＋ Adicionar lembrete",tablePlant:"Planta",tableTask:"Tarefa",tableTime:"Hora",tableStatus:"Estado",plantsTrackedLabel:"Plantas acompanhadas",tasksCompletedLabel:"Tarefas concluídas",scansCompletedLabel:"Análises concluídas",careStreakLabel:"Sequência de cuidados",healthTrend:"📈 Tendência de saúde",achievements:"🏆 Conquistas",nutrientCenter:"🧪 Centro de nutrientes",nutrientExplain:"Aprenda a função dos nutrientes. Um sintoma visível não confirma uma deficiência; recomenda-se analisar o solo ou tecido vegetal.",note:"Nota",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Pergunte sobre cuidados, sintomas, luz solar, rega, solo ou nutrientes.",aiWelcome:"🌱 Olá! Sou a IA MAT. Pergunte sobre uma planta ou descreva um problema.",askPlaceholder:"Pergunte à IA MAT...",send:"Enviar",displayName:"Nome de apresentação",defaultReminder:"Hora padrão do lembrete",language:"Idioma",appearance:"Aparência / Tema",save:"Guardar definições",lightClassic:"Claro — Clássico",darkForest:"Escuro — Floresta",lightMint:"Claro — Menta",lightOcean:"Claro — Oceano",darkMidnight:"Escuro — Meia-noite",darkSage:"Escuro — Sálvia",myProfile:"👤 Perfil MAT",profileHelp:"Introduza um nome ou apelido para personalizar o painel.",yourName:"O seu nome",exampleName:"ex.: Alex",saveName:"Guardar o meu nome",addPlantTitle:"🌱 Adicionar uma planta",addHelp:"Introduza o nome de uma planta ou use a análise para a identificar.",plantName:"Nome da planta",where:"Onde está?",indoor:"Interior",outdoor:"Exterior",balcony:"Varanda",garden:"Jardim",greenhouse:"Estufa",reminderTime:"Hora do lembrete",addToMyPlants:"Adicionar às minhas plantas",scannerTitle:"📷 Analisador de plantas MAT",scannerNote:"Envie uma fotografia nítida. A IA MAT vai analisá-la e sugerir possíveis cuidados.",choosePhoto:"Escolher uma fotografia",scanBusyTitle:"🌿 A IA MAT está a analisar...",waitScan:"Aguarde enquanto analiso a planta.",scanUnavailable:"⚠️ Analisador indisponível",tryAnotherPhoto:"Tente outra fotografia nítida da planta.",analysisComplete:"🌱 Análise da planta concluída!",scanResultHeading:"🌿 Resultado da IA MAT",scanImportantNote:"Importante: uma foto pode sugerir possível stress ou deficiência, mas não confirma uma deficiência de nutrientes. A análise ao solo/tecido é mais fiável.",reviewBeforeAdd:"Reveja o resultado antes de adicionar esta planta.",footerText:"Modern Agriculture Technology AI • HTML Semântico • CSS Modular • Estado em JavaScript • Interface Responsiva",darkMode:"Modo escuro",lightMode:"Modo claro",remove:"Remover",removeConfirm:"Remover esta planta de Minhas plantas? Esta ação não pode ser anulada.",confirm:"Remover",cancel:"Cancelar",viewProfile:"Ver perfil completo",healthy:"Saudável",monitor:"Monitorizar",water:"Água",sun:"Sol",keyNutrients:"Nutrientes",issue:"Problema",noPlants:"Ainda não há plantas. Adicione uma para começar.",plantAdded:"{plant} adicionada às Minhas plantas 🌱",plantRemoved:"Planta removida 🌱",languageUpdated:"Idioma atualizado ✓",settingsSaved:"Definições guardadas ✓",needAttention:"Precisa de atenção",scheduled:"Agendado",taskCompleted:"Tarefa concluída ✓",taskReopened:"Tarefa reaberta",checkSoil:"Verificar humidade do solo",waterCheck:"Regar/verificar solo",inspectLeaves:"Inspecionar folhas",rotatePlant:"Rodar",today:"Hoje",daily:"Diário",dayMonday:"Segunda",dayWednesday:"Quarta",dayFriday:"Sexta",soil:"Solo",temperatureLabel:"Temperatura",humidityLabel:"Humidade",growth:"Tipo",care:"Cuidados",confidence:"Confiança da identificação",estimatedHealth:"Saúde estimada",waterNeed:"Necessidade de água",aiFindings:"Resultados da IA",detailsTitle:"Perfil da planta",close:"Fechar",nameFieldRequired:"Introduza o nome de uma planta",scannerKeyMissing:"A análise por IA ainda não está configurada. Adicione uma chave de API Gemini para a ativar.",aiKeyMissing:"O chat de IA ainda não está configurado. Adicione uma chave de API Gemini para o ativar.",aiBusy:"⚠️ A IA está temporariamente ocupada. Tente novamente dentro de alguns segundos.",scanFailed:"Falha na análise da planta"},
fr:{brandName:"Technologie Agricole Moderne",greet:"Bonjour,",subtitle:"Votre tableau de bord personnalisé pour vos plantes.",ready:"Modern Agriculture Technology est prête",myDetails:"Mes informations",navDashboard:"Tableau de bord",navPlants:"Mes plantes",navScan:"Scanner une plante",navLibrary:"Bibliothèque",navAI:"Assistant IA",navReminders:"Rappels",navAnalytics:"Analyses",navNutrients:"Nutriments",navSettings:"Paramètres",heroEyebrow:"SOINS DES PLANTES PAR IA",heroTitle:"Comprenez vos plantes. Aidez-les à grandir.",heroText:"Identifiez les plantes, surveillez leur santé et découvrez leurs besoins en lumière et nutriments.",scan:"📷 Scanner une plante",add:"＋ Ajouter une plante",careChecks:"Vérifications du jour",lightTracked:"Lumière suivie",nutrientWarning:"Alerte nutritive",overallHealth:"Santé globale",carePlan:"🔔 Plan de soins du jour",personalized:"Tâches personnalisées selon vos plantes.",insight:"🤖 Conseil Modern Agriculture Technology",insightGood:"Vos plantes se portent très bien. Continuez cette bonne routine de soins !",insightBad:"{plant} a besoin d'attention.",insightBadBody:"Votre dernier profil montre un stress hydrique modéré et un possible problème nutritif. Vérifiez le sol avant d'arroser ou de fertiliser.",askMAT:"Demander à l'IA MAT →",environment:"🌦️ Environnement",temperature:"Température",humidity:"Humidité",conditions:"Conditions",yourPlants:"Vos plantes",scanIdentify:"📷 Scanner et identifier",plantLibrary:"📚 Bibliothèque de plantes",explore:"Découvrez les besoins en lumière, eau, sol, climat et nutriments.",searchPlaceholder:"Rechercher parmi 25+ plantes...",remindersTitle:"🔔 Rappels intelligents",reminderExplain:"Les rappels vous invitent à vérifier les conditions plutôt qu'à suivre un arrosage fixe.",addReminder:"＋ Ajouter un rappel",tablePlant:"Plante",tableTask:"Tâche",tableTime:"Heure",tableStatus:"État",plantsTrackedLabel:"Plantes suivies",tasksCompletedLabel:"Tâches terminées",scansCompletedLabel:"Analyses terminées",careStreakLabel:"Série de soins",healthTrend:"📈 Évolution de la santé",achievements:"🏆 Réussites",nutrientCenter:"🧪 Centre des nutriments",nutrientExplain:"Découvrez le rôle des nutriments. Un symptôme visible ne confirme pas une carence ; une analyse du sol ou des tissus est recommandée.",note:"Remarque",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Posez des questions sur les soins, les symptômes, la lumière, l'arrosage, le sol ou les nutriments.",aiWelcome:"🌱 Bonjour ! Je suis l'IA MAT. Posez une question sur une plante ou décrivez un problème.",askPlaceholder:"Demandez à l'IA MAT...",send:"Envoyer",displayName:"Nom affiché",defaultReminder:"Heure de rappel par défaut",language:"Langue",appearance:"Apparence / Thème",save:"Enregistrer les paramètres",lightClassic:"Clair — Classique",darkForest:"Sombre — Forêt",lightMint:"Clair — Menthe",lightOcean:"Clair — Océan",darkMidnight:"Sombre — Minuit",darkSage:"Sombre — Sauge",myProfile:"👤 Votre profil MAT",profileHelp:"Saisissez un nom ou un surnom pour personnaliser le tableau de bord.",yourName:"Votre nom",exampleName:"ex. Alex",saveName:"Enregistrer mon nom",addPlantTitle:"🌱 Ajouter une plante",addHelp:"Saisissez un nom de plante ou utilisez le scanner pour l'identifier.",plantName:"Nom de la plante",where:"Où se trouve-t-elle ?",indoor:"Intérieur",outdoor:"Extérieur",balcony:"Balcon",garden:"Jardin",greenhouse:"Serre",reminderTime:"Heure du rappel",addToMyPlants:"Ajouter à mes plantes",scannerTitle:"📷 Scanner de plantes MAT",scannerNote:"Importez une photo nette. L'IA MAT l'analysera et suggérera des soins possibles.",choosePhoto:"Choisir une photo",scanBusyTitle:"🌿 L'IA MAT analyse...",waitScan:"Veuillez patienter pendant l'analyse.",scanUnavailable:"⚠️ Scanner indisponible",tryAnotherPhoto:"Essayez une autre photo nette de la plante.",analysisComplete:"🌱 Analyse terminée !",scanResultHeading:"🌿 Résultat de l'IA MAT",scanImportantNote:"Important : une photo peut suggérer un stress ou une carence possible, mais ne peut pas confirmer une carence en nutriments. Une analyse du sol/des tissus est plus fiable.",reviewBeforeAdd:"Vérifiez le résultat avant d'ajouter cette plante.",footerText:"Modern Agriculture Technology AI • HTML Sémantique • CSS Modulaire • État JavaScript • Interface Responsive",darkMode:"Mode sombre",lightMode:"Mode clair",remove:"Supprimer",removeConfirm:"Supprimer cette plante de Mes plantes ? Cette action est irréversible.",confirm:"Supprimer",cancel:"Annuler",viewProfile:"Voir le profil complet",healthy:"En bonne santé",monitor:"À surveiller",water:"Eau",sun:"Soleil",keyNutrients:"Nutriments",issue:"Problème",noPlants:"Aucune plante pour le moment. Ajoutez-en une.",plantAdded:"{plant} ajoutée à Mes plantes 🌱",plantRemoved:"Plante supprimée 🌱",languageUpdated:"Langue mise à jour ✓",settingsSaved:"Paramètres enregistrés ✓",needAttention:"À surveiller",scheduled:"Programmé",taskCompleted:"Tâche terminée ✓",taskReopened:"Tâche rouverte",checkSoil:"Vérifier l'humidité du sol",waterCheck:"Arroser/vérifier le sol",inspectLeaves:"Inspecter les feuilles",rotatePlant:"Tourner",today:"Aujourd'hui",daily:"Quotidien",dayMonday:"Lundi",dayWednesday:"Mercredi",dayFriday:"Vendredi",soil:"Sol",temperatureLabel:"Température",humidityLabel:"Humidité",growth:"Type",care:"Soins",confidence:"Confiance de l'identification",estimatedHealth:"Santé estimée",waterNeed:"Besoin en eau",aiFindings:"Résultats de l'IA",detailsTitle:"Profil de la plante",close:"Fermer",nameFieldRequired:"Veuillez saisir un nom de plante",scannerKeyMissing:"L'analyse par IA n'est pas encore configurée. Ajoutez une clé API Gemini pour l'activer.",aiKeyMissing:"Le chat IA n'est pas encore configuré. Ajoutez une clé API Gemini pour l'activer.",aiBusy:"⚠️ L'IA est temporairement occupée. Réessayez dans quelques secondes.",scanFailed:"Échec de l'analyse"},
es:{brandName:"Tecnología Agrícola Moderna",greet:"Buenos días,",subtitle:"Tu panel personalizado para el cuidado de plantas.",ready:"Modern Agriculture Technology está lista",myDetails:"Mis datos",navDashboard:"Panel",navPlants:"Mis plantas",navScan:"Escanear planta",navLibrary:"Biblioteca de plantas",navAI:"Asistente IA",navReminders:"Recordatorios",navAnalytics:"Análisis",navNutrients:"Nutrientes",navSettings:"Ajustes",heroEyebrow:"CUIDADO DE PLANTAS CON IA",heroTitle:"Comprende tus plantas. Ayúdalas a crecer.",heroText:"Identifica plantas, supervisa su salud y conoce sus necesidades de luz y nutrientes.",scan:"📷 Escanear una planta",add:"＋ Añadir planta",careChecks:"Revisiones de hoy",lightTracked:"Luz registrada",nutrientWarning:"Aviso de nutrientes",overallHealth:"Salud general",carePlan:"🔔 Plan de cuidados de hoy",personalized:"Tareas personalizadas según tus plantas.",insight:"🤖 Consejo de Modern Agriculture Technology",insightGood:"Tus plantas se ven muy bien. ¡Sigue con la buena rutina de cuidados!",insightBad:"{plant} necesita atención.",insightBadBody:"Tu perfil más reciente muestra estrés hídrico moderado y un posible problema de nutrientes. Revisa el suelo antes de regar o fertilizar.",askMAT:"Preguntar a la IA MAT →",environment:"🌦️ Entorno",temperature:"Temperatura",humidity:"Humedad",conditions:"Condiciones",yourPlants:"Tus plantas",scanIdentify:"📷 Escanear e identificar",plantLibrary:"📚 Biblioteca de plantas",explore:"Explora luz, agua, suelo, clima, nutrientes y cuidados comunes.",searchPlaceholder:"Buscar entre más de 25 plantas...",remindersTitle:"🔔 Recordatorios inteligentes",reminderExplain:"Los recordatorios ayudan a comprobar las condiciones en lugar de seguir un horario fijo de riego.",addReminder:"＋ Añadir recordatorio",tablePlant:"Planta",tableTask:"Tarea",tableTime:"Hora",tableStatus:"Estado",plantsTrackedLabel:"Plantas registradas",tasksCompletedLabel:"Tareas completadas",scansCompletedLabel:"Escaneos completados",careStreakLabel:"Racha de cuidados",healthTrend:"📈 Tendencia de salud",achievements:"🏆 Logros",nutrientCenter:"🧪 Centro de nutrientes",nutrientExplain:"Aprende la función de los nutrientes. Un síntoma visible no confirma una deficiencia; se recomienda analizar el suelo o tejido.",note:"Nota",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Pregunta sobre cuidados, síntomas, luz solar, riego, suelo o nutrientes.",aiWelcome:"🌱 ¡Hola! Soy la IA MAT. Pregunta sobre una planta o describe un problema.",askPlaceholder:"Pregunta a la IA MAT...",send:"Enviar",displayName:"Nombre visible",defaultReminder:"Hora predeterminada del recordatorio",language:"Idioma",appearance:"Apariencia / Tema",save:"Guardar ajustes",lightClassic:"Claro — Clásico",darkForest:"Oscuro — Bosque",lightMint:"Claro — Menta",lightOcean:"Claro — Océano",darkMidnight:"Oscuro — Medianoche",darkSage:"Oscuro — Salvia",myProfile:"👤 Tu perfil MAT",profileHelp:"Introduce un nombre o apodo para personalizar el panel.",yourName:"Tu nombre",exampleName:"p. ej., Alex",saveName:"Guardar mi nombre",addPlantTitle:"🌱 Añadir una planta",addHelp:"Escribe el nombre de una planta o usa el escáner para identificarla.",plantName:"Nombre de la planta",where:"¿Dónde está?",indoor:"Interior",outdoor:"Exterior",balcony:"Balcón",garden:"Jardín",greenhouse:"Invernadero",reminderTime:"Hora del recordatorio",addToMyPlants:"Añadir a Mis plantas",scannerTitle:"📷 Escáner de plantas MAT",scannerNote:"Sube una foto nítida. La IA MAT la analizará y sugerirá posibles cuidados.",choosePhoto:"Elegir una foto",scanBusyTitle:"🌿 La IA MAT está analizando...",waitScan:"Espera mientras examino la planta.",scanUnavailable:"⚠️ Escáner no disponible",tryAnotherPhoto:"Prueba con otra foto nítida de la planta.",analysisComplete:"🌱 ¡Análisis completado!",scanResultHeading:"🌿 Resultado de la IA MAT",scanImportantNote:"Importante: una foto puede sugerir posible estrés o deficiencia, pero no puede confirmar una deficiencia de nutrientes. El análisis de suelo/tejido es más fiable.",reviewBeforeAdd:"Revisa el resultado antes de añadir esta planta.",footerText:"Modern Agriculture Technology AI • HTML Semántico • CSS Modular • Estado en JavaScript • Interfaz Responsiva",darkMode:"Modo oscuro",lightMode:"Modo claro",remove:"Eliminar",removeConfirm:"¿Eliminar esta planta de Mis plantas? Esta acción no se puede deshacer.",confirm:"Eliminar",cancel:"Cancelar",viewProfile:"Ver perfil completo",healthy:"Saludable",monitor:"Vigilar",water:"Agua",sun:"Sol",keyNutrients:"Nutrientes",issue:"Problema",noPlants:"Aún no hay plantas. Añade una para comenzar.",plantAdded:"{plant} añadida a Mis plantas 🌱",plantRemoved:"Planta eliminada 🌱",languageUpdated:"Idioma actualizado ✓",settingsSaved:"Ajustes guardados ✓",needAttention:"Necesita atención",scheduled:"Programado",taskCompleted:"Tarea completada ✓",taskReopened:"Tarea reabierta",checkSoil:"Comprobar humedad del suelo",waterCheck:"Regar/comprobar suelo",inspectLeaves:"Revisar hojas",rotatePlant:"Girar",today:"Hoy",daily:"Diario",dayMonday:"Lunes",dayWednesday:"Miércoles",dayFriday:"Viernes",soil:"Suelo",temperatureLabel:"Temperatura",humidityLabel:"Humedad",growth:"Tipo",care:"Cuidados",confidence:"Confianza de identificación",estimatedHealth:"Salud estimada",waterNeed:"Necesidad de agua",aiFindings:"Resultados de IA",detailsTitle:"Perfil de la planta",close:"Cerrar",nameFieldRequired:"Introduce el nombre de una planta",scannerKeyMissing:"El escaneo por IA aún no está configurado. Añade una clave de API de Gemini para activarlo.",aiKeyMissing:"El chat de IA aún no está configurado. Añade una clave de API de Gemini para activarlo.",aiBusy:"⚠️ La IA está temporalmente ocupada. Inténtalo de nuevo en unos segundos.",scanFailed:"Error al analizar la planta"},
tr:{brandName:"Modern Tarım Teknolojisi",greet:"Günaydın,",subtitle:"Kişiselleştirilmiş bitki bakım paneliniz.",ready:"Modern Agriculture Technology hazır",myDetails:"Bilgilerim",navDashboard:"Kontrol paneli",navPlants:"Bitkilerim",navScan:"Bitki tara",navLibrary:"Bitki kütüphanesi",navAI:"Yapay zekâ asistanı",navReminders:"Hatırlatıcılar",navAnalytics:"Analizler",navNutrients:"Besinler",navSettings:"Ayarlar",heroEyebrow:"YAPAY ZEKÂ DESTEKLİ BİTKİ BAKIMI",heroTitle:"Bitkilerinizi anlayın. Büyümelerine yardım edin.",heroText:"Bitkileri tanıyın, sağlıklarını izleyin ve ışık ile besin ihtiyaçlarını öğrenin.",scan:"📷 Bitki Tara",add:"＋ Bitki Ekle",careChecks:"Bugünkü bakım kontrolleri",lightTracked:"İzlenen ışık",nutrientWarning:"Besin uyarısı",overallHealth:"Genel sağlık",carePlan:"🔔 Bugünün bakım planı",personalized:"Bitkilerinize göre kişiselleştirilmiş görevler.",insight:"🤖 MAT önerisi",insightGood:"Bitkileriniz harika görünüyor. İyi bakım rutininize devam edin!",insightBad:"{plant} ilginize ihtiyaç duyuyor.",insightBadBody:"En son profiliniz orta düzeyde su stresi ve olası bir besin sorunu gösteriyor. Sulamadan veya gübrelemeden önce toprağı kontrol edin.",askMAT:"MAT AI'ya sor →",environment:"🌦️ Ortam",temperature:"Sıcaklık",humidity:"Nem",conditions:"Koşullar",yourPlants:"Bitkileriniz",scanIdentify:"📷 Tara ve tanımla",plantLibrary:"📚 Bitki Kütüphanesi",explore:"Işık, su, toprak, iklim ve besin ihtiyaçlarını keşfedin.",searchPlaceholder:"25'ten fazla bitki ara...",remindersTitle:"🔔 Akıllı Hatırlatıcılar",reminderExplain:"Hatırlatıcılar sabit sulama takvimi yerine koşulları kontrol etmenizi sağlar.",addReminder:"＋ Hatırlatıcı ekle",tablePlant:"Bitki",tableTask:"Görev",tableTime:"Saat",tableStatus:"Durum",plantsTrackedLabel:"Takip edilen bitkiler",tasksCompletedLabel:"Tamamlanan görevler",scansCompletedLabel:"Tamamlanan taramalar",careStreakLabel:"Bakım serisi",healthTrend:"📈 Sağlık eğilimi",achievements:"🏆 Başarılar",nutrientCenter:"🧪 Besin Merkezi",nutrientExplain:"Besinlerin işlevini öğrenin. Tek bir belirti eksikliği kanıtlamaz; toprak veya doku testi önerilir.",note:"Not",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Bitki bakımı, belirtiler, güneş ışığı, sulama, toprak veya besinleri sorun.",aiWelcome:"🌱 Merhaba! MAT AI benim. Bitkiler hakkında soru sorun veya bir sorunu anlatın.",askPlaceholder:"MAT AI'ya sorun...",send:"Gönder",displayName:"Görünen ad",defaultReminder:"Varsayılan hatırlatma saati",language:"Dil",appearance:"Görünüm / Tema",save:"Ayarları kaydet",lightClassic:"Açık — Klasik",darkForest:"Koyu — Orman",lightMint:"Açık — Nane",lightOcean:"Açık — Okyanus",darkMidnight:"Koyu — Gece",darkSage:"Koyu — Adaçayı",myProfile:"👤 MAT profiliniz",profileHelp:"Paneli kişiselleştirmek için ad veya takma ad girin.",yourName:"Adınız",exampleName:"örn. Alex",saveName:"Adımı kaydet",addPlantTitle:"🌱 Bitki Ekle",addHelp:"Bitki adını yazın veya tanımlamak için tarayıcı kullanın.",plantName:"Bitki adı",where:"Nerede?",indoor:"İç mekân",outdoor:"Dış mekân",balcony:"Balkon",garden:"Bahçe",greenhouse:"Sera",reminderTime:"Hatırlatma saati",addToMyPlants:"Bitkilerime ekle",scannerTitle:"📷 MAT Bitki Tarayıcı",scannerNote:"Net bir fotoğraf yükleyin. MAT AI onu analiz edip olası bakım önerileri sunacak.",choosePhoto:"Bitki fotoğrafı seç",scanBusyTitle:"🌿 MAT AI analiz ediyor...",waitScan:"Bitkiniz incelenirken lütfen bekleyin.",scanUnavailable:"⚠️ Tarayıcı kullanılamıyor",tryAnotherPhoto:"Lütfen başka net bir bitki fotoğrafı deneyin.",analysisComplete:"🌱 Bitki analizi tamamlandı!",scanResultHeading:"🌿 MAT AI sonucu",scanImportantNote:"Önemli: bir fotoğraf olası stres veya eksikliği gösterebilir ama besin eksikliğini kesin olarak doğrulayamaz. Toprak/doku testi daha güvenilirdir.",reviewBeforeAdd:"Bu bitkiyi eklemeden önce sonucu inceleyin.",footerText:"Modern Agriculture Technology AI • Anlamsal HTML • Modüler CSS • JavaScript Durumu • Duyarlı Arayüz",darkMode:"Koyu mod",lightMode:"Açık mod",remove:"Kaldır",removeConfirm:"Bu bitki Bitkilerim listesinden kaldırılsın mı? Bu işlem geri alınamaz.",confirm:"Kaldır",cancel:"Vazgeç",viewProfile:"Tam profili görüntüle",healthy:"Sağlıklı",monitor:"İzle",water:"Su",sun:"Güneş",keyNutrients:"Besinler",issue:"Sorun",noPlants:"Henüz bitki yok. Başlamak için bir tane ekleyin.",plantAdded:"{plant} Bitkilerime eklendi 🌱",plantRemoved:"Bitki kaldırıldı 🌱",languageUpdated:"Dil güncellendi ✓",settingsSaved:"Ayarlar kaydedildi ✓",needAttention:"İlgilenilmeli",scheduled:"Planlandı",taskCompleted:"Görev tamamlandı ✓",taskReopened:"Görev yeniden açıldı",checkSoil:"Toprak nemini kontrol et",waterCheck:"Sula/toprağı kontrol et",inspectLeaves:"Yaprakları incele",rotatePlant:"Döndür",today:"Bugün",daily:"Günlük",dayMonday:"Pazartesi",dayWednesday:"Çarşamba",dayFriday:"Cuma",soil:"Toprak",temperatureLabel:"Sıcaklık",humidityLabel:"Nem",growth:"Tür",care:"Bakım",confidence:"Tanımlama güveni",estimatedHealth:"Tahmini sağlık",waterNeed:"Su ihtiyacı",aiFindings:"Yapay zekâ bulguları",detailsTitle:"Bitki profili",close:"Kapat",nameFieldRequired:"Lütfen bir bitki adı girin",scannerKeyMissing:"Yapay zekâ taraması henüz yapılandırılmadı. Etkinleştirmek için bir Gemini API anahtarı ekleyin.",aiKeyMissing:"Yapay zekâ sohbeti henüz yapılandırılmadı. Etkinleştirmek için bir Gemini API anahtarı ekleyin.",aiBusy:"⚠️ Yapay zekâ şu anda meşgul. Lütfen birkaç saniye sonra tekrar deneyin.",scanFailed:"Bitki taraması başarısız"},
sw:{brandName:"Teknolojia ya Kilimo cha Kisasa",greet:"Habari za asubuhi,",subtitle:"Dashibodi yako binafsi ya utunzaji wa mimea.",ready:"Modern Agriculture Technology iko tayari",myDetails:"Taarifa zangu",navDashboard:"Dashibodi",navPlants:"Mimea yangu",navScan:"Changanua mmea",navLibrary:"Maktaba ya mimea",navAI:"Msaidizi wa AI",navReminders:"Vikumbusho",navAnalytics:"Takwimu",navNutrients:"Virutubisho",navSettings:"Mipangilio",heroEyebrow:"UTUNZAJI WA MIMEA KWA AI",heroTitle:"Elewa mimea yako. Isaidie ikue.",heroText:"Tambua mimea, fuatilia afya yake na ujifunze mahitaji ya mwanga na virutubisho.",scan:"📷 Changanua mmea",add:"＋ Ongeza mmea",careChecks:"Ukaguzi wa leo",lightTracked:"Mwanga unaofuatiliwa",nutrientWarning:"Tahadhari ya virutubisho",overallHealth:"Afya kwa jumla",carePlan:"🔔 Mpango wa utunzaji wa leo",personalized:"Kazi zilizobinafsishwa kulingana na mimea yako.",insight:"🤖 Ushauri wa MAT",insightGood:"Mimea yako inaonekana vizuri sana. Endelea na utaratibu mzuri wa utunzaji!",insightBad:"{plant} inahitaji uangalizi.",insightBadBody:"Wasifu wako wa hivi karibuni unaonyesha msongo wa wastani wa maji na tatizo linalowezekana la virutubisho. Kagua udongo kabla ya kumwagilia au kuweka mbolea.",askMAT:"Uliza MAT AI →",environment:"🌦️ Mazingira",temperature:"Joto",humidity:"Unyevu",conditions:"Hali",yourPlants:"Mimea yako",scanIdentify:"📷 Changanua na utambue",plantLibrary:"📚 Maktaba ya Mimea",explore:"Jifunze kuhusu mwanga, maji, udongo, hali ya hewa na virutubisho.",searchPlaceholder:"Tafuta mimea 25+...",remindersTitle:"🔔 Vikumbusho Mahiri",reminderExplain:"Vikumbusho vinakusaidia kukagua hali badala ya kufuata ratiba ya kumwagilia isiyobadilika.",addReminder:"＋ Ongeza ukumbusho",tablePlant:"Mmea",tableTask:"Kazi",tableTime:"Muda",tableStatus:"Hali",plantsTrackedLabel:"Mimea inayofuatiliwa",tasksCompletedLabel:"Kazi zilizokamilika",scansCompletedLabel:"Uchanganuzi uliokamilika",careStreakLabel:"Mfululizo wa utunzaji",healthTrend:"📈 Mwelekeo wa afya",achievements:"🏆 Mafanikio",nutrientCenter:"🧪 Kituo cha Virutubisho",nutrientExplain:"Jifunze kazi za virutubisho. Dalili moja haithibitishi upungufu; kupima udongo au tishu kunapendekezwa.",note:"Dokezo",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Uliza kuhusu utunzaji, dalili, mwanga wa jua, kumwagilia, udongo au virutubisho.",aiWelcome:"🌱 Habari! Mimi ni MAT AI. Uliza kuhusu mmea au eleza tatizo.",askPlaceholder:"Uliza MAT AI...",send:"Tuma",displayName:"Jina la kuonyesha",defaultReminder:"Muda chaguomsingi wa ukumbusho",language:"Lugha",appearance:"Muonekano / Mandhari",save:"Hifadhi mipangilio",lightClassic:"Nuru — Kawaida",darkForest:"Giza — Msitu",lightMint:"Nuru — Mint",lightOcean:"Nuru — Bahari",darkMidnight:"Giza — Usiku",darkSage:"Giza — Sage",myProfile:"👤 Wasifu wako wa MAT",profileHelp:"Weka jina au jina la utani kubinafsisha dashibodi.",yourName:"Jina lako",exampleName:"mf. Alex",saveName:"Hifadhi jina langu",addPlantTitle:"🌱 Ongeza mmea",addHelp:"Weka jina la mmea au tumia kichanganuzi kuutambua.",plantName:"Jina la mmea",where:"Uko wapi?",indoor:"Ndani",outdoor:"Nje",balcony:"Balconi",garden:"Bustani",greenhouse:"Chafu",reminderTime:"Muda wa ukumbusho",addToMyPlants:"Ongeza kwenye Mimea yangu",scannerTitle:"📷 Kichanganuzi cha MAT",scannerNote:"Pakia picha iliyo wazi. MAT AI itaichanganua na kupendekeza mahitaji ya utunzaji.",choosePhoto:"Chagua picha ya mmea",scanBusyTitle:"🌿 MAT AI inachanganua...",waitScan:"Subiri ninapochunguza mmea.",scanUnavailable:"⚠️ Kichanganuzi hakipatikani",tryAnotherPhoto:"Tafadhali jaribu picha nyingine iliyo wazi ya mmea.",analysisComplete:"🌱 Uchanganuzi umekamilika!",scanResultHeading:"🌿 Matokeo ya MAT AI",scanImportantNote:"Muhimu: picha inaweza kuonyesha msongo au upungufu unaowezekana, lakini haiwezi kuthibitisha upungufu wa virutubisho. Kupima udongo/tishu ni njia ya kuaminika zaidi.",reviewBeforeAdd:"Kagua matokeo kabla ya kuongeza mmea huu.",footerText:"Modern Agriculture Technology AI • HTML ya Kisemantiki • CSS ya Moduli • Hali ya JavaScript • Muundo Badilikaji",darkMode:"Hali ya giza",lightMode:"Hali ya nuru",remove:"Ondoa",removeConfirm:"Ondoa mmea huu kwenye Mimea yangu? Hatua hii haiwezi kutenduliwa.",confirm:"Ondoa",cancel:"Ghairi",viewProfile:"Tazama wasifu kamili",healthy:"Mwenye afya",monitor:"Fuatilia",water:"Maji",sun:"Jua",keyNutrients:"Virutubisho",issue:"Tatizo",noPlants:"Bado hakuna mimea. Ongeza mmoja kuanza.",plantAdded:"{plant} imeongezwa kwenye Mimea yangu 🌱",plantRemoved:"Mmea umeondolewa 🌱",languageUpdated:"Lugha imesasishwa ✓",settingsSaved:"Mipangilio imehifadhiwa ✓",needAttention:"Inahitaji uangalizi",scheduled:"Imepangwa",taskCompleted:"Kazi imekamilika ✓",taskReopened:"Kazi imefunguliwa tena",checkSoil:"Kagua unyevu wa udongo",waterCheck:"Mwagilia/kagua udongo",inspectLeaves:"Kagua majani",rotatePlant:"Geuza",today:"Leo",daily:"Kila siku",dayMonday:"Jumatatu",dayWednesday:"Jumatano",dayFriday:"Ijumaa",soil:"Udongo",temperatureLabel:"Joto",humidityLabel:"Unyevu",growth:"Aina",care:"Utunzaji",confidence:"Uhakika wa utambuzi",estimatedHealth:"Afya inayokadiriwa",waterNeed:"Mahitaji ya maji",aiFindings:"Matokeo ya AI",detailsTitle:"Wasifu wa mmea",close:"Funga",nameFieldRequired:"Tafadhali weka jina la mmea",scannerKeyMissing:"Uchanganuzi wa AI haujasanidiwa bado. Ongeza ufunguo wa API wa Gemini kuuwezesha.",aiKeyMissing:"Gumzo la AI halijasanidiwa bado. Ongeza ufunguo wa API wa Gemini kuliwezesha.",aiBusy:"⚠️ AI iko na shughuli kwa sasa. Tafadhali jaribu tena baada ya sekunde chache.",scanFailed:"Uchanganuzi wa mmea umeshindwa"},
de:{brandName:"Moderne Agrartechnologie",greet:"Guten Morgen,",subtitle:"Dein persönliches Pflanzenpflege-Dashboard.",ready:"Modern Agriculture Technology ist bereit",myDetails:"Meine Angaben",navDashboard:"Übersicht",navPlants:"Meine Pflanzen",navScan:"Pflanze scannen",navLibrary:"Pflanzenbibliothek",navAI:"KI-Assistent",navReminders:"Erinnerungen",navAnalytics:"Analysen",navNutrients:"Nährstoffe",navSettings:"Einstellungen",heroEyebrow:"KI-GESTÜTZTE PFLANZENPFLEGE",heroTitle:"Verstehe deine Pflanzen. Hilf ihnen beim Wachsen.",heroText:"Bestimme Pflanzen, überwache ihre Gesundheit und erfahre mehr über Licht- und Nährstoffbedarf.",scan:"📷 Pflanze scannen",add:"＋ Pflanze hinzufügen",careChecks:"Pflegeprüfungen heute",lightTracked:"Erfasstes Licht",nutrientWarning:"Nährstoffwarnung",overallHealth:"Allgemeiner Zustand",carePlan:"🔔 Heutiger Pflegeplan",personalized:"Auf deine Pflanzen abgestimmte Aufgaben.",insight:"🤖 MAT-Empfehlung",insightGood:"Deinen Pflanzen geht es prächtig. Mach weiter mit der guten Pflegeroutine!",insightBad:"{plant} braucht Aufmerksamkeit.",insightBadBody:"Dein aktuelles Profil zeigt moderaten Wasserstress und ein mögliches Nährstoffproblem. Prüfe den Boden vor dem Gießen oder Düngen.",askMAT:"MAT KI fragen →",environment:"🌦️ Umgebung",temperature:"Temperatur",humidity:"Luftfeuchtigkeit",conditions:"Bedingungen",yourPlants:"Deine Pflanzen",scanIdentify:"📷 Scannen und bestimmen",plantLibrary:"📚 Pflanzenbibliothek",explore:"Entdecke Licht, Wasser, Erde, Klima, Nährstoffe und Pflegetipps.",searchPlaceholder:"Über 25 Pflanzen suchen...",remindersTitle:"🔔 Intelligente Erinnerungen",reminderExplain:"Erinnerungen helfen dir, Bedingungen zu prüfen, statt einem festen Gießplan blind zu folgen.",addReminder:"＋ Erinnerung hinzufügen",tablePlant:"Pflanze",tableTask:"Aufgabe",tableTime:"Zeit",tableStatus:"Status",plantsTrackedLabel:"Erfasste Pflanzen",tasksCompletedLabel:"Erledigte Aufgaben",scansCompletedLabel:"Abgeschlossene Scans",careStreakLabel:"Pflegeserie",healthTrend:"📈 Gesundheitstrend",achievements:"🏆 Erfolge",nutrientCenter:"🧪 Nährstoffzentrum",nutrientExplain:"Erfahre die Aufgaben von Nährstoffen. Ein sichtbares Symptom beweist keinen Mangel; Boden- oder Gewebetests werden empfohlen.",note:"Hinweis",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"Frage zu Pflege, Symptomen, Sonnenlicht, Bewässerung, Boden oder Nährstoffen.",aiWelcome:"🌱 Hallo! Ich bin MAT AI. Frage mich zu einer Pflanze oder beschreibe ein Problem.",askPlaceholder:"MAT KI fragen...",send:"Senden",displayName:"Anzeigename",defaultReminder:"Standard-Erinnerungszeit",language:"Sprache",appearance:"Darstellung / Design",save:"Einstellungen speichern",lightClassic:"Hell — Klassisch",darkForest:"Dunkel — Wald",lightMint:"Hell — Minze",lightOcean:"Hell — Ozean",darkMidnight:"Dunkel — Mitternacht",darkSage:"Dunkel — Salbei",myProfile:"👤 Dein MAT-Profil",profileHelp:"Gib einen Namen oder Spitznamen zur Personalisierung ein.",yourName:"Dein Name",exampleName:"z. B. Alex",saveName:"Namen speichern",addPlantTitle:"🌱 Pflanze hinzufügen",addHelp:"Gib einen Pflanzennamen ein oder nutze den Scanner zur Bestimmung.",plantName:"Pflanzenname",where:"Wo befindet sie sich?",indoor:"Innenbereich",outdoor:"Außenbereich",balcony:"Balkon",garden:"Garten",greenhouse:"Gewächshaus",reminderTime:"Erinnerungszeit",addToMyPlants:"Zu meinen Pflanzen hinzufügen",scannerTitle:"📷 MAT-Pflanzenscanner",scannerNote:"Lade ein klares Foto hoch. Die MAT-KI analysiert es und schlägt mögliche Pflege vor.",choosePhoto:"Pflanzenfoto auswählen",scanBusyTitle:"🌿 MAT-KI analysiert...",waitScan:"Bitte warte, während ich die Pflanze untersuche.",scanUnavailable:"⚠️ Scanner nicht verfügbar",tryAnotherPhoto:"Bitte versuche ein anderes klares Pflanzenfoto.",analysisComplete:"🌱 Analyse abgeschlossen!",scanResultHeading:"🌿 MAT-KI-Ergebnis",scanImportantNote:"Wichtig: Ein Foto kann auf möglichen Stress oder Mangel hinweisen, aber einen Nährstoffmangel nicht bestätigen. Eine Boden-/Gewebeuntersuchung ist zuverlässiger.",reviewBeforeAdd:"Prüfe das Ergebnis, bevor du diese Pflanze hinzufügst.",footerText:"Modern Agriculture Technology AI • Semantisches HTML • Modulares CSS • JavaScript-Status • Responsive Oberfläche",darkMode:"Dunkelmodus",lightMode:"Hellmodus",remove:"Entfernen",removeConfirm:"Diese Pflanze aus „Meine Pflanzen“ entfernen? Dies kann nicht rückgängig gemacht werden.",confirm:"Entfernen",cancel:"Abbrechen",viewProfile:"Vollständiges Profil anzeigen",healthy:"Gesund",monitor:"Beobachten",water:"Wasser",sun:"Sonne",keyNutrients:"Nährstoffe",issue:"Problem",noPlants:"Noch keine Pflanzen. Füge eine hinzu.",plantAdded:"{plant} zu Meine Pflanzen hinzugefügt 🌱",plantRemoved:"Pflanze entfernt 🌱",languageUpdated:"Sprache aktualisiert ✓",settingsSaved:"Einstellungen gespeichert ✓",needAttention:"Benötigt Aufmerksamkeit",scheduled:"Geplant",taskCompleted:"Aufgabe erledigt ✓",taskReopened:"Aufgabe wieder geöffnet",checkSoil:"Bodenfeuchte prüfen",waterCheck:"Gießen/Boden prüfen",inspectLeaves:"Blätter prüfen",rotatePlant:"Drehen",today:"Heute",daily:"Täglich",dayMonday:"Montag",dayWednesday:"Mittwoch",dayFriday:"Freitag",soil:"Boden",temperatureLabel:"Temperatur",humidityLabel:"Luftfeuchtigkeit",growth:"Typ",care:"Pflege",confidence:"Bestimmungssicherheit",estimatedHealth:"Geschätzter Zustand",waterNeed:"Wasserbedarf",aiFindings:"KI-Ergebnisse",detailsTitle:"Pflanzenprofil",close:"Schließen",nameFieldRequired:"Bitte gib einen Pflanzennamen ein",scannerKeyMissing:"Die KI-Scanfunktion ist noch nicht eingerichtet. Füge einen Gemini-API-Schlüssel hinzu, um sie zu aktivieren.",aiKeyMissing:"Der KI-Chat ist noch nicht eingerichtet. Füge einen Gemini-API-Schlüssel hinzu, um ihn zu aktivieren.",aiBusy:"⚠️ Die KI ist momentan ausgelastet. Bitte versuche es in ein paar Sekunden erneut.",scanFailed:"Pflanzenscan fehlgeschlagen"},
ar:{brandName:"تقنية الزراعة الحديثة",greet:"صباح الخير،",subtitle:"لوحة العناية بالنباتات المخصصة لك.",ready:"تقنية الزراعة الحديثة جاهزة",myDetails:"بياناتي",navDashboard:"لوحة التحكم",navPlants:"نباتاتي",navScan:"فحص نبات",navLibrary:"مكتبة النباتات",navAI:"مساعد الذكاء الاصطناعي",navReminders:"التذكيرات",navAnalytics:"التحليلات",navNutrients:"العناصر الغذائية",navSettings:"الإعدادات",heroEyebrow:"العناية بالنباتات بالذكاء الاصطناعي",heroTitle:"افهم نباتاتك. ساعدها على النمو.",heroText:"تعرّف على النباتات وتابع صحتها وتعلّم احتياجاتها من الضوء والعناصر الغذائية.",scan:"📷 افحص نباتًا",add:"＋ أضف نباتًا",careChecks:"فحوصات العناية اليوم",lightTracked:"الضوء المتابع",nutrientWarning:"تحذير العناصر الغذائية",overallHealth:"الصحة العامة",carePlan:"🔔 خطة العناية اليوم",personalized:"مهام مخصصة بناءً على نباتاتك.",insight:"🤖 نصيحة MAT",insightGood:"نباتاتك تبدو رائعة. واصل روتين العناية الجيد!",insightBad:"{plant} بحاجة إلى انتباه.",insightBadBody:"يُظهر ملفك الأخير إجهادًا مائيًا معتدلًا ومشكلة محتملة في العناصر الغذائية. تحقق من التربة قبل الري أو التسميد.",askMAT:"اسأل MAT AI ←",environment:"🌦️ البيئة",temperature:"درجة الحرارة",humidity:"الرطوبة",conditions:"الظروف",yourPlants:"نباتاتك",scanIdentify:"📷 افحص وحدد",plantLibrary:"📚 مكتبة النباتات",explore:"اكتشف احتياجات الضوء والماء والتربة والمناخ والعناصر الغذائية.",searchPlaceholder:"ابحث عن أكثر من 25 نباتًا...",remindersTitle:"🔔 تذكيرات ذكية",reminderExplain:"تساعدك التذكيرات على فحص الظروف بدلًا من اتباع جدول ري ثابت.",addReminder:"＋ أضف تذكيرًا",tablePlant:"النبات",tableTask:"المهمة",tableTime:"الوقت",tableStatus:"الحالة",plantsTrackedLabel:"النباتات المتابعة",tasksCompletedLabel:"المهام المكتملة",scansCompletedLabel:"الفحوص المكتملة",careStreakLabel:"سلسلة العناية",healthTrend:"📈 اتجاه الصحة",achievements:"🏆 الإنجازات",nutrientCenter:"🧪 مركز العناصر الغذائية",nutrientExplain:"تعرّف على وظائف العناصر الغذائية. لا تؤكد الأعراض المرئية وحدها وجود نقص؛ يُنصح بفحص التربة أو الأنسجة.",note:"ملاحظة",aiPageTitle:"🤖 Modern Agriculture Technology AI",aiExplain:"اسأل عن العناية بالنباتات أو الأعراض أو ضوء الشمس أو الري أو التربة أو العناصر الغذائية.",aiWelcome:"🌱 مرحبًا! أنا MAT AI. اسألني عن نبات أو صف مشكلة.",askPlaceholder:"اسأل MAT AI...",send:"إرسال",displayName:"الاسم المعروض",defaultReminder:"وقت التذكير الافتراضي",language:"اللغة",appearance:"المظهر / السمة",save:"حفظ الإعدادات",lightClassic:"فاتح — كلاسيكي",darkForest:"داكن — غابة",lightMint:"فاتح — نعناعي",lightOcean:"فاتح — محيط",darkMidnight:"داكن — منتصف الليل",darkSage:"داكن — أخضر مريمي",myProfile:"👤 ملف MAT الخاص بك",profileHelp:"أدخل اسمًا أو لقبًا لتخصيص لوحة التحكم.",yourName:"اسمك",exampleName:"مثال: Alex",saveName:"حفظ اسمي",addPlantTitle:"🌱 أضف نباتًا",addHelp:"أدخل اسم النبات أو استخدم الفاحص للتعرّف عليه.",plantName:"اسم النبات",where:"أين يوجد؟",indoor:"داخل المنزل",outdoor:"في الخارج",balcony:"الشرفة",garden:"الحديقة",greenhouse:"الدفيئة",reminderTime:"وقت التذكير",addToMyPlants:"أضف إلى نباتاتي",scannerTitle:"📷 ماسح نباتات MAT",scannerNote:"حمّل صورة واضحة. سيقوم MAT AI بتحليلها واقتراح احتياجات العناية المحتملة.",choosePhoto:"اختر صورة النبات",scanBusyTitle:"🌿 يقوم MAT AI بالتحليل...",waitScan:"يرجى الانتظار أثناء فحص النبات.",scanUnavailable:"⚠️ الماسح غير متاح",tryAnotherPhoto:"يرجى تجربة صورة نبات واضحة أخرى.",analysisComplete:"🌱 اكتمل تحليل النبات!",scanResultHeading:"🌿 نتيجة MAT AI",scanImportantNote:"مهم: يمكن أن تشير الصورة إلى إجهاد أو نقص محتمل، لكنها لا تؤكد نقص العناصر الغذائية. فحص التربة أو الأنسجة أكثر موثوقية.",reviewBeforeAdd:"راجع النتيجة قبل إضافة هذا النبات.",footerText:"Modern Agriculture Technology AI • HTML دلالي • CSS معياري • حالة JavaScript • واجهة متجاوبة",darkMode:"الوضع الداكن",lightMode:"الوضع الفاتح",remove:"إزالة",removeConfirm:"هل تريد إزالة هذا النبات من نباتاتي؟ لا يمكن التراجع عن هذا الإجراء.",confirm:"إزالة",cancel:"إلغاء",viewProfile:"عرض الملف الكامل",healthy:"سليم",monitor:"راقب",water:"الماء",sun:"الشمس",keyNutrients:"العناصر الغذائية",issue:"المشكلة",noPlants:"لا توجد نباتات بعد. أضف نباتًا للبدء.",plantAdded:"تمت إضافة {plant} إلى نباتاتي 🌱",plantRemoved:"تمت إزالة النبات 🌱",languageUpdated:"تم تحديث اللغة ✓",settingsSaved:"تم حفظ الإعدادات ✓",needAttention:"يحتاج إلى عناية",scheduled:"مجدول",taskCompleted:"تمت المهمة ✓",taskReopened:"أُعيد فتح المهمة",checkSoil:"تحقق من رطوبة التربة",waterCheck:"اسقِ/تحقق من التربة",inspectLeaves:"افحص الأوراق",rotatePlant:"أدر",today:"اليوم",daily:"يوميًا",dayMonday:"الإثنين",dayWednesday:"الأربعاء",dayFriday:"الجمعة",soil:"التربة",temperatureLabel:"درجة الحرارة",humidityLabel:"الرطوبة",growth:"النوع",care:"العناية",confidence:"ثقة التعرف",estimatedHealth:"الصحة المقدرة",waterNeed:"احتياج الماء",aiFindings:"نتائج الذكاء الاصطناعي",detailsTitle:"ملف النبات",close:"إغلاق",nameFieldRequired:"يرجى إدخال اسم النبات",scannerKeyMissing:"لم يتم إعداد الفحص بالذكاء الاصطناعي بعد. أضف مفتاح Gemini API لتفعيله.",aiKeyMissing:"لم تتم تهيئة محادثة الذكاء الاصطناعي بعد. أضف مفتاح Gemini API لتفعيلها.",aiBusy:"⚠️ الذكاء الاصطناعي مشغول مؤقتًا. يرجى المحاولة مرة أخرى بعد لحظات.",scanFailed:"فشل فحص النبات"}
};

/* ---------- App state ---------- */
const state = {
  lang: localStorage.getItem("mat_language") || "en",
  theme: localStorage.getItem("mat_theme") || "light",
  plants: [],
  scanCount: parseInt(localStorage.getItem("mat_scan_count") || "0", 10),
  pendingRemoveIndex: null
};

function t(key){
  const d = UI[state.lang] || UI.en;
  return (d[key] !== undefined ? d[key] : UI.en[key]) || key;
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

/* ---------- Persistence ---------- */
function loadPlants(){
  try{
    const saved = JSON.parse(localStorage.getItem("mat_plants") || "null");
    state.plants = Array.isArray(saved) && saved.length ? saved : PLANTS_DEFAULT();
  }catch(e){ state.plants = PLANTS_DEFAULT(); }
}
function savePlants(){
  localStorage.setItem("mat_plants", JSON.stringify(state.plants));
}

/* ---------- Navigation ---------- */
function showPage(id, btn){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const target = document.getElementById(id);
  if(target) target.classList.add("active");
  document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
  else { const map={dashboard:0,plants:1,library:3,ai:4,reminders:5,analytics:6,nutrients:7,settings:8}; const i=map[id]; const navBtns=document.querySelectorAll(".nav button"); if(i!==undefined && navBtns[i]) navBtns[i].classList.add("active"); }
  updateGreetingHeading(id);
  renderAll();
}
function updateGreetingHeading(id){
  const h = document.querySelector(".topbar h1");
  if(!h) return;
  const titles = {
    dashboard: t("greet"), plants: t("navPlants"), library: t("plantLibrary"),
    ai: t("aiPageTitle"), reminders: t("remindersTitle"), analytics: t("navAnalytics"),
    nutrients: t("nutrientCenter"), settings: t("navSettings")
  };
  const span = document.getElementById("welcomeName");
  h.textContent = "";
  h.appendChild(document.createTextNode((titles[id]||t("greet")) + " "));
  if(id==="dashboard" && span){ h.appendChild(span); h.appendChild(document.createTextNode("! 🌤️")); }
}

/* ---------- Static translation pass (data-i18n attributes) ---------- */
function applyStaticTranslations(){
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const val = t(el.dataset.i18n);
    if(val !== undefined) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el=>{
    el.title = t(el.dataset.i18nTitle);
  });
  document.title = t("brandName") + " — " + t("navDashboard");
  updateGreetingHeading(document.querySelector(".page.active")?.id || "dashboard");
  updateMainModeToggle(state.theme);
}

/* ---------- Plant cards ---------- */
function plantDisplayName(p){
  return p.custom ? p.nickname : plantName(p.name);
}
function plantCardHTML(p, idx){
  const title = escapeHTML(plantDisplayName(p));
  const healthy = p.score >= 85;
  const sub = p.growthKey ? escapeHTML(tr(p.growthKey)) : (p.custom ? escapeHTML(t("noteLabel")||"") : escapeHTML(plantName(p.name)));
  const issueText = p.issueKey ? tr(p.issueKey) : "";
  return `<article class="card plant-card">
    <div class="plant-img">${p.emoji}</div>
    <div class="plant-top">
      <div><h3>${title}</h3><div class="muted">${sub}</div></div>
      <span class="badge">${healthy ? t("healthy") : t("monitor")}</span>
    </div>
    <div class="score">${p.score}<span class="muted"> / 100</span></div>
    <div class="bar"><div class="fill ${p.score<80?"yellow":""}" style="width:${p.score}%"></div></div>
    <div class="stat-line"><span>💧 ${t("water")}</span><b>${escapeHTML(tr(p.waterKey))}</b></div>
    <div class="stat-line"><span>☀️ ${t("sun")}</span><b>${escapeHTML(tr(p.sunKey))}</b></div>
    <div class="stat-line"><span>🧪 ${t("keyNutrients")}</span><b>${escapeHTML(tr(p.nutrients))}</b></div>
    <p class="muted">${escapeHTML(issueText)}</p>
    <div class="plant-card-actions">
      <button class="secondary" onclick="showPlantDetails(${idx})">${t("viewProfile")}</button>
      <button class="danger remove-plant" onclick="confirmRemovePlant(${idx})">✕ ${t("remove")}</button>
    </div>
  </article>`;
}
function renderPlants(){
  const grid = document.getElementById("plantGrid");
  const dash = document.getElementById("dashboardPlants");
  if(grid){
    grid.innerHTML = state.plants.length
      ? state.plants.map((p,i)=>plantCardHTML(p,i)).join("")
      : `<div class="card empty-state">🌱 ${escapeHTML(t("noPlants"))}</div>`;
  }
  if(dash) dash.innerHTML = state.plants.slice(0,4).map((p)=>plantCardHTML(p, state.plants.indexOf(p))).join("");
  const count = document.getElementById("plantCount");
  if(count) count.textContent = state.plants.length;
  const avg = state.plants.length ? Math.round(state.plants.reduce((a,p)=>a+p.score,0)/state.plants.length) : 0;
  const overall = document.getElementById("overallScore");
  if(overall) overall.textContent = avg;
}

/* ---------- Library ---------- */
function renderLibrary(){
  const search = document.getElementById("librarySearch");
  const grid = document.getElementById("libraryGrid");
  if(!grid) return;
  const q = (search?.value || "").toLowerCase();
  const rows = LIBRARY.filter(x=>{
    const en = x.name.toLowerCase();
    const local = plantName(x.name).toLowerCase();
    return en.includes(q) || local.includes(q);
  });
  grid.innerHTML = rows.map(x=>`
    <article class="library-item" onclick="showLibraryDetails('${escapeHTML(x.name)}')">
      <div style="font-size:45px">${x.emoji}</div>
      <h3>${escapeHTML(plantName(x.name))}</h3>
      <div class="muted">☀️ ${escapeHTML(tr(x.sunKey))} • 💧 ${escapeHTML(tr(x.humKey))}</div>
      <p><b>🧪 ${t("keyNutrients")}:</b> ${escapeHTML(tr(x.nutrients))}</p>
      <span class="badge">${t("viewProfile")} →</span>
    </article>`).join("");
}

/* ---------- Care tasks (dynamic, tied to current plants) ---------- */
const TASK_TEMPLATES = ["checkSoil","waterCheck","inspectLeaves","rotatePlant"];
const TASK_TIMES = ["17:30","18:00","today","daily"];
function careTasks(){
  return state.plants.slice(0,4).map((p,i)=>({
    plant: p, done:false,
    label: t(TASK_TEMPLATES[i % TASK_TEMPLATES.length]) + " — " + plantDisplayName(p),
    time: TASK_TIMES[i % TASK_TIMES.length] === "today" ? t("today") : (TASK_TIMES[i % TASK_TIMES.length] === "daily" ? t("daily") : TASK_TIMES[i % TASK_TIMES.length])
  }));
}
function renderTaskList(){
  const list = document.getElementById("taskList");
  if(!list) return;
  const tasks = careTasks();
  if(!tasks.length){ list.innerHTML = `<p class="muted">${escapeHTML(t("noPlants"))}</p>`; return; }
  list.innerHTML = tasks.map((task,i)=>`
    <div class="task" data-idx="${i}">
      <button class="check" onclick="completeTask(this)"></button>
      <div><b>${escapeHTML(task.label)}</b><small>${escapeHTML(task.time)}</small></div>
    </div>`).join("");
  const wc = document.getElementById("waterCount");
  if(wc) wc.textContent = tasks.length;
}
function completeTask(btn){
  const task = btn.closest(".task");
  task.classList.toggle("done");
  const done = document.querySelectorAll("#taskList .task.done").length;
  const total = document.querySelectorAll("#taskList .task").length;
  const wc = document.getElementById("waterCount");
  if(wc) wc.textContent = Math.max(0, total-done);
  const pct = document.getElementById("tasksCompletedPct");
  if(pct) pct.textContent = total ? Math.round((done/total)*100)+"%" : "0%";
  notify(task.classList.contains("done") ? t("taskCompleted") : t("taskReopened"));
}

/* ---------- Reminders table ---------- */
function renderReminders(){
  const table = document.getElementById("reminderTable");
  if(!table) return;
  const tasks = careTasks();
  table.innerHTML = tasks.map((task,i)=>`
    <tr>
      <td>${task.plant.emoji} ${escapeHTML(plantDisplayName(task.plant))}</td>
      <td>${escapeHTML(t(TASK_TEMPLATES[i % TASK_TEMPLATES.length]))}</td>
      <td>${escapeHTML(task.time)}</td>
      <td><span class="badge">${task.plant.score<80 ? t("needAttention") : t("scheduled")}</span></td>
    </tr>`).join("");
}

/* ---------- Nutrients ---------- */
function renderNutrients(){
  const cards = document.getElementById("nutrientCards");
  if(!cards) return;
  const list = NUTRIENTS[state.lang] || NUTRIENTS.en;
  cards.innerHTML = list.map(n=>`
    <article class="card">
      <div style="font-size:42px">${n[0]}</div>
      <h3>${escapeHTML(n[1])}</h3>
      <p>${escapeHTML(n[2])}</p>
      <p class="muted"><b>${t("note")}:</b> ${escapeHTML(n[3])}</p>
    </article>`).join("");
}

/* ---------- Achievements ---------- */
function renderAchievements(){
  const box = document.getElementById("achievementsList");
  if(!box) return;
  const list = ACHIEVEMENTS[state.lang] || ACHIEVEMENTS.en;
  box.innerHTML = list.map(a=>`
    <div class="task"><span>${a[0]}</span><div><b>${escapeHTML(a[1])}</b><small>${escapeHTML(a[2])}</small></div></div>`).join("");
}

/* ---------- Health trend (analytics) ---------- */
function renderHealthTrend(){
  const box = document.getElementById("healthTrendChart");
  if(!box) return;
  const points = [
    [t("dayMonday"),72],[t("dayWednesday"),79],[t("dayFriday"),84],[t("today"),
      (state.plants.length ? Math.round(state.plants.reduce((a,p)=>a+p.score,0)/state.plants.length) : 87)]
  ];
  box.innerHTML = points.map(([label,val])=>`
    <div class="stat-line"><span>${escapeHTML(label)}</span><b>${val}</b></div>
    <div class="progress"><span style="width:${val}%"></span></div>`).join("");
}

/* ---------- Analytics KPIs ---------- */
function renderAnalyticsKpis(){
  const scans = document.getElementById("scansCompletedKpi");
  if(scans) scans.textContent = state.scanCount;
  const doneEls = document.querySelectorAll("#taskList .task.done").length;
  const totalEls = document.querySelectorAll("#taskList .task").length;
  const pct = document.getElementById("tasksCompletedPct");
  if(pct) pct.textContent = totalEls ? Math.round((doneEls/totalEls)*100)+"%" : "0%";
}

/* ---------- Dashboard insight card ---------- */
function renderInsight(){
  const titleEl = document.getElementById("insightTitle");
  const bodyBoldEl = document.getElementById("insightBold");
  const bodyTextEl = document.getElementById("insightBody");
  if(titleEl) titleEl.textContent = t("insight");
  const trouble = state.plants.find(p=>p.score < 80);
  if(bodyBoldEl && bodyTextEl){
    if(trouble){
      bodyBoldEl.textContent = t("insightBad").replace("{plant}", plantDisplayName(trouble));
      bodyTextEl.textContent = t("insightBadBody");
    } else {
      bodyBoldEl.textContent = t("insightGood");
      bodyTextEl.textContent = "";
    }
  }
}

/* ---------- Full render ---------- */
function renderAll(){
  applyStaticTranslations();
  renderPlants();
  renderTaskList();
  renderLibrary();
  renderReminders();
  renderNutrients();
  renderAchievements();
  renderHealthTrend();
  renderAnalyticsKpis();
  renderInsight();
}

/* ---------- Modals ---------- */
function openAdd(){ document.getElementById("newPlantName").value=""; document.getElementById("addModal")?.classList.add("show"); }
function openScan(){ document.getElementById("scanModal")?.classList.add("show"); }
function closeModal(id){ document.getElementById(id)?.classList.remove("show"); }
function openProfile(){
  const f = document.getElementById("profileName");
  if(f) f.value = localStorage.getItem("mat_profile_name") || "";
  document.getElementById("profileModal")?.classList.add("show");
}

/* ---------- Plant details modal (replaces alert) ---------- */
function showPlantDetails(idx){
  const p = state.plants[idx];
  if(!p) return;
  const body = document.getElementById("detailsBody");
  const rows = [
    [t("healthy")+"/"+t("monitor"), (p.score>=85?t("healthy"):t("monitor")) + " · " + p.score + "/100"],
    [t("growth"), p.growthKey ? tr(p.growthKey) : "—"],
    [t("sun"), tr(p.sunKey)],
    [t("water"), tr(p.waterKey)],
    [t("soil"), p.soilKey ? tr(p.soilKey) : "—"],
    [t("temperatureLabel"), p.temp || "—"],
    [t("humidityLabel"), p.humidityKey ? tr(p.humidityKey) : "—"],
    [t("keyNutrients"), tr(p.nutrients)],
    [t("care"), p.careKey ? tr(p.careKey) : tr("Monitor regularly and follow the species profile.")]
  ];
  document.getElementById("detailsTitleText").textContent = plantDisplayName(p);
  body.innerHTML = rows.map(([label,val])=>`<div class="stat-line"><span>${escapeHTML(label)}</span><b>${escapeHTML(String(val))}</b></div>`).join("");
  document.getElementById("detailsModal")?.classList.add("show");
}
function showLibraryDetails(englishName){
  const x = LIBRARY.find(item=>item.name===englishName);
  if(!x) return;
  const body = document.getElementById("detailsBody");
  const rows = [
    [t("sun"), tr(x.sunKey)],
    [t("humidityLabel"), tr(x.humKey)],
    [t("keyNutrients"), tr(x.nutrients)]
  ];
  document.getElementById("detailsTitleText").textContent = plantName(x.name);
  body.innerHTML = rows.map(([label,val])=>`<div class="stat-line"><span>${escapeHTML(label)}</span><b>${escapeHTML(String(val))}</b></div>`).join("")
    + `<p class="muted" style="margin-top:10px">${escapeHTML(tr("Species dependent"))}</p>`;
  document.getElementById("detailsModal")?.classList.add("show");
}

/* ---------- Add / remove plants ---------- */
function addPlant(){
  const input = document.getElementById("newPlantName");
  const name = (input?.value || "").trim();
  if(!name){ input?.focus(); notify(t("nameFieldRequired")); return; }
  const match = LIBRARY.find(x=>x.name.toLowerCase()===name.toLowerCase());
  const newPlant = match
    ? { name: match.name, emoji: match.emoji, score: 85, waterKey: null, sunKey: match.sunKey, nutrients: match.nutrients, issueKey: "Newly added — monitor", soilKey: "Well-drained where appropriate", temp: "Species dependent", humidityKey: match.humKey, growthKey: null, careKey: "Monitor regularly and follow the species profile.", custom:false }
    : { name: name, nickname: name, emoji: "🌱", score: 85, waterKey: "Depends on conditions", sunKey: "To be determined", nutrients: "Species profile needed", issueKey: "Newly added — monitor", soilKey: "Well-drained where appropriate", temp: "Species dependent", humidityKey: "Species dependent", growthKey: null, careKey: "Monitor regularly and follow the species profile.", custom:true };
  if(!newPlant.waterKey) newPlant.waterKey = "Depends on conditions";
  state.plants.push(newPlant);
  savePlants();
  closeModal("addModal");
  renderAll();
  notify(t("plantAdded").replace("{plant}", match ? plantName(match.name) : name));
  showPage("plants");
}
function confirmRemovePlant(idx){
  state.pendingRemoveIndex = idx;
  const p = state.plants[idx];
  document.getElementById("confirmBody").textContent = t("removeConfirm");
  document.getElementById("confirmModal")?.classList.add("show");
}
function executeRemovePlant(){
  const idx = state.pendingRemoveIndex;
  if(idx===null || idx===undefined) return;
  state.plants.splice(idx,1);
  savePlants();
  state.pendingRemoveIndex = null;
  closeModal("confirmModal");
  renderAll();
  notify(t("plantRemoved"));
}
function cancelRemovePlant(){
  state.pendingRemoveIndex = null;
  closeModal("confirmModal");
}

/* ---------- Profile / settings ---------- */
function applyProfile(){
  const name = localStorage.getItem("mat_profile_name") || "";
  const displayName = name || "Plant Lover";
  const w = document.getElementById("welcomeName");
  if(w) w.textContent = displayName;
  const a = document.getElementById("avatar");
  if(a) a.textContent = displayName.charAt(0).toUpperCase();
  const s = document.getElementById("settingsName");
  if(s) s.value = name;
}
function saveProfile(){
  const f = document.getElementById("profileName");
  const name = (f?.value || "").trim();
  localStorage.setItem("mat_profile_name", name);
  applyProfile();
  closeModal("profileModal");
  notify((name ? name : "🌱") + "!");
}
function saveSettings(){
  const name = document.getElementById("settingsName")?.value.trim();
  if(name !== undefined) localStorage.setItem("mat_profile_name", name || "");
  applyProfile();
  const lang = document.getElementById("languageSelect")?.value || "en";
  const theme = document.getElementById("themeSelect")?.value || "light";
  changeLanguage(lang, true);
  changeTheme(theme);
  notify(t("settingsSaved"));
}

/* ---------- Language ---------- */
function changeLanguage(code, silent){
  state.lang = UI[code] ? code : "en";
  localStorage.setItem("mat_language", state.lang);
  const sel = document.getElementById("languageSelect");
  if(sel) sel.value = state.lang;
  renderAll();
  if(!silent) notify(t("languageUpdated"));
}

/* ---------- Theme + simplified light/dark button ---------- */
function changeTheme(theme){
  const allowed = ["light","dark","mint","ocean","midnight","sage"];
  state.theme = allowed.includes(theme) ? theme : "light";
  document.body.classList.remove("theme-dark","theme-mint","theme-ocean","theme-midnight","theme-sage");
  if(state.theme !== "light") document.body.classList.add("theme-" + state.theme);
  localStorage.setItem("mat_theme", state.theme);
  const sel = document.getElementById("themeSelect");
  if(sel) sel.value = state.theme;
  updateMainModeToggle(state.theme);
}
function updateMainModeToggle(theme){
  const button = document.getElementById("mainModeToggle");
  if(!button) return;
  const isDark = ["dark","midnight","sage"].includes(theme);
  button.classList.toggle("is-dark", isDark);
  button.setAttribute("aria-pressed", isDark ? "true" : "false");
  const label = isDark ? t("lightMode") : t("darkMode");
  button.setAttribute("aria-label", label);
  button.title = label;
  const icon = button.querySelector(".mode-icon");
  const text = button.querySelector(".mode-label");
  if(icon) icon.textContent = isDark ? "☀️" : "🌙";
  if(text) text.textContent = label;
}
function toggleMainTheme(){
  const isDark = ["dark","midnight","sage"].includes(state.theme);
  changeTheme(isDark ? "light" : "dark");
}

/* ---------- Notifications ---------- */
function notify(msg){
  const n = document.getElementById("notification");
  if(!n) return;
  n.textContent = msg;
  n.classList.add("show");
  clearTimeout(window.__matToast);
  window.__matToast = setTimeout(()=>n.classList.remove("show"), 2600);
}

/* ---------- Scan (Gemini vision) ---------- */
function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
async function simulateScan(input){
  const file = input.files?.[0];
  if(!file) return;
  const preview = document.getElementById("scanPreview");
  const result = document.getElementById("scanResult");
  const dataUrl = await fileToDataURL(file);
  if(preview){ preview.src = dataUrl; preview.style.display = "block"; }
  if(result){
    result.style.display = "block";
    result.innerHTML = `<div class="result-card"><h3>${escapeHTML(t("scanBusyTitle"))}</h3><p>${escapeHTML(t("waitScan"))}</p></div>`;
  }
  if(!GEMINI_API_KEY){
    if(result) result.innerHTML = `<div class="result-card"><h3>${escapeHTML(t("scanUnavailable"))}</h3><p>${escapeHTML(t("scannerKeyMissing"))}</p></div>`;
    return;
  }
  try{
    const base64Image = dataUrl.split(",")[1];
    const langName = GEMINI_LANG_NAMES[state.lang] || "English";
    let analysis = null, lastError = null;
    for(const model of GEMINI_MODELS){
      try{
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + GEMINI_API_KEY,
          {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ contents:[{ parts:[
              { text: `You are MAT AI, an intelligent plant and agriculture assistant. Analyze this plant photograph carefully and reply entirely in ${langName}. Cover: plant identification with a confidence level, visible health signs, possible nutrient issues (explain a photo cannot confirm a deficiency), watering advice, sunlight needs, and general care (soil, temperature, next steps). Be clear and helpful. Do not claim a photo can definitely diagnose a disease, pest or nutrient deficiency.` },
              { inline_data: { mime_type: file.type, data: base64Image } }
            ]}]})
          }
        );
        const data = await response.json();
        if(!response.ok) throw new Error(data.error?.message || "Request failed");
        analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if(analysis) break;
      }catch(e){ lastError = e; }
    }
    if(!analysis) throw lastError || new Error("No analysis returned.");
    renderScanResult(analysis);
    state.scanCount++;
    localStorage.setItem("mat_scan_count", String(state.scanCount));
    renderAnalyticsKpis();
    notify(t("analysisComplete"));
  }catch(error){
    console.error("Plant scanner error:", error);
    if(result) result.innerHTML = `<div class="result-card"><h3>${escapeHTML(t("scanUnavailable"))}</h3><p>${escapeHTML(error.message)}</p><p class="muted">${escapeHTML(t("tryAnotherPhoto"))}</p></div>`;
    notify(t("scanFailed"));
  }
}
function renderScanResult(text){
  const box = document.getElementById("scanResult");
  if(!box) return;
  const safe = escapeHTML(text).replace(/\n/g,"<br>");
  box.innerHTML = `<div class="result-card">
    <h3>${escapeHTML(t("scanResultHeading"))}</h3>
    <p>${safe}</p>
    <p class="muted"><b>${escapeHTML(t("scanImportantNote").split(":")[0])}:</b>${escapeHTML(t("scanImportantNote").split(":").slice(1).join(":"))}</p>
    <button class="secondary" onclick="notify('${escapeHTML(t("reviewBeforeAdd"))}')">${escapeHTML(t("addToMyPlants"))}</button>
  </div>`;
}

/* ---------- AI chat (Gemini text) ---------- */
async function askAI(){
  const input = document.getElementById("aiInput");
  const text = (input?.value || "").trim();
  if(!text) return;
  const chat = document.getElementById("chat");
  chat.insertAdjacentHTML("beforeend", `<div class="msg user">${escapeHTML(text)}</div><div class="msg bot" id="aiTyping">${escapeHTML(t("scanBusyTitle"))}</div>`);
  chat.scrollTop = chat.scrollHeight;
  input.value = "";
  if(!GEMINI_API_KEY){
    document.getElementById("aiTyping")?.remove();
    chat.insertAdjacentHTML("beforeend", `<div class="msg bot">${escapeHTML(t("aiKeyMissing"))}</div>`);
    chat.scrollTop = chat.scrollHeight;
    return;
  }
  const langName = GEMINI_LANG_NAMES[state.lang] || "English";
  let lastError = null;
  for(const model of GEMINI_MODELS){
    for(let attempt=1; attempt<=2; attempt++){
      try{
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + GEMINI_API_KEY,
          {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ contents:[{ parts:[{ text:
              `You are the Modern Agriculture Technology (MAT) AI assistant. Reply entirely in ${langName}. Answer clearly and helpfully about plants, farming, crops, watering, sunlight, soil, nutrients, plant health, gardening, agriculture, or related science and technology topics; if unrelated, answer normally and briefly. Never claim a photo or symptom alone can definitely diagnose a disease or nutrient deficiency.\n\nUser question:\n${text}` }]}]})
          }
        );
        const data = await response.json();
        if(!response.ok) throw new Error(data.error?.message || "Request failed");
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if(!reply) throw new Error("Empty response");
        document.getElementById("aiTyping")?.remove();
        chat.insertAdjacentHTML("beforeend", `<div class="msg bot">${escapeHTML(reply).replace(/\n/g,"<br>")}</div>`);
        chat.scrollTop = chat.scrollHeight;
        return;
      }catch(e){
        lastError = e;
        if(attempt<2) await new Promise(r=>setTimeout(r, 1500));
      }
    }
  }
  document.getElementById("aiTyping")?.remove();
  chat.insertAdjacentHTML("beforeend", `<div class="msg bot">${escapeHTML(t("aiBusy"))}</div>`);
  console.error("Gemini final error:", lastError);
}

/* ---------- Init ---------- */
function initPreferences(){
  const langSelect = document.getElementById("languageSelect");
  const themeSelect = document.getElementById("themeSelect");
  if(langSelect) langSelect.value = state.lang;
  if(themeSelect) themeSelect.value = state.theme;
  changeTheme(state.theme);
}
document.addEventListener("DOMContentLoaded", () => {
  loadPlants();
  applyProfile();
  initPreferences();
  renderAll();
  document.getElementById("sendAI")?.addEventListener("click", askAI);
  document.getElementById("aiInput")?.addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); askAI(); } });
  document.getElementById("confirmRemoveBtn")?.addEventListener("click", executeRemovePlant);
  document.getElementById("cancelRemoveBtn")?.addEventListener("click", cancelRemovePlant);
});
document.addEventListener("keydown", e => { if(e.key==="Escape") document.querySelectorAll(".modal.show").forEach(m=>m.classList.remove("show")); });
