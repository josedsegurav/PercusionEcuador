import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import ProductEditForm from '@/components/productEditForm';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/app/utils/types';
import DeleteButton from '@/components/deleteButton';

export default async function ProductEditPage({ params, }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const supabase = await createClient();

    const { data: productData } = await supabase.from("products").select(`
                id,
                name,
                description,
                cost_price,
                sku,
                min_stock_level,
                selling_price,
                stock_quantity,
                categories (id, name),
                vendors (id, name),
                created_at,
                bucket_id,
                image_name
                `).eq("id", id).single();
    const { data: categories } = await supabase.from("categories").select("*");
    const { data: vendors } = await supabase.from("vendors").select("*");

    const productImage = productData?.image_name ? supabase.storage.from(productData.bucket_id).getPublicUrl(productData.image_name) : null;

    const product = {
        id: productData?.id || 0,
        name: productData?.name || '',
        description: productData?.description || '',
        cost_price: productData?.cost_price || 0,
        selling_price: productData?.selling_price || 0,
        stock_quantity: productData?.stock_quantity || 0,
        bucket_id: productData?.bucket_id || '',
        image_name: productData?.image_name || '',
        image: productImage?.data?.publicUrl || '',
        categories: productData?.categories,
        vendors: productData?.vendors,
        sku: productData?.sku || '',
        min_stock_level: productData?.min_stock_level || 0,
        created_at: productData?.created_at || ''
    }

    // Early return if product not found
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h1>
                    <p className="text-gray-600">El producto con ID {id} no existe.</p>
                </div>
            </div>
        );
    }

    // Early return if required data is missing
    if (!categories || !vendors) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar datos</h1>
                    <p className="text-gray-600">No se pudieron cargar las categorías o proveedores.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Productos"
                title={`Editar: ${product?.name}`}
                description="Modifica los datos del producto seleccionado"
                count={product?.id}
                countDescription="ID de Producto"
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href={`/admin/products/${product?.id}`} />
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Editando ID:</span> #{product?.id}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faBox}
                                    className="text-white text-2xl"
                                />
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-green-200 text-sm font-medium">
                                        Editando ID: #{product?.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Editar Producto
                                </h1>
                                <p className="text-green-100 text-sm mt-1">
                                    Modifica la información del producto
                                </p>
                            </div>
                        </div>
                        <DeleteButton
                            href={`/admin/?tab=`}
                            item={"producto"}
                            itemData={product}
                            table='products'
                        />
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <ProductEditForm
                            form='edit'
                            product={product as unknown as Product}
                            categories={categories}
                            vendors={vendors}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};