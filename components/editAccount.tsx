"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileForm from "./profileForm"
import { faUser, faEnvelope, faPhone, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import { User } from "@/app/utils/types";

export default function EditAccount({ userData }: { userData: User }) {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <>
            {/* Profile Information */}
            {!isEditing ? (
                <div className="px-8 py-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-blue-600 text-lg"
                                />
                                <div>
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <p className="font-semibold text-gray-800">
                                        {userData.first_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-blue-600 text-lg"
                                />
                                <div>
                                    <p className="text-sm text-gray-500">Apellido</p>
                                    <p className="font-semibold text-gray-800">
                                        {userData.last_name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="text-green-600 text-lg"
                                />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-800">
                                        {userData.email || 'No especificado'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    className="text-purple-600 text-lg"
                                />
                                <div>
                                    <p className="text-sm text-gray-500">Teléfono</p>
                                    <p className="font-semibold text-gray-800">
                                        {userData.phone || 'No especificado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-percussion hover:bg-percussion/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mt-4"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Editar</span>
                    </button>
                </div>
            ) : (
                /* Edit Profile Form */
                <>
                    <ProfileForm userData={userData} />
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium ml-8 mb-4"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                        <span>Cancelar</span>
                    </button>
                </>
            )}
        </>
    )
}