import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faHashtag,
    faFileText,
    faCalendar,
    faEdit,
    faTags,
    faBuilding,
    faBarcode,
    faDollarSign,
    faWarehouse,
    faExclamationTriangle,
    faImage,
    faShoppingCart,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import EditButton from '@/components/editButton';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Product } from '@/app/utils/types';


export default async function ProductViewPage({ params, }: { params: Promise<{ id: string }> }) {
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
                updated_at,
                bucket_id,
                image_name
                `).eq("id", id).single();

    const productImage = productData?.image_name ? supabase.storage.from(productData.bucket_id).getPublicUrl(productData.image_name) : null;
console.log(productImage)
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
    } as unknown as Product
    // Calculate profit margin
    const profitMargin = ((product?.selling_price - product?.cost_price) / product?.selling_price * 100).toFixed(1);
    const isLowStock = (product?.stock_quantity || 0) <= (product?.min_stock_level || 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Productos"
                title={`Producto: ${product?.name}`}
                description="Vista detallada del producto seleccionado"
                count={product?.id}
                countDescription="ID de Producto"
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href="/admin?tab=products" />
                    <EditButton href={`/admin/products/${product?.id}/edit`} color="green" />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faBox}
                                    className="text-white text-2xl"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="mb-2">
                                    <span className="text-green-200 text-sm font-medium">
                                        ID: #{product?.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    {product?.name}
                                </h1>
                                <p className="text-green-100 text-sm mt-1">
                                    Vista detallada de producto
                                </p>
                            </div>
                            {/* Stock Status Badge */}
                            <div className="text-right">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isLowStock
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    <FontAwesomeIcon
                                        icon={isLowStock ? faExclamationTriangle : faWarehouse}
                                        className="mr-2 text-xs"
                                    />
                                    {isLowStock ? 'Stock Bajo' : 'Stock OK'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="space-y-8">
                            {/* Product Image */}
                            {product?.image && (
                                <div className="bg-purple-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faImage}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-purple-900">
                                            Imagen del Producto
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <div className="max-w-md">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-64 object-contain rounded-lg border-2 border-purple-200 shadow-md"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Product ID */}
                            <div className="bg-green-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faHashtag}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900">
                                        Identificador
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-2xl font-bold text-green-800">
                                        #{product?.id}
                                    </p>
                                    <p className="text-green-600 text-sm mt-1">
                                        ID único del producto
                                    </p>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faBox}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Nombre del Producto
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-xl font-semibold text-gray-800">
                                        {product?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mt-1">
                                        <FontAwesomeIcon
                                            icon={faFileText}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Descripción
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-gray-700 leading-relaxed">
                                        {product?.description}
                                    </p>
                                </div>
                            </div>

                            {/* Category and Vendor */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="bg-indigo-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faTags}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-indigo-900">
                                            Categoría
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-indigo-800">
                                            {product.categories?.name}
                                        </p>
                                        <p className="text-indigo-600 text-sm mt-1">
                                            ID: #{product.categories?.id}
                                        </p>
                                    </div>
                                </div>

                                {/* Vendor */}
                                <div className="bg-teal-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faBuilding}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-teal-900">
                                            Proveedor
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-teal-800">
                                            {product.vendors?.name}
                                        </p>
                                        <p className="text-teal-600 text-sm mt-1">
                                            ID: #{product.vendors?.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SKU */}
                            <div className="bg-yellow-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faBarcode}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-yellow-900">
                                        SKU (Código)
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-xl font-mono font-bold text-yellow-800">
                                        {product?.sku}
                                    </p>
                                    <p className="text-yellow-600 text-sm mt-1">
                                        Código único de identificación
                                    </p>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Cost Price */}
                                <div className="bg-red-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faDollarSign}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-red-900">
                                            Precio de Costo
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-2xl font-bold text-red-800">
                                            ${product?.cost_price.toFixed(2)}
                                        </p>
                                        <p className="text-red-600 text-sm mt-1">
                                            Precio de compra
                                        </p>
                                    </div>
                                </div>

                                {/* Selling Price */}
                                <div className="bg-green-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faShoppingCart}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-900">
                                            Precio de Venta
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-2xl font-bold text-green-800">
                                            ${product?.selling_price.toFixed(2)}
                                        </p>
                                        <p className="text-green-600 text-sm mt-1">
                                            Precio al público
                                        </p>
                                    </div>
                                </div>

                                {/* Profit Margin */}
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faChartLine}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-900">
                                            Margen de Ganancia
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-2xl font-bold text-blue-800">
                                            {profitMargin}%
                                        </p>
                                        <p className="text-blue-600 text-sm mt-1">
                                            Ganancia: ${(product?.selling_price - product?.cost_price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Current Stock */}
                                <div className={`rounded-lg p-6 ${isLowStock ? 'bg-red-50' : 'bg-blue-50'
                                    }`}>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-red-500' : 'bg-blue-500'
                                            }`}>
                                            <FontAwesomeIcon
                                                icon={faWarehouse}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className={`text-lg font-semibold ${isLowStock ? 'text-red-900' : 'text-blue-900'
                                            }`}>
                                            Stock Actual
                                            {isLowStock && (
                                                <FontAwesomeIcon
                                                    icon={faExclamationTriangle}
                                                    className="ml-2 text-red-500"
                                                />
                                            )}
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className={`text-2xl font-bold ${isLowStock ? 'text-red-800' : 'text-blue-800'
                                            }`}>
                                            {product?.stock_quantity} unidades
                                        </p>
                                        <p className={`text-sm mt-1 ${isLowStock ? 'text-red-600' : 'text-blue-600'
                                            }`}>
                                            {isLowStock ? 'Stock bajo - Reabastecer pronto' : 'Stock disponible'}
                                        </p>
                                    </div>
                                </div>

                                {/* Minimum Stock Level */}
                                <div className="bg-orange-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faExclamationTriangle}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-orange-900">
                                            Stock Mínimo
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-2xl font-bold text-orange-800">
                                            {product?.min_stock_level} unidades
                                        </p>
                                        <p className="text-orange-600 text-sm mt-1">
                                            Nivel de alerta para reposición
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Created At */}
                                <div className="bg-green-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-900">
                                            Fecha de Creación
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-green-800">
                                            {new Date(product?.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-green-600 text-sm mt-1">
                                            {new Date(product?.created_at).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Updated At */}
                                <div className="bg-orange-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-orange-900">
                                            Última Modificación
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-orange-800">
                                            {new Date(product?.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-orange-600 text-sm mt-1">
                                            {new Date(product?.updated_at).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};