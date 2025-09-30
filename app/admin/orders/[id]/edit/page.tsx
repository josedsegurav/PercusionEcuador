import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/header';
import BackButton from '@/components/backButton';
import OrderEditForm from '@/components/orderEditForm';
import { createClient } from '@/lib/supabase/server';
import DeleteButton from '@/components/deleteButton';


export default async function OrderEditPage({ params }: { params: Promise<{ id: string }> }) {
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


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <Header
                currentPage="Órdenes"
                title={`Editar: Orden #${order.order_number}`}
                description="Modifica los datos de la orden seleccionada"
                count={order.order_number}
                countDescription="Número de Orden"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton href={`/admin/orders/${order.id}`} />
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Editando Orden:</span> #{order.order_number}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6 flex items-center justify-between">
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
                                        Editando Orden: #{order.order_number}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Editar Orden
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Modifica la información de la orden
                                </p>
                            </div>
                        </div>
                        <DeleteButton
                            href={`/admin/?tab=`}
                            item={"orden"}
                            itemData={order}
                            table='orders'
                        />
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <OrderEditForm form='edit' order={order} />
                    </div>
                </div>
            </div>
        </div>
    );
}