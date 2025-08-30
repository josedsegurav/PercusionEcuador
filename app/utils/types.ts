export interface Product {
    id: number;
    name: string;
    description: string;
    selling_price: number;
    stock_quantity: number;
    bucket_id: string;
    image_name: string;
    image: string;
    categories?: { id: number; name: string };
    vendors?: { id: number; name: string };
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    role: string;
    user_id: string;
}

export interface HeaderType {
    currentPage: string,
    title: string,
    description: string,
    count: number | React.ReactNode,
    countDescription: string
}

export interface adminCard {
    id: number,
    tab_title: string,
    tab_description: string
}