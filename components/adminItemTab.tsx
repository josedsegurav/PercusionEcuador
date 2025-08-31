"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxOpen, faPlus,
    faSearch,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import CategoryCard from './categoryCard';
import ProductCardAdmin from './productCardAdmin';
import OrderCard from './orderCard';
import UserCard from './userCard';
import { adminCard, tabData } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminItemTab({ items, type, activeTabData }: { items: Array<adminCard>, type: string, activeTabData: tabData }) {
    const [filters, setFilters] = useState<{ search: string | null }>({ search: null });
    const [itemsList, setItemsList] = useState<adminCard[]>();
    const [ filteredItems, setFilteredItems ] = useState<adminCard[]>();

    useEffect(() => {
        setItemsList(items)
        setFilteredItems(items)
    }, [items])

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        console.log(newFilters)

        let result = itemsList;

        if (newFilters.search !== null) {
            result = result?.filter((item) => item.tab_title.toLowerCase().includes(newFilters.search?.toLowerCase() ?? ""));
        }

        console.log(result)

        setFilteredItems(result);
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

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay elementos disponibles
                </h3>
                <p className="text-gray-500">
                    Aún no se han agregado {type} al sistema.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Tab Content Header */}
            < div className="bg-gray-50 px-6 py-4 border-b border-gray-200" >
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
                                {activeTabData?.count} {activeTabData?.label.toLowerCase()} en total
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
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleSearch}
                            />
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        {/* Filter Button */}
                        {/* <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2">
                            <FontAwesomeIcon icon={faFilter} className="text-sm" />
                            <span>Filtrar</span>
                        </button> */}

                        {/* Add New Button */}
                        <Link href={`/admin/${activeTabData.id}/add`} className={`px-4 py-2 bg-${activeTabData?.color}-500 hover:bg-${activeTabData?.color}-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium`}>
                            <FontAwesomeIcon icon={faPlus} className="text-sm" />
                            <span>Añadir {activeTabData?.label.slice(0, -1)}</span>
                        </Link>
                    </div>
                </div>
            </div >
            {/* Tab Content Area */}
            < div className="p-6" >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems?.map(renderCard)}
                </div>
            </div>
        </>
    );
};