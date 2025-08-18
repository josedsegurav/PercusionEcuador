export interface Product {
    id: number;
    name: string;
    description: string;
    selling_price: number;
    stock_quantity: number;
    image?: string;
    categories?: { id: number; name: string };
    vendors?: { id: number; name: string };
    created_at: string;
}