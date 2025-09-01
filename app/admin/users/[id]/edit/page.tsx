import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTags,
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import UserEditForm from '@/components/userEditForm';
import { createClient } from '@/lib/supabase/server';


export default async function userEditPage({ params, }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data: user } = await supabase.from("users").select("*").eq("id", id).single()


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Usuarios"
                title={`Editar: ${user.email}`}
                description="Modifica los datos del usuario seleccionado"
                count={user.id}
                countDescription="ID de usuario"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href={`/admin/users/${user.id}`} />
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Editando ID:</span> #{user.id}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-8 py-6">
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
                                        Editando ID: #{user.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Editar usuario
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Modifica la información del usuario
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <UserEditForm form='edit' user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};