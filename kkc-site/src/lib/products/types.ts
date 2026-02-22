export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price?: number | null;
  currency?: "RWF" | "USD" | null;
  showPrice: boolean;
  visible: boolean;
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
};

