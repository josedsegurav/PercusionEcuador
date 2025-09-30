import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faUserTag,
    faEnvelope,
    faPhone,
    faUserShield,
    faEdit,
    faCalendar,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import EditButton from '@/components/editButton';
import { createClient } from '@/lib/supabase/server';



export default async function UserViewPage({ params, }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data: user } = await supabase.from("users").select("*").eq("id", id).single()

    // Role display helper
    const getRoleDisplayName = (role: string) => {
        const roleMap: Record<string, string> = {
            'admin': 'Administrador',
            'user': 'Usuario',
        };
        return roleMap[role] || role;
    };

    const getRoleColor = (role: string) => {
        const colorMap: Record<string, string> = {
            'admin': 'bg-red-100 text-red-800 border-red-200',
            'user': 'bg-blue-100 text-blue-800 border-blue-200',
        };
        return colorMap[role] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Usuarios"
                title={`Usuario: ${user.first_name} ${user.last_name}`}
                description="Vista detallada del usuario seleccionado"
                count={user.id}
                countDescription="ID de Usuario"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href="/admin?tab=users" />
                    <EditButton href={`/admin/users/${user.id}/edit`} color="orange" />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-white text-2xl"
                                />
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-blue-200 text-sm font-medium">
                                        ID: #{user.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    {user.first_name} {user.last_name}
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Vista detallada de usuario
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="space-y-8">
                            {/* User ID */}
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
                                        #{user.id}
                                    </p>
                                    <p className="text-blue-600 text-sm mt-1">
                                        ID único del usuario
                                    </p>
                                </div>
                            </div>

                            {/* User Name */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="bg-purple-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-purple-900">
                                            Nombre
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-xl font-semibold text-purple-800">
                                            {user.first_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="bg-indigo-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faUserTag}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-indigo-900">
                                            Apellido
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-xl font-semibold text-indigo-800">
                                            {user.last_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="bg-green-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-900">
                                            Correo Electrónico
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-green-800 break-all">
                                            {user.email}
                                        </p>
                                        <p className="text-green-600 text-sm mt-1">
                                            Email de contacto principal
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="bg-teal-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-teal-900">
                                            Teléfono
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-teal-800">
                                            {user.phone}
                                        </p>
                                        <p className="text-teal-600 text-sm mt-1">
                                            Número de contacto
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="bg-amber-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faUserShield}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-amber-900">
                                        Rol del Usuario
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <div className="flex items-center space-x-3">
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                                            {getRoleDisplayName(user.role)}
                                        </span>
                                    </div>
                                    <p className="text-amber-600 text-sm mt-2">
                                        Determina los permisos y accesos del usuario
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
                                            Fecha de Registro
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-green-800">
                                            {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-green-600 text-sm mt-1">
                                            {new Date(user.created_at).toLocaleTimeString('es-ES', {
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
                                            {new Date(user.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-orange-600 text-sm mt-1">
                                            {new Date(user.updated_at).toLocaleTimeString('es-ES', {
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