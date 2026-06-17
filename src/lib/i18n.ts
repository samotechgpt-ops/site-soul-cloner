export type Locale = "fr" | "ar";

export const dict = {
  fr: {
    nav: { home: "Accueil", catalog: "Catalogue", about: "À propos", contact: "Contact", cart: "Panier" },
    cta: { discover: "Découvrir", order: "Commander", addCart: "Ajouter au panier", whatsapp: "Commander via WhatsApp", viewProduct: "Voir le produit" },
    hero: { title1: "Votre Vision.", title2: "Notre Technologie.", subtitle: "Leader local en équipements informatique, bureautique et électrique de pointe." },
    catalog: { title: "Catalogue", subtitle: "Tous nos produits", all: "Tous", search: "Rechercher un produit...", noResults: "Aucun produit trouvé", filterCategory: "Catégorie", inStock: "En stock", outOfStock: "Rupture", price: "Prix" },
    cart: { title: "Votre panier", empty: "Votre panier est vide", subtotal: "Sous-total", checkout: "Valider la commande", remove: "Retirer", quantity: "Qté", clear: "Vider", continue: "Continuer mes achats" },
    checkout: { title: "Finaliser la commande", name: "Nom complet", phone: "Téléphone", email: "Email (optionnel)", address: "Adresse", wilaya: "Wilaya", notes: "Note (optionnel)", submit: "Envoyer la commande", whatsapp: "Envoyer aussi via WhatsApp", success: "Commande envoyée ! Nous vous contactons rapidement." },
    admin: { login: "Connexion Admin", password: "Mot de passe", signIn: "Se connecter", dashboard: "Tableau de bord", products: "Produits", leads: "Demandes", settings: "Paramètres", logout: "Déconnexion", addProduct: "Ajouter un produit", edit: "Modifier", delete: "Supprimer", save: "Enregistrer", cancel: "Annuler" },
    footer: { rights: "Tous droits réservés", made: "Made in Algeria" },
  },
  ar: {
    nav: { home: "الرئيسية", catalog: "الكتالوج", about: "من نحن", contact: "اتصال", cart: "السلة" },
    cta: { discover: "اكتشف", order: "اطلب الآن", addCart: "أضف إلى السلة", whatsapp: "اطلب عبر واتساب", viewProduct: "عرض المنتج" },
    hero: { title1: "رؤيتك.", title2: "تكنولوجيتنا.", subtitle: "الرائد المحلي في معدات الإعلام الآلي والمكتبية والكهربائية." },
    catalog: { title: "الكتالوج", subtitle: "جميع منتجاتنا", all: "الكل", search: "ابحث عن منتج...", noResults: "لا توجد نتائج", filterCategory: "الفئة", inStock: "متوفر", outOfStock: "غير متوفر", price: "السعر" },
    cart: { title: "سلتك", empty: "السلة فارغة", subtotal: "المجموع", checkout: "إتمام الطلب", remove: "حذف", quantity: "الكمية", clear: "إفراغ", continue: "متابعة التسوق" },
    checkout: { title: "إتمام الطلب", name: "الاسم الكامل", phone: "الهاتف", email: "البريد (اختياري)", address: "العنوان", wilaya: "الولاية", notes: "ملاحظة (اختياري)", submit: "إرسال الطلب", whatsapp: "أرسل أيضاً عبر واتساب", success: "تم الإرسال! سنتواصل معك قريباً." },
    admin: { login: "دخول الإدارة", password: "كلمة المرور", signIn: "تسجيل الدخول", dashboard: "لوحة التحكم", products: "المنتجات", leads: "الطلبات", settings: "الإعدادات", logout: "تسجيل الخروج", addProduct: "إضافة منتج", edit: "تعديل", delete: "حذف", save: "حفظ", cancel: "إلغاء" },
    footer: { rights: "جميع الحقوق محفوظة", made: "صنع في الجزائر" },
  },
} as const;

export type Dict = typeof dict.fr;

export function formatDZD(n: number): string {
  return new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(n) + " DA";
}
