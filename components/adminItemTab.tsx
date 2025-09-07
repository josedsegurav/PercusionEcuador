"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxOpen, faPlus,
    faSearch,
    faChartLine,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import CategoryCard from './categoryCard';
import ProductCardAdmin from './productCardAdmin';
import OrderCard from './orderCard';
import UserCard from './userCard';
import { adminCard, tabData } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Skeleton loading component for individual cards
const CardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

// Search loading overlay
const SearchLoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
        <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Buscando...</span>
        </div>
    </div>
);

export default function AdminItemTab({ items, type, activeTabData }: { items: Array<adminCard>, type: string, activeTabData: tabData }) {
    const [filters, setFilters] = useState<{ search: string | null }>({ search: null });
    const [itemsList, setItemsList] = useState<adminCard[]>();
    const [filteredItems, setFilteredItems] = useState<adminCard[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Simulate initial loading
        setIsInitialLoading(true);

        const timer = setTimeout(() => {
            setItemsList(items);
            setFilteredItems(items);
            setIsInitialLoading(false);
        }, 300); // Brief delay to show skeleton

        return () => clearTimeout(timer);
    }, [items]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        // Show search loading
        setIsSearching(true);

        // Simulate search delay for better UX
        setTimeout(() => {
            let result = itemsList;

            if (newFilters.search !== null && newFilters.search !== '') {
                result = result?.filter((item) =>
                    item.tab_title.toLowerCase().includes(newFilters.search?.toLowerCase() ?? "")
                );
            }

            setFilteredItems(result);
            setIsSearching(false);
        }, 200); // Brief delay to show search loading
    }

    const handleAdd = () => {
        setIsLoading(true);
        router.push(`/admin/${activeTabData.id}/add`);
    }

    const renderCard = (item: adminCard) => {
        switch (type) {
            case 'categories':
                return <CategoryCard key={item.id} category={item} />;
            case 'products':
                return <ProductCardAdmin key={item.id} product={item} />;
            case 'orders':
                return <OrderCard key={item.id} order={item} />;
            case 'users':
                return <UserCard key={item.id} user={item} />;
            default:
                return null;
        }
    };

    // Show initial loading skeletons
    if (isInitialLoading) {
        return (
            <>
                {/* Tab Content Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-gray-200 rounded-lg animate-pulse`}></div>
                            <div>
                                <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Skeletons */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    // Empty state
    if (!items || items.length === 0) {
        return (
            <>
                {/* Tab Content Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-${activeTabData?.color}-100 rounded-lg flex items-center justify-center`}>
                                <FontAwesomeIcon
                                    icon={activeTabData?.icon ?? faChartLine}
                                    className={`text-${activeTabData?.color}-600 text-sm`}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {activeTabData?.label}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    0 {activeTabData?.label.toLowerCase()} en total
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button onClick={handleAdd} disabled={isLoading} className={`px-4 py-2 bg-${activeTabData?.color}-500 hover:bg-${activeTabData?.color}-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium`}>
                                {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin`} /> : <FontAwesomeIcon icon={faPlus} className="text-sm" />}
                                <span>Añadir {activeTabData?.label.slice(0, -1)}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-gray-400 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay elementos disponibles
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Aún no se han agregado {type} al sistema.
                    </p>
                    <button onClick={handleAdd} disabled={isLoading} className={`px-4 py-2 bg-${activeTabData?.color}-500 hover:bg-${activeTabData?.color}-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium mx-auto`}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin`} /> : <FontAwesomeIcon icon={faPlus} className="text-sm" />}
                        <span>Añadir {activeTabData?.label.slice(0, -1)}</span>
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Tab Content Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-${activeTabData?.color}-100 rounded-lg flex items-center justify-center`}>
                            <FontAwesomeIcon
                                icon={activeTabData?.icon ?? faChartLine}
                                className={`text-${activeTabData?.color}-600 text-sm`}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {activeTabData?.label}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {filteredItems?.length || 0} de {activeTabData?.count} {activeTabData?.label.toLowerCase()}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                placeholder={`Buscar ${activeTabData?.label.toLowerCase()}...`}
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                onChange={handleSearch}
                            />
                            <FontAwesomeIcon
                                icon={isSearching ? faSpinner : faSearch}
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isSearching ? 'animate-spin' : ''}`}
                            />
                        </div>

                        {/* Add New Button */}
                        <button onClick={handleAdd} disabled={isLoading} className={`px-4 py-2 bg-${activeTabData?.color}-500 hover:bg-${activeTabData?.color}-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium disabled:opacity-50`}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin`} /> : <FontAwesomeIcon icon={faPlus} className="text-sm" />}
                            <span>Añadir {activeTabData?.label.slice(0, -1)}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="p-6 relative">
                {/* Search Loading Overlay */}
                {isSearching && <SearchLoadingOverlay />}

                {/* No Search Results */}
                {filteredItems?.length === 0 && filters.search && !isSearching && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron resultados
                        </h3>
                        <p className="text-gray-500 mb-4">
                            No hay {activeTabData?.label.toLowerCase()} que coincidan con &ldquo;{filters.search}&ldquo;
                        </p>
                        <button
                            onClick={() => {
                                setFilters({ search: null });
                                setFilteredItems(itemsList);
                                // Clear the input
                                const searchInput = document.querySelector('input[name="search"]') as HTMLInputElement;
                                if (searchInput) searchInput.value = '';
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                )}

                {/* Items Grid */}
                {filteredItems && filteredItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="animate-fadeInUp"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {renderCard(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add CSS for fade-in animation */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out;
                }
            `}</style>
        </>
    );
}