import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import UserEditForm from '@/components/userEditForm';


export default async function UserAddPage() {

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Usuarios"
                title="Agregar Nueva Usuario"
                description="Crea un nuevo usuario"
                count="+"
                countDescription="Nuevo usuario"
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href="/admin?tab=users" />
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Creando:</span> Nuevo usuario
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-8 py-6">
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
                                    Nuevo usuario
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Agregar usuario
                                </h1>
                                <p className="text-emerald-100 text-sm mt-1">
                                    Completa la información para crear un nuevo usuario
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <UserEditForm
                            form='add'
                            user={null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};