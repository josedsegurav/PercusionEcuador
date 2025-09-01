import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faBoxOpen, faShoppingCart, faUsers, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

interface Stat {
    totalCategories: number | undefined,
    totalProducts: number | undefined,
    totalOrders: number | undefined,
    totalUsers: number | undefined
}

const AdminStatsCards = ({ stats }: { stats: Stat }) => {
    const statsData = [
        {
            title: 'Categorías',
            value: stats.totalCategories,
            icon: faTags,
            color: 'blue',
            change: '+12%',
            changeType: 'positive',
            description: 'Categorías activas'
        },
        {
            title: 'Productos',
            value: stats.totalProducts,
            icon: faBoxOpen,
            color: 'green',
            change: '+8%',
            changeType: 'positive',
            description: 'Productos disponibles'
        },
        {
            title: 'Pedidos',
            value: stats.totalOrders,
            icon: faShoppingCart,
            color: 'purple',
            change: '-3%',
            changeType: 'negative',
            description: 'Pedidos este mes'
        },
        {
            title: 'Usuarios',
            value: stats.totalUsers,
            icon: faUsers,
            color: 'orange',
            change: '+15%',
            changeType: 'positive',
            description: 'Usuarios registrados'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                                    <FontAwesomeIcon
                                        icon={stat.icon}
                                        className={`text-${stat.color}-600 text-xl`}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {stat.description}
                            </p>
                            <div className={`flex items-center space-x-1 text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <FontAwesomeIcon
                                    icon={stat.changeType === 'positive' ? faArrowUp : faArrowDown}
                                    className="text-xs"
                                />
                                <span>{stat.change}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom accent bar */}
                    <div className={`h-1 bg-${stat.color}-500`}></div>
                </div>
            ))}
        </div>
    );
};

export default AdminStatsCards;