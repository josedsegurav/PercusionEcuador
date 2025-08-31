import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTags,
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import CategoryEditForm from '@/components/categoryEditForm';
import { createClient } from '@/lib/supabase/server';

// Mock data - replace with real data fetching


export default async function CategoryEditPage({ params, }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data: category } = await supabase.from("categories").select("*").eq("id", id).single()


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Categorías"
                title={`Editar: ${category.name}`}
                description="Modifica los datos de la categoría seleccionada"
                count={category.id}
                countDescription="ID de Categoría"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href={`/admin/categories/${category.id}`} />
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Editando ID:</span> #{category.id}
                    </div>
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
                                        Editando ID: #{category.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Editar Categoría
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Modifica la información de la categoría
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <CategoryEditForm category={category} />
                    </div>
                </div>
            </div>
        </div>
    );
};