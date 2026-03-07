/**
 * AGBON static translations — no React context, no hooks.
 * Import `t` directly in any component that needs localized strings.
 *
 * Usage:
 *   import { t } from '@/lib/agbon-translations'
 *   <p>{t('nav.home', locale)}</p>
 */

type Locale = 'en' | 'fr' | 'zh'

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Home Feature Cards
    'homeFeatures.1.title': 'Advancing Sustainable Forestry',
    'homeFeatures.1.desc':
      'Agbon utilizes advanced machinery to streamline timber processing, ensuring efficiency and safety for workers in the field.',
    'homeFeatures.1.cta': 'Read More',
    'homeFeatures.2.title': 'Enhancing Home Wellness',
    'homeFeatures.2.desc':
      'From climate control to nutritious food, we provide the essential solutions that make modern African homes healthier and more comfortable.',
    'homeFeatures.2.cta': 'Read More',
    'homeFeatures.3.title': 'Building Resilient Infrastructure',
    'homeFeatures.3.desc':
      'We are committed to large-scale engineering and agricultural reform to build the foundation for a sustainable and prosperous future.',
    'homeFeatures.3.cta': 'Read More',
    // Why Us
    'whyus.heading1': 'Best Products for African',
    'whyus.heading2': 'Empowering African Farms & Homes',
    'whyus.description':
      'At Agbon, we are dedicated to transforming African farming with high-quality, affordable agricultural machinery. Our mission is to boost productivity, empower local farmers, and drive sustainable growth across the continent.',
    'whyus.button': "Discover Agbon's Story",
    'whyus.benefit1.title': 'Superior Quality',
    'whyus.benefit1.desc':
      "Our machines are built to last, delivering reliable performance in Africa's toughest farming conditions.",
    'whyus.benefit2.title': 'Affordable & Accessible',
    'whyus.benefit2.desc':
      'We make modern agricultural technology accessible to all farmers, supporting growth at every scale.',
    'whyus.benefit3.title': 'Local Support',
    'whyus.benefit3.desc':
      'Agbon provides expert after-sales service and training, ensuring you get the most from your investment.',
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About AGBON',
    'nav.brandIntro': 'Brand Introduction',
    'nav.businessMap': 'Business Map',
    'nav.contact': 'Contact Us',
    'nav.joinUs': 'Join Us',
    'nav.recruitment': 'Recruitment Information',
    'nav.afterSales': 'After Sales Service',
    'nav.service': 'Service',
    // Header
    'header.search': 'Search',
    'header.searchPlaceholder': 'Search products...',
    'header.language': 'Language',
    // Home Page
    'home.featuredProducts': 'Featured Products',
    'home.hotSellingProducts': 'Hot Selling Products',
    'home.allProducts': 'All Products',
    'home.showing': 'Showing',
    'home.of': 'of',
    'home.products': 'products',
    'home.grid': 'Grid',
    'home.list': 'List',
    'home.noProducts': 'No products found matching your criteria.',
    'home.previous': 'Previous',
    'home.next': 'Next',
    // Categories
    'category.all': 'All Categories',
    'category.tillers': 'Tillers',
    'category.harvesters': 'Harvesters',
    'category.irrigation': 'Irrigation',
    'category.generators': 'Generators',
    'category.tractors': 'Tractors',
    'category.other': 'Other Equipment',
    // Footer
    'footer.companyName': 'Agbon',
    'footer.description':
      'Leading agricultural machinery manufacturer since 2018. Providing quality equipment to farmers worldwide.',
    'footer.quickLinks': 'Quick Links',
    'footer.contactUs': 'Contact Us',
    'footer.newsletter': 'Subscribe to our newsletter for updates and offers.',
    'footer.emailPlaceholder': 'Your email',
    'footer.copyright': '© 2025 AGBON. All rights reserved. Established 2018.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    // Common
    'common.learnMore': 'Learn More',
    'common.viewDetails': 'View Details',
    'common.contactUs': 'Contact Us',
    'common.relatedProducts': 'Related Products',
    'common.allProducts': 'All Products',
    'common.categories': 'Categories',
    'common.search': 'Search',
    'common.technicalDescription': 'Technical Description',
    // Search
    'search.viewAllResults': 'View All Results',
    'search.openSearch': 'Search Products',
    'search.noResults': 'No products found',
    // Our Story
    'story.title': 'Our Story',
    'story.paragraph1':
      'Since 2018, AGBON has been at the forefront of agricultural machinery innovation. We are committed to providing farmers and industries with reliable, efficient, and cost-effective equipment solutions.',
    'story.paragraph2':
      'With a presence in over 50 countries and a network of 1000+ dealers, we continue to expand our reach while maintaining the highest standards of quality and customer service.',
    'story.viewAll': 'View All',
    // Contact Page
    'contact.heading': 'Get In Touch',
    'contact.subtitle': 'Contact Us',
    'contact.description': "Have questions about our agricultural machinery? We'd love to hear from you.",
    // After Sales Service
    'aftersales.heading': 'After Sales Service',
    'aftersales.subtitle': 'We Support You',
    'aftersales.service1.title': 'Maintenance & Repair',
    'aftersales.service1.desc': 'Expert technicians ready to service and repair your AGBON equipment on-site or at our service centers.',
    'aftersales.service2.title': 'Customer Support',
    'aftersales.service2.desc': 'Our dedicated support team is available to answer your questions and resolve issues quickly.',
    'aftersales.service3.title': 'Spare Parts',
    'aftersales.service3.desc': 'Genuine AGBON spare parts available for all machinery models, delivered to your location.',
    'aftersales.areasTitle': 'Where We Serve',
    'aftersales.areasSubtitle': 'AGBON is expanding across Africa, bringing quality agricultural equipment to farmers everywhere',
    // Value Propositions
    'value.quality': 'Superior Quality',
    'value.service': 'Exceptional Services',
    'value.price': 'Affordable Prices',
    // Happy Farming Banner
    'happyFarmingBanner.tagline': 'Happy Living!',
    'happyFarmingBanner.heading': 'Empowering Farmers, Lighting Up The Future.',
    'happyFarmingBanner.subtext':
      'Reliable generators and agricultural solutions for every community. Power your farm, home, and dreams with Agbon.',
    'happyFarmingBanner.cta': 'Contact Us Today',
    'happyFarmingBanner.imageAlt': 'Agbon generator powering a family',
    // About Section
    'about.subtitle': 'Rooted in Innovation',
    'about.heading': 'Empowering African Homes & Farms',
    'about.description1':
      "Agbon delivers reliable agricultural and home solutions designed for Africa's unique needs.",
    'about.description2':
      'From powerful tools to smart appliances, we help families and farmers thrive every day.',
    'about.button': 'Learn More About Us',
    'stats.projects': 'Projects Completed',
    'stats.animals': 'Livestock Supported',
    'stats.harvest': 'Harvests Powered',
    // Commitment Section
    'commitment.subtitle': 'Our Commitment',
    'commitment.heading': 'Dedicated to Your Success, Every Step of the Way',
    'commitment.description':
      'At Agbon, our commitment goes beyond delivering quality machinery—we provide expert after-sales service, training, and ongoing support to help you get the most from your investment. Your growth is our mission.',
    'commitment.feature1': 'Expert After-Sales Support',
    'commitment.feature2': 'Genuine Spare Parts',
    'commitment.feature3': 'On-Site Maintenance',
    'commitment.feature4': 'Farmer Training Programs',
    'commitment.button': 'Learn More About Our Service',
    'commitment.imageAlt': 'Agbon after-sales support team with farmers',
    'commitment.badgeAlt': 'Agbon Service Guarantee',
  },
  fr: {
    // Home Feature Cards
    'homeFeatures.1.title': 'Innover avec des machines modernes',
    'homeFeatures.1.desc':
      'Agbon utilise les dernières technologies pour accroître la productivité et l\u2019efficacité des agriculteurs africains.',
    'homeFeatures.1.cta': 'En savoir plus',
    'homeFeatures.2.title': 'Favoriser une vie saine',
    'homeFeatures.2.desc':
      'Nous proposons des aliments sains et des solutions qui soutiennent les familles et les communautés.',
    'homeFeatures.2.cta': 'En savoir plus',
    'homeFeatures.3.title': 'Transformer les systèmes agricoles',
    'homeFeatures.3.desc':
      'Agbon s\u2019engage à réformer les pratiques agricoles pour un avenir durable et prospère.',
    'homeFeatures.3.cta': 'En savoir plus',
    // Happy Farming Banner
    'happyFarmingBanner.tagline': 'Agriculture Heureuse !',
    'happyFarmingBanner.heading': 'Autonomiser les agriculteurs, illuminer des vies.',
    'happyFarmingBanner.subtext':
      'Des générateurs fiables et des solutions agricoles pour chaque communauté. Alimentez votre ferme, votre maison et vos rêves avec Agbon.',
    'happyFarmingBanner.cta': 'Contactez-nous',
    'happyFarmingBanner.imageAlt': 'Générateur Agbon alimentant une famille',
    // About Section
    'about.subtitle': 'Ancrés dans l\u2019innovation',
    'about.heading': 'Autonomiser les foyers et fermes africains',
    'about.description1':
      'Agbon propose des solutions agricoles et domestiques fiables, adaptées aux besoins uniques de l\u2019Afrique.',
    'about.description2':
      'Des outils puissants aux appareils intelligents, nous aidons familles et agriculteurs à prospérer chaque jour.',
    'about.button': 'En savoir plus sur nous',
    'stats.projects': 'Projets réalisés',
    'stats.animals': 'Animaux soutenus',
    'stats.harvest': 'Récoltes alimentées',
    // Commitment Section
    'commitment.subtitle': 'Notre engagement',
    'commitment.heading': 'Engagés à vos côtés, à chaque étape',
    'commitment.description':
      "Chez Agbon, notre engagement va au-delà de la livraison de machines de qualité : nous offrons un service après-vente expert, des pièces détachées d\u2019origine, la maintenance sur site et la formation continue pour garantir votre réussite.",
    'commitment.feature1': 'Support après-vente expert',
    'commitment.feature2': "Pièces détachées d\u2019origine",
    'commitment.feature3': 'Maintenance sur site',
    'commitment.feature4': 'Formations pour agriculteurs',
    'commitment.button': 'En savoir plus sur notre service',
    'commitment.imageAlt': 'Équipe Agbon après-vente avec des agriculteurs',
    'commitment.badgeAlt': 'Garantie Service Agbon',
    // Why Us
    'whyus.heading1': "Autonomiser l\u2019agriculture africaine",
    'whyus.heading2': 'Avec innovation et fiabilité',
    'whyus.description':
      "Chez Agbon, nous nous engageons à transformer l\u2019agriculture africaine avec des machines agricoles de haute qualité et abordables.",
    'whyus.button': "Découvrez l\u2019histoire d\u2019Agbon",
    'whyus.benefit1.title': 'Qualité supérieure',
    'whyus.benefit1.desc':
      "Nos machines sont conçues pour durer et offrir des performances fiables dans les conditions agricoles les plus difficiles d\u2019Afrique.",
    'whyus.benefit2.title': 'Abordable & Accessible',
    'whyus.benefit2.desc':
      'Nous rendons la technologie agricole moderne accessible à tous les agriculteurs, soutenant la croissance à toutes les échelles.',
    'whyus.benefit3.title': 'Support local',
    'whyus.benefit3.desc':
      "Agbon fournit un service après-vente et une formation d\u2019experts, pour garantir un rendement optimal de votre investissement.",
    // Navigation
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.about': "À Propos d\u2019AGBON",
    'nav.brandIntro': 'Présentation de la Marque',
    'nav.businessMap': 'Carte des Affaires',
    'nav.contact': 'Nous Contacter',
    'nav.joinUs': 'Rejoignez-nous',
    'nav.recruitment': 'Informations de Recrutement',
    'nav.afterSales': 'Service Après-Vente',
    'nav.service': 'Service',
    // Header
    'header.search': 'Rechercher',
    'header.searchPlaceholder': 'Rechercher des produits...',
    'header.language': 'Langue',
    // Home Page
    'home.featuredProducts': 'Produits en Vedette',
    'home.hotSellingProducts': 'Produits les Plus Vendus',
    'home.allProducts': 'Tous les Produits',
    'home.showing': 'Affichage',
    'home.of': 'de',
    'home.products': 'produits',
    'home.grid': 'Grille',
    'home.list': 'Liste',
    'home.noProducts': 'Aucun produit trouvé correspondant à vos critères.',
    'home.previous': 'Précédent',
    'home.next': 'Suivant',
    // Categories
    'category.all': 'Toutes les Catégories',
    'category.tillers': 'Motoculteurs',
    'category.harvesters': 'Moissonneuses',
    'category.irrigation': 'Irrigation',
    'category.generators': 'Générateurs',
    'category.tractors': 'Tracteurs',
    'category.other': 'Autres Équipements',
    // Footer
    'footer.companyName': 'Agbon',
    'footer.description':
      'Fabricant leader de machines agricoles depuis 2018. Fournissant des équipements de qualité aux agriculteurs du monde entier.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.contactUs': 'Contactez-nous',
    'footer.newsletter': 'Abonnez-vous à notre newsletter pour les mises à jour et les offres.',
    'footer.emailPlaceholder': 'Votre email',
    'footer.copyright': '© 2025 AGBON. Tous droits réservés. Établi en 2018.',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': "Conditions d\u2019Utilisation",
    // Common
    'common.learnMore': 'En Savoir Plus',
    'common.viewDetails': 'Voir les Détails',
    'common.contactUs': 'Contactez-nous',
    'common.relatedProducts': 'Produits Connexes',
    'common.allProducts': 'Tous les Produits',
    'common.categories': 'Catégories',
    'common.search': 'Rechercher',
    'common.technicalDescription': 'Description Technique',
    // Search
    'search.viewAllResults': 'Voir Tous les Résultats',
    'search.openSearch': 'Rechercher des Produits',
    'search.noResults': 'Aucun produit trouvé',
    // Our Story
    'story.title': 'Notre Histoire',
    'story.paragraph1':
      "Depuis 2018, AGBON est à l\u2019avant-garde de l\u2019innovation en matière de machines agricoles.",
    'story.paragraph2':
      'Avec une présence dans plus de 50 pays et un réseau de 1000+ concessionnaires, nous continuons à étendre notre portée.',
    'story.viewAll': 'Voir Tout',
    // Contact Page
    'contact.heading': "Nous Contacter",
    'contact.subtitle': 'Contact',
    'contact.description': "Des questions sur nos machines agricoles ? Nous serions ravis de vous entendre.",
    // After Sales Service
    'aftersales.heading': 'Service Après-Vente',
    'aftersales.subtitle': 'Nous Vous Soutenons',
    'aftersales.service1.title': 'Maintenance et Réparation',
    'aftersales.service1.desc': "Des techniciens experts prêts à entretenir et réparer votre équipement AGBON sur site ou dans nos centres de service.",
    'aftersales.service2.title': 'Support Client',
    'aftersales.service2.desc': 'Notre équipe de support dédiée est disponible pour répondre à vos questions rapidement.',
    'aftersales.service3.title': 'Pièces Détachées',
    'aftersales.service3.desc': 'Pièces de rechange AGBON originales disponibles pour tous les modèles.',
    'aftersales.areasTitle': 'Où Nous Servons',
    'aftersales.areasSubtitle': "AGBON s'étend à travers l'Afrique, apportant des équipements agricoles de qualité aux agriculteurs partout.",
    // Value Propositions
    'value.quality': 'Qualité Supérieure',
    'value.service': 'Services Exceptionnels',
    'value.price': 'Prix Abordables',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.products': '产品',
    'nav.about': '关于AGBON',
    'nav.brandIntro': '品牌介绍',
    'nav.businessMap': '业务地图',
    'nav.contact': '联系我们',
    'nav.joinUs': '加入我们',
    'nav.recruitment': '招聘信息',
    'nav.afterSales': '售后服务',
    'nav.service': '服务',
    // Header
    'header.search': '搜索',
    'header.searchPlaceholder': '搜索产品...',
    'header.language': '语言',
    // Home Page
    'home.featuredProducts': '精选产品',
    'home.hotSellingProducts': '热销产品',
    'home.allProducts': '所有产品',
    'home.showing': '显示',
    'home.of': '/',
    'home.products': '产品',
    'home.grid': '网格',
    'home.list': '列表',
    'home.noProducts': '未找到符合条件的产品。',
    'home.previous': '上一页',
    'home.next': '下一页',
    // Categories
    'category.all': '所有类别',
    'category.tillers': '微耕机',
    'category.harvesters': '收割机',
    'category.irrigation': '灌溉设备',
    'category.generators': '发电机',
    'category.tractors': '拖拉机',
    'category.other': '其他设备',
    // Footer
    'footer.companyName': 'Agbon',
    'footer.description': '自2018年以来领先的农业机械制造商。为全球农民提供优质设备。',
    'footer.quickLinks': '快速链接',
    'footer.contactUs': '联系我们',
    'footer.newsletter': '订阅我们的通讯以获取更新和优惠。',
    'footer.emailPlaceholder': '您的电子邮件',
    'footer.copyright': '© 2025 AGBON。版权所有。成立于2018年。',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    // Common
    'common.learnMore': '了解更多',
    'common.viewDetails': '查看详情',
    'common.contactUs': '联系我们',
    'common.relatedProducts': '相关产品',
    'common.allProducts': '所有产品',
    'common.categories': '类别',
    'common.search': '搜索',
    'common.technicalDescription': '技术说明',
    // Search
    'search.viewAllResults': '查看所有结果',
    'search.openSearch': '搜索产品',
    'search.noResults': '未找到产品',
    // Our Story
    'story.title': '我们的故事',
    'story.paragraph1':
      '自2018年以来，AGBON一直处于农业机械创新的前沿。我们致力于为农民和工业提供可靠、高效和经济实惠的设备解决方案。',
    'story.paragraph2':
      '我们在50多个国家拥有业务，拥有1000多家经销商网络，我们继续扩大我们的影响力，同时保持最高的质量和客户服务标准。',
    'story.viewAll': '查看全部',
    // Contact Page
    'contact.heading': '联系我们',
    'contact.subtitle': '联系',
    'contact.description': '对我们的农业机械有疑问？我们很乐意聆听您的需求。',
    // After Sales Service
    'aftersales.heading': '售后服务',
    'aftersales.subtitle': '我们为您服务',
    'aftersales.service1.title': '维护与维修',
    'aftersales.service1.desc': '专业技术人员随时准备在现场或我们的服务中心为您的AGBON设备提供服务和维修。',
    'aftersales.service2.title': '客户支持',
    'aftersales.service2.desc': '我们专属的支持团队随时为您解答问题并快速解决问题。',
    'aftersales.service3.title': '备件',
    'aftersales.service3.desc': '适用于所有机械型号的正品AGBON备件，可送货上门。',
    'aftersales.areasTitle': '我们的服务区域',
    'aftersales.areasSubtitle': 'AGBON正在非洲各地扩张，为各地农民带来优质农业设备。',
    // Fallbacks for keys missing in zh — use en values
    'whyus.heading1': 'Best Products for African',
    'whyus.heading2': 'Empowering African Farms & Homes',
    'whyus.description':
      'At Agbon, we are dedicated to transforming African farming with high-quality, affordable agricultural machinery.',
    'whyus.button': "Discover Agbon's Story",
    'whyus.benefit1.title': 'Superior Quality',
    'whyus.benefit1.desc': 'Our machines are built to last.',
    'whyus.benefit2.title': 'Affordable & Accessible',
    'whyus.benefit2.desc': 'We make modern agricultural technology accessible to all farmers.',
    'whyus.benefit3.title': 'Local Support',
    'whyus.benefit3.desc': 'Agbon provides expert after-sales service and training.',
    'homeFeatures.1.title': 'Advancing Sustainable Forestry',
    'homeFeatures.1.desc': 'Agbon utilizes advanced machinery to streamline timber processing.',
    'homeFeatures.1.cta': 'Read More',
    'homeFeatures.2.title': 'Enhancing Home Wellness',
    'homeFeatures.2.desc': 'We provide essential solutions for modern African homes.',
    'homeFeatures.2.cta': 'Read More',
    'homeFeatures.3.title': 'Building Resilient Infrastructure',
    'homeFeatures.3.desc': 'We are committed to large-scale engineering and agricultural reform.',
    'homeFeatures.3.cta': 'Read More',
    'happyFarmingBanner.tagline': 'Happy Living!',
    'happyFarmingBanner.heading': 'Empowering Farmers, Lighting Up The Future.',
    'happyFarmingBanner.subtext':
      'Reliable generators and agricultural solutions for every community.',
    'happyFarmingBanner.cta': 'Contact Us Today',
    'happyFarmingBanner.imageAlt': 'Agbon generator powering a family',
    'about.subtitle': 'Rooted in Innovation',
    'about.heading': 'Empowering African Homes & Farms',
    'about.description1': 'Agbon delivers reliable agricultural and home solutions.',
    'about.description2': 'We help families and farmers thrive every day.',
    'about.button': 'Learn More About Us',
    'stats.projects': 'Projects Completed',
    'stats.animals': 'Livestock Supported',
    'stats.harvest': 'Harvests Powered',
    'commitment.subtitle': 'Our Commitment',
    'commitment.heading': 'Dedicated to Your Success, Every Step of the Way',
    'commitment.description': 'At Agbon, our commitment goes beyond delivering quality machinery.',
    'commitment.feature1': 'Expert After-Sales Support',
    'commitment.feature2': 'Genuine Spare Parts',
    'commitment.feature3': 'On-Site Maintenance',
    'commitment.feature4': 'Farmer Training Programs',
    'commitment.button': 'Learn More About Our Service',
    'commitment.imageAlt': 'Agbon after-sales support team with farmers',
    'commitment.badgeAlt': 'Agbon Service Guarantee',
    'value.quality': 'Superior Quality',
    'value.service': 'Exceptional Services',
    'value.price': 'Affordable Prices',
  },
}

/**
 * Get a translated string.
 * Falls back to English if the key is not found in the requested locale.
 * Returns the key itself if not found anywhere.
 */
export function t(key: string, locale: string = 'en'): string {
  const loc = (translations[locale as Locale] ? locale : 'en') as Locale
  return translations[loc][key] ?? translations['en'][key] ?? key
}

export type { Locale }
