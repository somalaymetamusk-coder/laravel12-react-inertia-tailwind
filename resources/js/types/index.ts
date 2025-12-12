export interface ProductGallery {
    id: number;
    product_id: number;
    image_path: string;
    image_name: string | null;
    sort_order: number;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number | string;
    stock: number;
    sku: string | null;
    feature_image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    galleries?: ProductGallery[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    stock: string;
    sku: string;
    feature_image: File | null;
    is_active: boolean;
    gallery_images: File[];
    remove_gallery_ids: number[];
}
