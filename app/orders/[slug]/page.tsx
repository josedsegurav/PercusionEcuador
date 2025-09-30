import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faShippingFast,
    faCreditCard,
    faStickyNote,
    faUniversity,
    faMoneyBillWave,
    faEnvelope,
    faArrowLeft,
    faDrum,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { urlOrderParamsSchema } from "@/lib/validations";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Order, Product } from "@/app/utils/types";
import Link from "next/link";

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: "bg-yellow-500 text-gray-900",
        confirmed: "bg-green-500 text-white",
        processing: "bg-blue-500 text-white",
        shipped: "bg-cyan-600 text-white",
        delivered: "bg-green-600 text-white",
        cancelled: "bg-red-500 text-white"
    };
    return colors[status] || "bg-gray-500 text-white";
};

const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
        pending: "Tu pedido ha sido recibido y está siendo revisado.",
        confirmed: "Tu pedido ha sido confirmado y se está preparando.",
        processing: "Tu pedido está siendo procesado y se enviará pronto.",
        shipped: "Tu pedido ha sido enviado y está en camino.",
        delivered: "Tu pedido ha sido entregado exitosamente.",
        cancelled: "Este pedido ha sido cancelado."
    };
    return messages[status] || `Estado del pedido: ${status}`;
};

const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: "bg-yellow-500 text-gray-900",
        paid: "bg-green-500 text-white",
        failed: "bg-red-500 text-white",
        refunded: "bg-blue-500 text-white"
    };
    return colors[status] || "bg-gray-500 text-white";
};

