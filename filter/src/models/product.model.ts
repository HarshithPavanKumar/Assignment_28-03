export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: string; // Optional category field
}
