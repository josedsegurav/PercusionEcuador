import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faCreditCard,
    faMoneyBillWave,
    faInfoCircle,
    faTruck,
    faReceipt,
    faCalendar,
    faEdit,
    faBox
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import EditButton from '@/components/editButton';
import { createClient } from '@/lib/supabase/server';
import { OrderItems } from '@/app/utils/types';

export default async function OrderViewPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data: order } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                id,
                order_id,
                product_id,
                quantity,
                unit_price,
                products (*)
            )
        `)
        .eq("id", id)
        .single();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'pending': 'yellow',
            'processing': 'blue',
            'completed': 'green',
            'cancelled': 'red',
            'shipped': 'purple'
        };
        return colors[status.toLowerCase()] || 'gray';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'paid': 'green',
            'pending': 'yellow',
            'failed': 'red',
            'refunded': 'orange'
        };
        return colors[status.toLowerCase()] || 'gray';
    };

    const statusColor = getStatusColor(order.status);
    const paymentColor = getPaymentStatusColor(order.payment_status);

    const getTotalAmount = (tax: number, subtotal: number) => {
        const total_amount = tax  + subtotal;
        return total_amount;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Órdenes"
                title={`Orden #${order.order_number}`}
                description="Vista detallada de la orden seleccionada"
                count={order.order_number}
                countDescription="Número de Orden"
            />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href="/admin?tab=orders" />
                    <EditButton href={`/admin/orders/${order.id}/edit`} color="purple" />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faShoppingCart}
                                    className="text-white text-2xl"
                                />
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-blue-200 text-sm font-medium">
                                        ID: #{order.id}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Orden #{order.order_number}
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Vista detallada de orden
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="space-y-8">
                            {/* Order Status */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`bg-${statusColor}-50 rounded-lg p-6`}>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`w-10 h-10 bg-${statusColor}-500 rounded-lg flex items-center justify-center`}>
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className={`text-lg font-semibold text-${statusColor}-900`}>
                                            Estado de Orden
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className={`text-xl font-bold text-${statusColor}-800 uppercase`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>

                                <div className={`bg-${paymentColor}-50 rounded-lg p-6`}>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`w-10 h-10 bg-${paymentColor}-500 rounded-lg flex items-center justify-center`}>
                                            <FontAwesomeIcon
                                                icon={faMoneyBillWave}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className={`text-lg font-semibold text-${paymentColor}-900`}>
                                            Estado de Pago
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className={`text-xl font-bold text-${paymentColor}-800 uppercase`}>
                                            {order.payment_status}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-600" />
                                    Información del Cliente
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Nombre</p>
                                        <p className="text-gray-900 font-semibold">{order.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                            Email
                                        </p>
                                        <p className="text-gray-900">{order.customer_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                            Teléfono
                                        </p>
                                        <p className="text-gray-900">{order.customer_phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faTruck}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-900">
                                            Dirección de Envío
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-blue-800">{order.shipping_address}</p>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faMapMarkerAlt}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-purple-900">
                                            Dirección de Facturación
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-purple-800">{order.billing_address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faCreditCard}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Método de Pago
                                    </h3>
                                </div>
                                <div className="ml-13">
                                    <p className="text-xl font-semibold text-gray-800 uppercase">
                                        {order.payment_method}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faBox}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Productos
                                    </h3>
                                </div>
                                <div className="ml-13 space-y-3">
                                    {order.order_items.map((item: OrderItems) => (
                                        <div key={item.id} className="bg-white rounded-lg p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {item.products.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Cantidad: {item.quantity} × ${item.unit_price.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">
                                                ${(item.quantity * item.unit_price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-green-50 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faReceipt}
                                            className="text-white text-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900">
                                        Resumen de Orden
                                    </h3>
                                </div>
                                <div className="ml-13 space-y-3">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    {/* <div className="flex justify-between text-gray-700">
                                        <span>Costo de Envío:</span>
                                        <span className="font-semibold">${order.shipping_cost.toFixed(2)}</span>
                                    </div> */}
                                    <div className="flex justify-between text-gray-700">
                                        <span>Impuestos:</span>
                                        <span className="font-semibold">${order.tax_amount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t-2 border-green-200 pt-3 flex justify-between text-green-900">
                                        <span className="text-xl font-bold">Total:</span>
                                        <span className="text-2xl font-bold">${getTotalAmount(order.tax_amount, order.subtotal).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="bg-yellow-50 rounded-lg p-6">
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mt-1">
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-yellow-900">
                                            Notas
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-yellow-800 leading-relaxed">
                                            {order.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Created At */}
                                <div className="bg-green-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-900">
                                            Fecha de Creación
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-green-800">
                                            {new Date(order.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-green-600 text-sm mt-1">
                                            {new Date(order.created_at).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Updated At */}
                                <div className="bg-orange-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="text-white text-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-orange-900">
                                            Última Modificación
                                        </h3>
                                    </div>
                                    <div className="ml-13">
                                        <p className="text-lg font-semibold text-orange-800">
                                            {new Date(order.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-orange-600 text-sm mt-1">
                                            {new Date(order.updated_at).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}