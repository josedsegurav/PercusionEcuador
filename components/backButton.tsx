'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BackButton({ href }: { href: string}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleBack = () => {
        setIsLoading(true);
        router.push(href);

    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium"
            disabled={isLoading}
        >
            {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin`} /> : <FontAwesomeIcon icon={faArrowLeft} className="text-sm mr-2" />}
            Volver
        </button>
    );
};
