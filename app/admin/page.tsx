import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faTags,
    faBoxOpen,
    faShoppingCart,
    faUsers,
    faPlus,
    faFilter,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import AdminTabNavigation from '@/components/adminTabNavigation';
import AdminStatsCards from '@/components/adminStatsCards';
import { createClient } from '@/lib/supabase/server';
import AdminItemTab from '@/components/adminItemTab';
import { adminCard } from '../utils/types';

interface Params {
    tab: string
}


const AdminDashboard = async ({ searchParams }: { searchParams: Promise<Params> }) => {
    const params = await searchParams;
    const activeTab = params?.tab || 'categories';
    const supabase = await createClient();
    const { data: categories } = await supabase.from("categories").select('*');
    const { data: products } = await supabase.from("products").select("*");
    const { data: orders } = await supabase.from("orders").select("*");
    const { data: users } = await supabase.from("users").select("*");

    function getAdminStats() {
        return {
            totalCategories: categories?.length,
            totalProducts: products?.length,
            totalOrders: orders?.length,
            totalUsers: users?.length
        };
    }

    const stats = getAdminStats()

    const tabs = [
        {
            id: 'categories',
            label: 'Categorías',
            icon: faTags,
            count: stats.totalCategories,
            color: 'blue'
        },
        {
            id: 'products',
            label: 'Productos',
            icon: faBoxOpen,
            count: stats.totalProducts,
            color: 'green'
        },
        {
            id: 'orders',
            label: 'Pedidos',
            icon: faShoppingCart,
            count: stats.totalOrders,
            color: 'purple'
        },
        {
            id: 'users',
            label: 'Usuarios',
            icon: faUsers,
            count: stats.totalUsers,
            color: 'orange'
        }
    ];

    function getTabData(tab: string) {
        const data: Record<string, adminCard[]> = {
            categories: categories?.map((category) => ({
                id: category.id,
                tab_title: category.name,
                tab_description: category.description
            })) || [],
            products: products?.map((product) => ({
                id: product.id,
                tab_title: product.name,
                tab_description: product.description
            })) || [],
            orders: orders?.map((order) => ({
                id: order.id,
                tab_title: order.number + ' ' + order.customer.name,
                tab_description: order.created_at + ' ' + order.payment_status
            })) || [],
            users: users?.map((user) => ({
                id: user.id,
                tab_title: user.first_name + ' ' + user.last_name,
                tab_description: user.email + ' | ' + user.role
            })) || []
        }
        return data[tab] || [];
    }


    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Administración"
                title="Panel de Administración"
                description="Gestiona categorías, productos, pedidos y usuarios."
                count={stats.totalOrders}
                countDescription="Pedidos Totales"
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <AdminStatsCards stats={stats} />

                {/* Main Dashboard Content */}
                <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={faChartLine}
                                        className="text-white text-lg"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Dashboard de Control
                                    </h2>
                                    <p className="text-gray-300 text-sm">
                                        Administra todo tu negocio desde aquí
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <AdminTabNavigation tabs={tabs} activeTab={activeTab} />

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
                                        placeholder={`Buscar ${activeTabData?.label.toLowerCase()}...`}
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                </div>

                                {/* Filter Button */}
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faFilter} className="text-sm" />
                                    <span>Filtrar</span>
                                </button>

                                {/* Add New Button */}
                                <button className={`px-4 py-2 bg-${activeTabData?.color}-600 hover:bg-${activeTabData?.color}-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium`}>
                                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                                    <span>Añadir {activeTabData?.label.slice(0, -1)}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content Area */}
                    <div className="p-6">
                        <AdminItemTab items={getTabData(activeTab)} type={activeTab} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;