import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import CategoryCard from './categoryCard';
import ProductCardAdmin from './productCardAdmin';
import OrderCard from './orderCard';
import UserCard from './userCard';
import { adminCard } from '@/app/utils/types';

export default function AdminItemTab({ items, type } : { items: Array<adminCard>, type: string}) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(renderCard)}
        </div>
    );
};