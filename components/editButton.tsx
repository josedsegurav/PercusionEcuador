'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function EditButton({ href, color = "blue" } : { href: string, color: string}) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(href);
    };

    return (
        <button
            onClick={handleEdit}
            className={`inline-flex items-center px-4 py-2 bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg transition-colors font-medium`}
        >
            <FontAwesomeIcon icon={faEdit} className="text-sm mr-2" />
            Editar
        </button>
    );
};