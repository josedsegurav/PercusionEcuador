'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faTimes,
    faBox,
    faFileText,
    faHashtag,
    faTags,
    faBuilding,
    faBarcode,
    faDollarSign,
    faWarehouse,
    faExclamationTriangle,
    faImage,
    faUpload,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Product, Vendor } from '@/app/utils/types';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function ProductEditForm({ form, product, categories, vendors }: { form: string, product: Product | null, categories: Array<Category>, vendors: Array<Vendor> }) {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        name: product ? product.name : '',
        description: product ? product.description : '',
        category_id: product ? product.categories?.id : '',
        vendor_id: product ? product.vendors?.id : '',
        sku: product ? product.sku : '',
        cost_price: product ? product.cost_price : '',
        selling_price: product ? product.selling_price : '',
        stock_quantity: product ? product.stock_quantity : '',
        min_stock_level: product ? product.min_stock_level : ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(product?.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bucket] = useState(product ? product.bucket_id : 'product_images')

    const generateSKU = () => {
        if (formData.name) {
            const words = formData.name.toUpperCase().split(' ');
            const acronym = words.map(word => word.charAt(0)).join('');
            const timestamp = Date.now().toString().slice(-4);
            const suggestedSKU = `${acronym}-${timestamp}`;
            setFormData(prev => ({
                ...prev,
                sku: suggestedSKU
            }));
        }
    };

    console.log("img", selectedImage)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    console.log("bucket:", bucket)
    console.log(formData)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Handle image upload if new image selected
            if (selectedImage && bucket) {
                // Generate unique filename with timestamp

                const fileExtension = selectedImage.name.split('.').pop();
                const fileNameText = selectedImage.name.split('.')[0]
                const fileName = `product_${fileNameText}.${fileExtension}`;

                const fileBuffer = await selectedImage.arrayBuffer()

                const { error: imgError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, fileBuffer, {
                        contentType: selectedImage.type,
                        cacheControl: '3600'
                    });

                if (imgError) {
                    console.log('Image upload error:', imgError);
                } else {
                    console.log('Image uploaded successfully:', fileName);
                }
            }

            if (form == 'edit') {
                // Update product data
                const fileNameText = selectedImage?.name.split('.')[0]
                const { error } = await supabase.from("products").update({
                    name: formData.name,
                    description: formData.description,
                    category_id: formData.category_id,
                    vendor_id: formData.vendor_id,
                    sku: formData.sku,
                    bucket_id: product?.bucket_id,
                    image_name: selectedImage ? `product_${fileNameText}.${selectedImage.name.split('.').pop()}` : product?.image_name,
                    cost_price: Number(formData.cost_price),
                    selling_price: Number(formData.selling_price),
                    stock_quantity: Number(formData.stock_quantity),
                    min_stock_level: Number(formData.min_stock_level)
                }).eq("id", product?.id);

                if (error) {
                    console.log('Product update error:', error);
                } else {
                    // Redirect back to product view page
                    router.push(`/admin/products/${product?.id}`);
                    router.refresh();
                }
            } else if (form == 'add') {
                const fileNameText = selectedImage?.name.split('.')[0]
                const { error } = await supabase.from("products").insert({
                    name: formData.name,
                    description: formData.description,
                    category_id: formData.category_id,
                    vendor_id: formData.vendor_id,
                    sku: formData.sku,
                    bucket_id: bucket,
                    image_name: `product_${fileNameText}.${selectedImage?.name.split('.').pop()}`,
                    cost_price: Number(formData.cost_price),
                    selling_price: Number(formData.selling_price),
                    stock_quantity: Number(formData.stock_quantity),
                    min_stock_level: Number(formData.min_stock_level)
                })

                if (error) {
                    console.log('Product insert error:', error);
                } else {
                    // Redirect back to product view page
                    router.push(`/admin/?tab=products`);
                    router.refresh();
                }
            }


        } catch (error) {
            console.log('Unexpected error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push(`/admin/products/${product?.id}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Non-editable ID Display */}
            {product ? (<div className="bg-gray-100 rounded-lg p-6 border-l-4 border-gray-400">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faHashtag}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Identificador (No Editable)
                    </h3>
                </div>
                <div className="ml-13">
                    <p className="text-2xl font-bold text-gray-600">
                        #{product?.id}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        El ID no puede ser modificado
                    </p>
                </div>
            </div>) : ''}


            {/* Image Upload */}
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
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
                    <div className="space-y-4">
                        {imagePreview && (
                            <div className="relative inline-block">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-purple-200"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-colors">
                                <FontAwesomeIcon icon={faUpload} className="text-sm mr-2" />
                                Seleccionar Imagen
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {selectedImage && (
                                <span className="text-sm text-purple-600 font-medium">
                                    {selectedImage.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-purple-600 text-sm mt-2">
                        Formatos aceptados: JPG, PNG (máx. 5MB)
                    </p>
                </div>
            </div>

            {/* Name Field */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faBox}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                        Nombre del Producto *
                    </h3>
                </div>
                <div className="ml-13">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium"
                        placeholder="Ingresa el nombre del producto"
                        required
                    />
                    <p className="text-blue-600 text-sm mt-2">
                        Nombre principal que se mostrará en el sitio web
                    </p>
                </div>
            </div>

            {/* Description Field */}
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-500">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mt-1">
                        <FontAwesomeIcon
                            icon={faFileText}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Descripción *
                    </h3>
                </div>
                <div className="ml-13">
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe detalladamente este producto..."
                        required
                    />
                    <p className="text-gray-600 text-sm mt-2">
                        Descripción que aparecerá en la página del producto
                    </p>
                </div>
            </div>

            {/* Category and Vendor Selection */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faTags}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-indigo-900">
                            Categoría *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-indigo-600 text-sm mt-2">
                            Categoría donde se clasificará el producto
                        </p>
                    </div>
                </div>

                {/* Vendor */}
                <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faBuilding}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-teal-900">
                            Proveedor *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <select
                            id="vendor_id"
                            name="vendor_id"
                            value={formData.vendor_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            required
                        >
                            <option value="">Selecciona un proveedor</option>
                            {vendors.map(vendor => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-teal-600 text-sm mt-2">
                            Proveedor que suministra este producto
                        </p>
                    </div>
                </div>
            </div>

            {/* SKU Field */}
            <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faBarcode}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-900">
                        SKU (Código) *
                    </h3>
                </div>
                <div className="ml-13">
                    <div className="flex items-center space-x-3">

                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-mono"
                            placeholder="Ej: PROD-ABC-123"
                            required
                        />
                        <button
                            type="button"
                            onClick={generateSKU}
                            className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors whitespace-nowrap"
                            disabled={!formData.name}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-sm mr-2" />
                            Generar
                        </button>
                    </div>
                    <p className="text-yellow-600 text-sm mt-2">
                        Código único para identificar el producto
                    </p>
                </div>
            </div>

            {/* Price Fields */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Cost Price */}
                <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faDollarSign}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-red-900">
                            Precio de Costo *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            id="cost_price"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="0.00"
                            required
                        />
                        <p className="text-red-600 text-sm mt-2">
                            Precio al que compras el producto
                        </p>
                    </div>
                </div>

                {/* Selling Price */}
                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faDollarSign}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-green-900">
                            Precio de Venta *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            id="selling_price"
                            name="selling_price"
                            value={formData.selling_price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="0.00"
                            required
                        />
                        <p className="text-green-600 text-sm mt-2">
                            Precio al que vendes el producto
                        </p>
                    </div>
                </div>
            </div>

            {/* Stock Fields */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Stock Quantity */}
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faWarehouse}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900">
                            Cantidad en Stock *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <input
                            type="number"
                            min="0"
                            id="stock_quantity"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="0"
                            required
                        />
                        <p className="text-blue-600 text-sm mt-2">
                            Cantidad actual disponible en inventario
                        </p>
                    </div>
                </div>

                {/* Minimum Stock Level */}
                <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-orange-900">
                            Stock Mínimo *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <input
                            type="number"
                            min="0"
                            id="min_stock_level"
                            name="min_stock_level"
                            value={formData.min_stock_level}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="0"
                            required
                        />
                        <p className="text-orange-600 text-sm mt-2">
                            Nivel mínimo para recibir alertas de reposición
                        </p>
                    </div>
                </div>
            </div>



            {/* Required Fields Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-700">
                    <span className="text-red-500 font-bold">*</span>
                    <span className="font-medium ml-1">Campos requeridos</span> -
                    Todos los campos marcados son obligatorios para guardar los cambios.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    disabled={isSubmitting}
                >
                    <FontAwesomeIcon icon={faTimes} className="text-sm mr-2" />
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors font-medium"
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        className={`text-sm mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
                    />
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
};