export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  isFeatured: boolean;
  rating: number;
  category: 'Men' | 'Women' | 'Unisex' | 'Sunglasses';
  frameStyle: 'Aviator' | 'Wayfarer' | 'Round' | 'Cat Eye' | 'Square';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
