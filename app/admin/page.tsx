import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faTags,
    faBoxOpen,
    faShoppingCart,
    faUsers
} from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';
import Header from '@/components/header';
import AdminTabNavigation from '@/components/adminTabNavigation';
import AdminStatsCards from '@/components/adminStatsCards';
import { createClient } from '@/lib/supabase/server';
import AdminItemTab from '@/components/adminItemTab';
import { adminCard, Category, Order, Product, User } from '../utils/types';
import Link from 'next/link';

interface Params {
    tab: string
}

// Loading spinner component
const TabLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 text-sm">Cargando datos...</p>
    </div>
);

// Stats loading skeleton
const StatsLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        ))}
    </div>
);

// Async component for tab data
const AdminTabContent = async ({ activeTab, supabase }: { activeTab: string, supabase: Awaited<ReturnType<typeof createClient>> }) => {
    const { data: categories } = await supabase.from("categories").select("*");
    const { data: products } = await supabase.from("products").select("*");
    const { data: orders } = await supabase.from("orders").select("*");
    const { data: users } = await supabase.from("users").select("*");

    const stats = {
        totalCategories: categories?.length || 0,
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalUsers: users?.length || 0
    };

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
            categories: categories?.map((category: Category) => ({
                id: category.id,
                tab_title: category.name,
                tab_description: category.description || ''
            })) || [],
            products: products?.map((product: Product) => ({
                id: product.id,
                tab_title: product.name,
                tab_description: product.description || ''
            })) || [],
            orders: orders?.map((order: Order) => ({
                id: order.id,
                tab_title: `${order.order_number} ${order.customer_name || 'N/A'}`,
                tab_description: `${order.created_at} ${order.payment_status}`
            })) || [],
            users: users?.map((user: User) => ({
                id: user.id,
                tab_title: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                tab_description: `${user.email} | ${user.role}`
            })) || []
        };
        return data[tab] || [];
    }

    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

    return (
        <>
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

                {/* Tab Content with Loading State */}
                <Suspense fallback={<TabLoadingSpinner />}>
                    <AdminItemTab
                        items={getTabData(activeTab)}
                        type={activeTab}
                        activeTabData={activeTabData}
                    />
                </Suspense>
            </div>
        </>
    );
};

const AdminDashboard = async ({ searchParams }: { searchParams: Promise<Params> }) => {
    const params = await searchParams;
    const activeTab = params?.tab || 'categories';
    const supabase = await createClient();

    // Handle authentication and authorization
    const { data: loggedUser } = await supabase.auth.getUser();

    if (!loggedUser?.user?.email) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Acceso no autorizado
                </h3>
                <Link href='/' className="text-blue-600 hover:text-blue-800">
                    Regresar al inicio
                </Link>
            </div>
        );
    }

    const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", loggedUser.user.email)
        .single() as unknown as { data: User, error: string };

    if (error) {
        console.error("Error fetching user data:", error);
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h3 className="text-lg font-medium text-red-600 mb-2">
                    Error al cargar datos del usuario
                </h3>
                <Link href='/' className="text-blue-600 hover:text-blue-800">
                    Regresar al inicio
                </Link>
            </div>
        );
    }

    if (userData?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faUsers} className="text-red-600 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Acceso Restringido
                    </h3>
                    <p className="text-gray-600 mb-4">
                        No tienes permisos de administrador para acceder a esta página.
                    </p>
                    <Link
                        href='/'
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Regresar al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Administración"
                title="Panel de Administración"
                description="Gestiona categorías, productos, pedidos y usuarios."
                count={0} // We'll update this dynamically
                countDescription="Pedidos Totales"
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Main content with loading states */}
                <Suspense fallback={<StatsLoadingSkeleton />}>
                    <AdminTabContent activeTab={activeTab} supabase={supabase} />
                </Suspense>
            </div>
        </div>
    );
};

export default AdminDashboard;