'use client';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter, useSearchParams } from 'next/navigation';

interface Tab {
    id: string,
    label: string,
    icon: IconDefinition,
    count: number | undefined,
    color: string
}

const AdminTabNavigation = ({ tabs, activeTab }: { tabs: Array<Tab>, activeTab: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tabId);
        router.push(`/admin?${params.toString()}`);
    };

    return (
        <div className="border-b border-gray-200">
            <nav className="flex flex-wrap justify-evenly md:justify-center" aria-label="Tabs">
                {tabs.map((tab: Tab) => (

                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                            py-4 px-2 border-b-2 font-medium text-sm transition-colors relative
                            ${activeTab === tab.id
                                ? `border-${tab.color}-500 text-${tab.color}-600`
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <div className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={tab.icon} className="text-sm" />
                            <span>{tab.label}</span>
                            <span className={`
                                inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                                ${activeTab === tab.id
                                    ? `bg-${tab.color}-100 text-${tab.color}-800`
                                    : 'bg-gray-100 text-gray-600'
                                }
                            `}>
                                {tab.count}
                            </span>
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AdminTabNavigation;