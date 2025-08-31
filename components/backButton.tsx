'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function BackButton({ href }: { href: string}) {
    const router = useRouter();

    const handleBack = () => {
        router.push(href);
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium"
        >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm mr-2" />
            Volver
        </button>
    );
};
