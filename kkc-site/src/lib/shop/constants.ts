export const BUSINESS = {
  name: "KKC Quincaillerie",
  location: "Kigali – Gisozi, Rwanda",
  phone: "+250 788 318 876",
  whatsappNumber: "250788318876"
} as const;

export function whatsappProductUrl(productName: string) {
  const text = `Hello KKC, I am interested in ${productName}`;
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

