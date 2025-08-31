'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function QuickActions({ id, type, color } : {id: number, type: string, color: string}) {
    const router = useRouter();

    const handleView = () => {
        router.push(`/admin/${type}/${id}`);
    };

    const handleEdit = () => {
        router.push(`/admin/${type}/${id}/edit`);
    };

    return (
        <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                    Acciones Rápidas
                </h4>
                <div className="flex space-x-2">
                    {/* View Button */}
                    <button
                        onClick={handleView}
                        className={`inline-flex items-center px-3 py-2 border border-${color}-200 text-${color}-700 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition-colors text-sm font-medium`}
                    >
                        <FontAwesomeIcon icon={faEye} className="text-xs mr-2" />
                        Ver
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={handleEdit}
                        className={`inline-flex items-center px-3 py-2 bg-${color}-500 hover:bg-${color}-700 text-white rounded-lg transition-colors text-sm font-medium`}
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-xs mr-2" />
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};