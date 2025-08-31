import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import ProductEditForm from '@/components/productEditForm';
import { createClient } from '@/lib/supabase/server';


export default async function ProductAddPage() {

    const supabase = await createClient();

    const { data: categories } = await supabase.from("categories").select("*");
    const { data: vendors } = await supabase.from("vendors").select("*");


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Productos"
                title="Agregar Nuevo Producto"
                description="Crea un nuevo producto para tu inventario"
                count="+"
                countDescription="Nuevo Producto"
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href="/admin?tab=products" />
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Creando:</span> Nuevo Producto
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="text-white text-2xl"
                                />
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-emerald-200 text-sm font-medium">
                                        Nuevo Producto
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Agregar Producto
                                </h1>
                                <p className="text-emerald-100 text-sm mt-1">
                                    Completa la información para crear un nuevo producto
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <ProductEditForm
                            form='add'
                            product={null}
                            categories={categories || []}
                            vendors={vendors || []}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};