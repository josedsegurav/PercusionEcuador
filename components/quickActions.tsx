'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuickActions({ id, type, color } : {id: number, type: string, color: string}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleView = () => {
        setIsLoading(true);
        router.push(`/admin/${type}/${id}`);

    };

    const handleEdit = () => {
        setIsLoading(true);
        router.push(`/admin/${type}/${id}/edit`);

    };

    return (
        <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                    Acciones Rápidas
                </h4>
                {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin animate-spin`} /> : (<div className="flex space-x-2">
                    {/* View Button */}
                    <button
                        onClick={handleView}
                        disabled={isLoading}
                        className={`inline-flex items-center px-3 py-2 border border-${color}-200 text-${color}-700 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition-colors text-sm font-medium`}
                    >
                        <FontAwesomeIcon icon={faEye} className={`text-xs mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Ver
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={handleEdit}
                        disabled={isLoading}
                        className={`inline-flex items-center px-3 py-2 bg-${color}-500 hover:bg-${color}-700 text-white rounded-lg transition-colors text-sm font-medium`}
                    >
                         <FontAwesomeIcon icon={faEdit} className={`text-xs mr-2`} />
                        Editar
                    </button>
                </div>)}

            </div>
        </div>
    );
};