"use client"
import { User } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faTimes,
    faHashtag,
    faUser,
    faUserTag,
    faEnvelope,
    faPhone,
    faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { createClient } from "@/lib/supabase/client";


export default function UserEditForm({ user, form }: { user: User | null, form: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [formData, setFormData] = useState({
        first_name: user ? user.first_name : '',
        last_name: user ? user.last_name : '',
        email: user ? user.email : '',
        phone: user ? user.phone : '',
        role: user ? user.role : ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (user && form == "edit") {
            const { error } = await supabase.from("users").update({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role
            }).eq("id", user.id)

            if (error) {
                console.log(error)
            } else {
                setIsSubmitting(false);
                // Redirect back to view page
                router.push(`/admin/users/${user.id}`);
                router.refresh(); // Refresh the server component
            }
        } else if (form == "add") {
            const { error } = await supabase.from("users").insert({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role
            })

            if (error) {
                console.log(error)
            } else {
                setIsSubmitting(false);
                // Redirect back to view page
                router.push('/admin/categories/?tab=users');
                router.refresh(); // Refresh the server component
            }
        }
    };

    const handleCancel = () => {
        if (user && form == 'edit') {
            router.push(`/admin/users/${user.id}`);
        } else if (form == 'add') {
            router.push('/admin/categories/?tab=users');
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Non-editable ID Display */}
            {user ? (
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
                        #{user.id}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        El ID no puede ser modificado
                    </p>
                </div>
            </div>
            ) : ''}


            {/* First Name Field */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faUser}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                        Nombre *
                    </h3>
                </div>
                <div className="ml-13">
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium"
                        placeholder="Ingresa el nombre del usuario"
                        required
                    />
                    <p className="text-blue-600 text-sm mt-2">
                        Nombre de pila del usuario
                    </p>
                </div>
            </div>

            {/* Last Name Field */}
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faUserTag}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-purple-900">
                        Apellido *
                    </h3>
                </div>
                <div className="ml-13">
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg font-medium"
                        placeholder="Ingresa el apellido del usuario"
                        required
                    />
                    <p className="text-purple-600 text-sm mt-2">
                        Apellido familiar del usuario
                    </p>
                </div>
            </div>

            {/* Email Field */}
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900">
                        Correo Electrónico *
                    </h3>
                </div>
                <div className="ml-13">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg font-medium"
                        placeholder="usuario@ejemplo.com"
                        required
                    />
                    <p className="text-green-600 text-sm mt-2">
                        Dirección de correo electrónico para notificaciones
                    </p>
                </div>
            </div>

            {/* Phone Field */}
            <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faPhone}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-900">
                        Teléfono *
                    </h3>
                </div>
                <div className="ml-13">
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg font-medium"
                        placeholder="+1 (555) 123-4567"
                        required
                    />
                    <p className="text-indigo-600 text-sm mt-2">
                        Número de teléfono de contacto
                    </p>
                </div>
            </div>

            {/* Role Field */}
            <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faUserShield}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900">
                        Rol del Usuario *
                    </h3>
                </div>
                <div className="ml-13">
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg font-medium"
                        required
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                    </select>
                    <p className="text-amber-600 text-sm mt-2">
                        Rol que determina los permisos del usuario en el sistema
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
