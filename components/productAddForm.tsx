'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faTimes,
    faBox,
    faFileText,
    faTags,
    faBuilding,
    faBarcode,
    faDollarSign,
    faWarehouse,
    faExclamationTriangle,
    faImage,
    faUpload,
    faInfoCircle,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductAddForm({ categories, vendors }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        vendor_id: '',
        sku: '',
        cost_price: '',
        selling_price: '',
        stock_quantity: '',
        min_stock_level: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            // Append all form data
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            // Append image if selected
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            const response = await fetch('/api/admin/products', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const result = await response.json();
                // Redirect to the new product view page
                router.push(`/admin/products/${result.id}`);
                router.refresh();
            } else {
                console.error('Failed to create product');
                alert('Error al crear el producto');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error al crear el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin?tab=products');
    };

    // Generate suggested SKU based on name
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Info Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-emerald-500 text-lg mt-0.5"
                    />
                    <div>
                        <p className="text-sm text-emerald-700">
                            <span className="font-medium">Creando nuevo producto</span> -
                            Una vez creado, se asignará automáticamente un ID único y las fechas de creación.
                        </p>
                    </div>
                </div>
            </div>

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
                        {imagePreview ? (
                            <div className="relative inline-block">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-purple-200"
                                    width={500}
                                    height={500}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        ) : (
                            <div className="w-32 h-32 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-purple-50">
                                <div className="text-center">
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        className="text-purple-400 text-2xl mb-2"
                                    />
                                    <p className="text-purple-600 text-sm">
                                        Sin imagen
                                    </p>
                                </div>
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
                        Formatos aceptados: JPG, PNG, GIF (máx. 5MB) - Opcional
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
                        placeholder="Ej: Guitarra Eléctrica Fender Stratocaster"
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
                        placeholder="Describe detalladamente este producto, incluyendo características técnicas, materiales, dimensiones, etc..."
                        required
                    />
                    <p className="text-gray-600 text-sm mt-2">
                        Descripción completa que aparecerá en la página del producto
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
                            className="flex-1 px-4 py-3 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-mono"
                            placeholder="Ej: GUIT-FEND-STRAT-001"
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
                        Código único para identificar el producto. Usa el botón &quot;Generar&quot; para crear uno automático.
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
                            Precio al que compras el producto (sin incluir IVA)
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
                            Precio al que vendes el producto al público
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
                            Cantidad inicial disponible en inventario
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

            {/* Preview Section */}
            {formData.cost_price && formData.selling_price && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-blue-500 text-lg"
                        />
                        <h3 className="text-lg font-semibold text-blue-900">
                            Vista Previa de Precios
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">Precio de Costo</p>
                            <p className="text-lg font-bold text-red-600">
                                ${parseFloat(formData.cost_price || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">Precio de Venta</p>
                            <p className="text-lg font-bold text-green-600">
                                ${parseFloat(formData.selling_price || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">Margen de Ganancia</p>
                            <p className="text-lg font-bold text-blue-600">
                                {formData.cost_price && formData.selling_price ?
                                    (((parseFloat(formData.selling_price) - parseFloat(formData.cost_price)) / parseFloat(formData.selling_price) * 100).toFixed(1)) : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Required Fields Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-700">
                    <span className="text-red-500 font-bold">*</span>
                    <span className="font-medium ml-1">Campos requeridos</span> -
                    Todos los campos marcados son obligatorios para crear el producto.
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
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors font-medium"
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        className={`text-sm mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
                    />
                    {isSubmitting ? 'Creando...' : 'Crear Producto'}
                </button>
            </div>
        </form>
    );
};