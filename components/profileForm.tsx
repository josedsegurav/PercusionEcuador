"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@/app/utils/types";

export default function ProfileForm({ userData }: { userData: User }) {
    const [formData, setFormData] = useState<{
        first_name: string,
        last_name: string,
        email: string,
        phone: string
    }>({
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        phone: userData?.phone || ''
    });

    const supabase = createClient();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: {
            first_name: string,
            last_name: string,
            email: string,
            phone: string
        }) => ({
            ...prev,
            [name]: value
        }));
    };

    console.log(formData);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Call your update function here
        const { error } = await supabase.from("users").update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone
        }).eq("email", userData.email);

        if (error) {
            console.error(error);
        } else {
            router.refresh();
        }
    };

    return (
        <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Ingresa tu nombre"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Ingresa tu apellido"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="tu.email@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="+1 234 567 8900"
                        />
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        className="bg-percussion hover:bg-percussion/80 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        <span>Guardar Cambios</span>
                    </button>

                </div>
            </form>
        </div>
    );
}