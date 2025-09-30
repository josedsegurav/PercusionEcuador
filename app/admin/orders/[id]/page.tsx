import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTags,
    faEdit,
    faCalendar,
    faFileText,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import EditButton from '@/components/editButton';
import { createClient } from '@/lib/supabase/server';



export default async function CategoryViewPage({ params, }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data: category } = await supabase.from("categories").select("*").eq("id", id).single()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Categorías"
                title={`Categoría: ${category.name}`}
                description="Vista detallada de la categoría seleccionada"
                count={category.id}
                countDescription="ID de Categoría"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href="/admin?tab=categories" />
                    <EditButton href={`/admin/categories/${category.id}/edit`} color="blue" />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faTags}
                                    className="text-white text-2xl"
                                />
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-blue-200 text-sm font-medium">
                                        ID: #{category.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    {category.name}
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Vista detallada de categoría
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="space-y-8">
                            {/* Category ID */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faHashtag}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-900">
                                        Identificador
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-2xl font-bold text-blue-800">
                                        #{category.id}
                                    </p>
                                    <p className="text-blue-600 text-sm mt-1">
                                        ID único de la categoría
                                    </p>
                                </div>
                            </div>

                            {/* Category Name */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faTags}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Nombre de la Categoría
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-xl font-semibold text-gray-800">
                                        {category.name}
                                    </p>
                                </div>
                            </div>

                            {/* Category Description */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mt-1">
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
                                        {category.description}
                                    </p>
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
                                            {new Date(category.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-green-600 text-sm mt-1">
                                            {new Date(category.created_at).toLocaleTimeString('es-ES', {
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
                                            {new Date(category.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-orange-600 text-sm mt-1">
                                            {new Date(category.updated_at).toLocaleTimeString('es-ES', {
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
