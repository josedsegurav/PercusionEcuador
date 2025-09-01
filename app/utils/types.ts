import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface Product {
    id: number;
    name: string;
    description: string;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    bucket_id: string;
    image_name: string;
    image: string;
    categories?: { id: number; name: string };
    vendors?: { id: number; name: string };
    sku?: string;
    min_stock_level?: number;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    role: string;
    user_id: string;
    created_at: string
    updated_at?: string;
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

export interface tabData {
    id: string,
    label: string,
    icon: IconDefinition,
    count?: number,
    color: string
}

export interface Vendor {
    id: string;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    created_at?: string;
    updated_at?: string;
}