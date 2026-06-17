import gs24f from "@/assets/products/gs24f.jpg";
import gs24plus from "@/assets/products/gs24plus.jpg";
import gs24pro from "@/assets/products/gs24pro.jpg";
import gs24vb from "@/assets/products/gs24vb.jpg";
import n22 from "@/assets/products/n22.jpg";
import t24m from "@/assets/products/t24m.jpg";
import xps22f from "@/assets/products/xps22f.jpg";
import xps22m from "@/assets/products/xps22m.jpg";

export interface Product {
  id: string;
  name: string;
  category: "allinone" | "monitor";
  categoryLabel: string;
  price: string;
  inStock: boolean;
  image: string;
  code: string;
}

export const products: Product[] = [
  { id: "gs24f", name: "VAR GS24F", category: "allinone", categoryLabel: "All In One", price: "Sold out", inStock: false, image: gs24f, code: "GS-24F" },
  { id: "gs24plus", name: "VAR GS24PLUS", category: "allinone", categoryLabel: "All In One", price: "Sold out", inStock: false, image: gs24plus, code: "GS-24+" },
  { id: "gs24pro", name: "VAR GS24PRO", category: "allinone", categoryLabel: "All In One", price: "Sold out", inStock: false, image: gs24pro, code: "GS-24P" },
  { id: "gs24vb", name: "VAR GS24VB", category: "allinone", categoryLabel: "All In One", price: "Sold out", inStock: false, image: gs24vb, code: "GS-24VB" },
  { id: "n22", name: "VAR N22", category: "monitor", categoryLabel: "Monitor", price: "13.000 د.ج", inStock: true, image: n22, code: "N-22" },
  { id: "t24m", name: "VAR T24M", category: "monitor", categoryLabel: "Monitor", price: "18.700 د.ج", inStock: true, image: t24m, code: "T-24M" },
  { id: "xps22f", name: "VAR XPS22F", category: "allinone", categoryLabel: "All In One", price: "65.000 د.ج", inStock: true, image: xps22f, code: "XPS-22F" },
  { id: "xps22m", name: "VAR XPS22M", category: "allinone", categoryLabel: "All In One", price: "65.000 د.ج", inStock: true, image: xps22m, code: "XPS-22M" },
];

export const stats = [
  { value: 12, suffix: "", label: "Years of Experience" },
  { value: 58, suffix: "", label: "Wilayas Covered" },
  { value: 35, suffix: "+", label: "Products Shipped" },
  { value: 23, suffix: "", label: "Enterprise Clients" },
];

export const metrics = [
  { value: 92, label: "Quality" },
  { value: 90, label: "Accuracy" },
  { value: 82, label: "Performance" },
  { value: 88, label: "Price" },
];

export const categories = [
  {
    title: "All-In-One Computers",
    desc: "Power and simplicity in a single compact unit. Integrated design saves space while delivering reliable performance and modern connectivity for home and office.",
    code: "01",
  },
  {
    title: "Monitors",
    desc: "Sharp visuals and smooth performance for work and entertainment. Clean design and reliable clarity enhance any setup, from home offices to professional environments.",
    code: "02",
  },
  {
    title: "Toner Cartridges",
    desc: "Crisp, consistent printing for text and graphics. Designed for reliable performance across large print volumes while keeping office workflows efficient.",
    code: "03",
  },
];