export default async function OrderShow({ params, }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    // Validate URL parameters
    const validationResult = urlOrderParamsSchema.safeParse({ slug });
    if (!validationResult.success) {
        console.log("validation error", validationResult.error)

        return notFound();
    }

    const supabase = await createClient();

    const { data: orderData, error: orderError } = await supabase.from("orders").select(`
        id,
        order_number,
        created_at,
        status,
        payment_status,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        billing_address,
        notes,
        payment_method,
        subtotal,
        tax_amount,
        shipping_cost,
        order_items (id, quantity, unit_price, products (name, description, bucket_id, image_name))
        `).eq("order_number", slug).single()

    if (orderError) {
        console.log("Error", orderError)
    }

    if (!orderData) {
        console.log("no order data")
        return notFound();
    }

    if (slug !== orderData.order_number) {
        redirect(`${orderData.order_number}`);
    }

    // console.log(orderData.order_items[0].products.image_name)
    const orderItems = orderData.order_items.map((item) => {
        const productItem = item.products as unknown as Product;
        let product = {};

        if (productItem.image_name == null) {
            product = {
                ...productItem
            };
        } else {
            const productImage = supabase.storage.from(productItem.bucket_id).getPublicUrl(productItem.image_name);

            product = {
                ...productItem,
                image: productImage.data.publicUrl
            };
        }

        return {
            ...item,
            products: product
        };

    });

    const order = {
        ...orderData,
        order_items: orderItems
    } as unknown as Order

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = (quantity: number, unit_price: number) => {
        return quantity * unit_price
    }

    const getTotalAmount = (tax: number, subtotal: number) => {
        const total_amount = tax  + subtotal;
        return total_amount;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Order Details Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status Card */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-cyan-900 to-percussion text-white p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold mb-1">Pedido {order.order_number}</h1>
                                            <p className="text-gray-200 text-sm">
                                                Realizado el {order.created_at ? formatDate(order.created_at) : ''}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`${getStatusColor(order.status)} px-4 py-2 rounded-full text-sm font-semibold inline-block`}>
                                                {order.status === 'pending' && 'Pendiente'}
                                                {order.status === 'confirmed' && 'Confirmado'}
                                                {order.status === 'processing' && 'Procesando'}
                                                {order.status === 'shipped' && 'Enviado'}
                                                {order.status === 'delivered' && 'Entregado'}
                                                {order.status === 'cancelled' && 'Cancelado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Estado del Pedido</h3>
                                            <p className="text-gray-600">{getStatusMessage(order.status)}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Estado del Pago</h3>
                                            <span className={`${getPaymentStatusColor(order.payment_status)} px-3 py-1 rounded-full text-sm font-semibold inline-block`}>
                                                {order.payment_status === 'pending' && 'Pendiente'}
                                                {order.payment_status === 'paid' && 'Pagado'}
                                                {order.payment_status === 'failed' && 'Fallido'}
                                                {order.payment_status === 'refunded' && 'Reembolsado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="border-b border-gray-200 p-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Artículos del Pedido ({totalItems})
                                    </h2>
                                </div>
                                <div>
                                    {order.order_items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`p-6 ${index !== order.order_items.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        >
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {item.products.image ? (
                                                        <Image
                                                            src={item.products.image}
                                                            alt={item.products.name}
                                                            width={80}
                                                            height={80}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faDrum} className="text-cyan-600 text-3xl opacity-30" />
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-gray-900 mb-1">{item.products.name}</h3>
                                                    <p className="text-gray-600 text-sm mb-2">{item.products.description}</p>
                                                    <div className="text-percussion font-bold">
                                                        Precio Unitario: ${item.unit_price.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                                    <span className="font-semibold text-gray-900">Cant: {item.quantity}</span>
                                                    <div className="text-xl font-bold text-percussion">
                                                        ${totalPrice(item.quantity, item.unit_price).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="border-b border-gray-200 p-6">
                                    <h2 className="text-xl font-bold text-gray-900">Información del Cliente</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-percussion mb-3 flex items-center">
                                                <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                                                Detalles del Cliente
                                            </h3>
                                            <div className="space-y-2 text-gray-600">
                                                <p><strong className="text-gray-900">Nombre:</strong> {order.customer_name}</p>
                                                <p><strong className="text-gray-900">Email:</strong> {order.customer_email}</p>
                                                <p><strong className="text-gray-900">Teléfono:</strong> {order.customer_phone}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-percussion mb-3 flex items-center">
                                                <FontAwesomeIcon icon={faShippingFast} className="w-4 h-4 mr-2" />
                                                Dirección de Envío
                                            </h3>
                                            <p className="text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
                                        </div>
                                    </div>

                                    {order.billing_address !== order.shipping_address && (
                                        <>
                                            <hr className="border-gray-200" />
                                            <div>
                                                <h3 className="font-semibold text-percussion mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4 mr-2" />
                                                    Dirección de Facturación
                                                </h3>
                                                <p className="text-gray-600 whitespace-pre-line">{order.billing_address}</p>
                                            </div>
                                        </>
                                    )}

                                    {order.notes && (
                                        <>
                                            <hr className="border-gray-200" />
                                            <div>
                                                <h3 className="font-semibold text-percussion mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faStickyNote} className="w-4 h-4 mr-2" />
                                                    Notas del Pedido
                                                </h3>
                                                <p className="text-gray-600 whitespace-pre-line">{order.notes}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                                <div className="bg-gradient-to-r from-cyan-900 to-percussion text-white p-6">
                                    <h2 className="text-xl font-bold">Resumen del Pedido</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    {/* <div className="flex justify-between text-gray-600">
                                        <span>Envío:</span>
                                        <span className="font-semibold text-gray-900">
                                            {order.shipping_cost > 0 ? `$${order.shipping_cost.toFixed(2)}` : 'Gratis'}
                                        </span>
                                    </div> */}
                                    <div className="flex justify-between text-gray-600">
                                        <span>IVA (12%):</span>
                                        <span className="font-semibold text-gray-900">${order.tax_amount.toFixed(2)}</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold text-gray-900">Total:</span>
                                        <span className="font-bold text-percussion">${getTotalAmount(order.tax_amount, order.subtotal).toFixed(2)}</span>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="pt-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Método de Pago</h3>
                                        <div className="flex items-center text-gray-600">
                                            {order.payment_method === 'bank_transfer' && (
                                                <>
                                                    <FontAwesomeIcon icon={faUniversity} className="w-5 h-5 text-percussion mr-2" />
                                                    <span>Transferencia Bancaria</span>
                                                </>
                                            )}
                                            {order.payment_method === 'cash_on_delivery' && (
                                                <>
                                                    <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Pago Contra Entrega</span>
                                                </>
                                            )}
                                            {order.payment_method === 'whatsapp_order' && (
                                                <>
                                                    <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Pedido por WhatsApp</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3 pt-4">
                                        {order.payment_status === 'pending' && order.payment_method === 'bank_transfer' && (
                                            <button className="w-full bg-percussion hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faUniversity} className="w-5 h-5 mr-2" />
                                                Instrucciones de Pago
                                            </button>
                                        )}

                                        <Link
                                            href={`https://wa.me/593996888655?text=Hola, tengo una pregunta sobre el pedido #${order.order_number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 mr-2" />
                                            Contactar Soporte
                                        </Link>

                                        <Link
                                            href={`mailto:info@percusionecuador.com?subject=Consulta de Pedido - #${order.order_number}`}
                                            className="w-full border-2 border-percussion text-percussion hover:bg-percussion hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mr-2" />
                                            Enviar Email
                                        </Link>

                                        <Link
                                            href="/"
                                            className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
                                            Continuar Comprando
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Next Steps Section */}
            {/* <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué Sucede Ahora?</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-percussion text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    1
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmación del Pedido</h3>
                                <p className="text-gray-600">Te enviaremos un email de confirmación con los detalles de tu pedido.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    2
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesamiento</h3>
                                <p className="text-gray-600">Prepararemos tus instrumentos de percusión con cuidado.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    3
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Envío</h3>
                                <p className="text-gray-600">Tu pedido será enviado y recibirás información de seguimiento.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    4
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrega</h3>
                                <p className="text-gray-600">¡Disfruta de tus nuevos instrumentos de percusión!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Contact Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Preguntas sobre tu Pedido?</h2>
                        <p className="text-lg text-gray-600">
                            ¡Nuestro equipo está aquí para ayudarte! Contáctanos a través de tu canal preferido y
                            menciona el pedido #{order.order_number}.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <a
                            href={`https://wa.me/593996888655?text=Hola, tengo una pregunta sobre el pedido #${order.order_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 text-5xl mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                            <p className="text-gray-600 text-sm">Respuestas rápidas</p>
                        </a>

                        <a
                            href={`mailto:info@percusionecuador.com?subject=Consulta de Pedido - #${order.order_number}`}
                            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="text-percussion text-5xl mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                            <p className="text-gray-600 text-sm">Soporte detallado</p>
                        </a>

                        <a
                            href="tel:+593996888655"
                            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <FontAwesomeIcon icon={faPhone} className="text-blue-500 text-5xl mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
                            <p className="text-gray-600 text-sm">Contacto directo</p>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}