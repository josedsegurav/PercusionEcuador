'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditButton({ href, color } : { href: string, color: string}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleEdit = () => {
        setIsLoading(true);
        router.push(href);
    };

    return (
        <button
            onClick={handleEdit}
            className={`inline-flex items-center px-4 py-2 bg-${color}-500 hover:bg-${color}-700 text-white rounded-lg transition-colors font-medium`}
        >
            {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin`} /> : <FontAwesomeIcon icon={faEdit} className="text-sm mr-2" />}
            Editar
        </button>
    );
};