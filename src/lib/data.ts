import gs24f from "@/assets/products/gs24f.jpg";
import gs24plus from "@/assets/products/gs24plus.jpg";
import gs24pro from "@/assets/products/gs24pro.jpg";
import gs24vb from "@/assets/products/gs24vb.jpg";
import n22 from "@/assets/products/n22.jpg";
import t24m from "@/assets/products/t24m.jpg";
import xps22f from "@/assets/products/xps22f.jpg";
import xps22m from "@/assets/products/xps22m.jpg";
import varU27Pro from "@/assets/products/var-u27-pro.jpg";
import varXps27Elite from "@/assets/products/var-xps27-elite.jpg";
import varKbCombo from "@/assets/products/var-kb-combo.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  categoryId?: string;
  price: string;
  priceValue: number;
  inStock: boolean;
  stock?: number;
  image: string;
  images?: string[];
  code: string;
  description: string;
}

export const products: Product[] = [
  { id: "gs24f", name: "VAR GS24F", category: "allinone", categoryLabel: "All In One", price: "Sold out", priceValue: 0, inStock: false, image: gs24f, code: "GS-24F", description: "All-in-one AUDAX conçu pour les setups compacts, bureautique rapide et usage quotidien." },
  { id: "gs24plus", name: "VAR GS24PLUS", category: "allinone", categoryLabel: "All In One", price: "Sold out", priceValue: 0, inStock: false, image: gs24plus, code: "GS-24+", description: "Version renforcée du GS24 avec écran intégré et châssis sobre pour postes professionnels." },
  { id: "gs24pro", name: "VAR GS24PRO", category: "allinone", categoryLabel: "All In One", price: "Sold out", priceValue: 0, inStock: false, image: gs24pro, code: "GS-24P", description: "Station tout-en-un pro avec finition premium pour espace de travail moderne." },
  { id: "gs24vb", name: "VAR GS24VB", category: "allinone", categoryLabel: "All In One", price: "Sold out", priceValue: 0, inStock: false, image: gs24vb, code: "GS-24VB", description: "All-in-one fiable pour entreprise, intégration propre et maintenance simplifiée." },
  { id: "n22", name: "VAR N22", category: "monitor", categoryLabel: "Monitor", price: "13.000 د.ج", priceValue: 13000, inStock: true, image: n22, code: "N-22", description: "Écran 22 pouces clair et accessible pour travail, études et divertissement." },
  { id: "t24m", name: "VAR T24M", category: "monitor", categoryLabel: "Monitor", price: "18.700 د.ج", priceValue: 18700, inStock: true, image: t24m, code: "T-24M", description: "Moniteur 24 pouces avec affichage net, idéal pour productivité, bureautique et usage multimédia." },
  { id: "xps22f", name: "VAR XPS22F", category: "allinone", categoryLabel: "All In One", price: "65.000 د.ج", priceValue: 65000, inStock: true, image: xps22f, code: "XPS-22F", description: "PC All-In-One complet avec excellent rapport performance/prix pour usage quotidien." },
  { id: "xps22m", name: "VAR XPS22M", category: "allinone", categoryLabel: "All In One", price: "65.000 د.ج", priceValue: 65000, inStock: true, image: xps22m, code: "XPS-22M", description: "All-In-One élégant pour bureau, commerce et postes connectés à forte disponibilité." },
  { id: "u27pro", name: "VAR U27 PRO", category: "monitor", categoryLabel: "Monitor", price: "89.000 د.ج", priceValue: 89000, inStock: true, image: varU27Pro, code: "U-27P", description: "Moniteur ultrawide 27 pouces incurvé VAR — premium, dalle haute fidélité, idéal pour productivité avancée et stations de travail pro." },
  { id: "xps27elite", name: "VAR XPS27 ELITE", category: "allinone", categoryLabel: "All In One", price: "145.000 د.ج", priceValue: 145000, inStock: true, image: varXps27Elite, code: "XPS-27E", description: "PC All-In-One VAR 27 pouces Elite — écran sans bordure, webcam intégrée, performances bureautiques haut de gamme pour entreprise." },
  { id: "kbcombo", name: "VAR KB+M COMBO PRO", category: "accessories", categoryLabel: "Accessories", price: "12.500 د.ج", priceValue: 12500, inStock: true, image: varKbCombo, code: "KB-COMBO", description: "Combo clavier mécanique premium + souris ergonomique VAR — finition aluminium, rétroéclairage rouge, confort longue durée." },
];

export const stats = [
  { value: 12, suffix: "", label: "Years of Experience" },
  { value: 69, suffix: "", label: "Wilayas Covered" },
  { value: 35, suffix: "+", label: "Products Shipped" },
  { value: 23, suffix: "", label: "Enterprise Clients" },
];

export const metrics = [
  { value: 92, label: "Quality" },
  { value: 90, label: "Accuracy" },
  { value: 82, label: "Performance" },
  { value: 88, label: "Price" },
];

export interface Category {
  id: string;
  code: string;
  title: string;
  desc: string;
  image?: string;
  slug: string;
}

import allInOneImg from "@/assets/var-office-allinone.jpg";
import monitorImg from "@/assets/var-monitor-wall.jpg";
import accessoriesImg from "@/assets/var-it-accessories.jpg";
import showroomImg from "@/assets/var-business-showroom.jpg";

export const categories: Category[] = [
  {
    id: "allinone",
    code: "01",
    slug: "allinone",
    image: allInOneImg,
    title: "PC All-In-One VAR",
    desc: "Ordinateurs tout-en-un VAR pour bureaux, commerces, écoles et entreprises — écran intégré, encombrement réduit et installation propre.",
  },
  {
    id: "monitor",
    code: "02",
    slug: "monitor",
    image: monitorImg,
    title: "Moniteurs VAR",
    desc: "Écrans VAR pour travail, études, affichage commercial et postes professionnels — image nette, prix DZD et disponibilité en Algérie.",
  },
  {
    id: "accessories",
    code: "03",
    slug: "accessories",
    image: accessoriesImg,
    title: "Accessoires IT",
    desc: "Claviers, souris, câbles, consommables, toners et accessoires informatiques pour équiper un poste complet.",
  },
  {
    id: "setup",
    code: "04",
    slug: "setup",
    image: showroomImg,
    title: "Solutions B2B",
    desc: "Configurations clé en main pour bureaux, boutiques, salles de formation et entreprises — conseil, livraison et devis personnalisé.",
  },
];

