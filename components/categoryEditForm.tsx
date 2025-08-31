'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faTimes,
    faTags,
    faFileText,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/app/utils/types';
import { createClient } from '@/lib/supabase/client';

export default function CategoryEditForm({ category }: { category: Category }) {
    const router = useRouter();
    const supabase = createClient();
    const [formData, setFormData] = useState({
        name: category.name || '',
        description: category.description || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    console.log(category.id)
    console.log(formData.name)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Replace with your actual API call
        const { error } = await supabase.from("categories").update({
            name: formData.name,
            description: formData.description
        }).eq("id", category.id)

        if (error) {
            console.log(error)
        } else {
            setIsSubmitting(false);
            // Redirect back to view page
            router.push(`/admin/categories/${category.id}`);
            router.refresh(); // Refresh the server component

        }
    };

    const handleCancel = () => {
        router.push(`/admin/categories/${category.id}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Non-editable ID Display */}
            <div className="bg-gray-100 rounded-lg p-6 border-l-4 border-gray-400">
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
                        #{category.id}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        El ID no puede ser modificado
                    </p>
                </div>
            </div>

            {/* Name Field */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faTags}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                        Nombre de la Categoría *
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
                        placeholder="Ingresa el nombre de la categoría"
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
                        placeholder="Describe detalladamente esta categoría..."
                        required
                    />
                    <p className="text-gray-600 text-sm mt-2">
                        Descripción que aparecerá en las páginas de productos
                    </p>
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
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
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