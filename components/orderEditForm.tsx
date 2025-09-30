'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faTimes,
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faCreditCard,
    faMoneyBillWave,
    faInfoCircle,
    faDollarSign,
    faTruck,
    faFileText,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/app/utils/types';
import { createClient } from '@/lib/supabase/client';

export default function OrderEditForm({ order, form }: { order: Order | null, form: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [formData, setFormData] = useState({
        order_number: order ? order.order_number : 0,
        customer_name: order ? order.customer_name : '',
        customer_email: order ? order.customer_email : '',
        customer_phone: order ? order.customer_phone : '',
        shipping_address: order ? order.shipping_address : '',
        billing_address: order ? order.billing_address : '',
        payment_status: order ? order.payment_status : 'pending',
        payment_method: order ? order.payment_method : 'credit_card',
        status: order ? order.status : 'pending',
        tax_amount: order ? order.tax_amount : 0,
        subtotal: order ? order.subtotal : 0,
        shipping_cost: order ? order.shipping_cost : 0,
        total_amount: order ? order.total_amount : 0,
        notes: order ? order.notes : ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> |
        React.ChangeEvent<HTMLTextAreaElement> |
        React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('amount') || name.includes('cost') || name.includes('total') || name === 'order_number'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (order && form == "edit") {
            const { error } = await supabase.from("orders").update({
                order_number: formData.order_number,
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                customer_phone: formData.customer_phone,
                shipping_address: formData.shipping_address,
                billing_address: formData.billing_address,
                payment_status: formData.payment_status,
                payment_method: formData.payment_method,
                status: formData.status,
                tax_amount: formData.tax_amount,
                subtotal: formData.subtotal,
                shipping_cost: formData.shipping_cost,
                total_amount: formData.total_amount,
                notes: formData.notes
            }).eq("id", order.id);

            if (error) {
                console.log(error);
            } else {
                setIsSubmitting(false);
                router.push(`/admin/orders/${order.id}`);
                router.refresh();
            }
        } else if (form == "add") {
            const { error } = await supabase.from("orders").insert({
                order_number: formData.order_number,
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                customer_phone: formData.customer_phone,
                shipping_address: formData.shipping_address,
                billing_address: formData.billing_address,
                payment_status: formData.payment_status,
                payment_method: formData.payment_method,
                status: formData.status,
                tax_amount: formData.tax_amount,
                subtotal: formData.subtotal,
                shipping_cost: formData.shipping_cost,
                total_amount: formData.total_amount,
                notes: formData.notes
            });

            if (error) {
                console.log(error);
            } else {
                setIsSubmitting(false);
                router.push('/admin/?tab=orders');
                router.refresh();
            }
        }
    };

    const handleCancel = () => {
        if (order && form == 'edit') {
            router.push(`/admin/orders/${order.id}`);
        } else if (form == 'add') {
            router.push('/admin/?tab=orders');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Non-editable ID Display */}
            {order ? (
                <div className="bg-gray-100 rounded-lg p-6 border-l-4 border-gray-400">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faHashtag}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700">
                            Identificador (No Editable)
                        </h3>
                    </div>
                    <div className="ml-13">
                        <p className="text-2xl font-bold text-gray-600">
                            #{order.id}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            El ID no puede ser modificado
                        </p>
                    </div>
                </div>
            ) : ''}

            {/* Order Number */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faHashtag}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                        Número de Orden *
                    </h3>
                </div>
                <div className="ml-13">
                    <p>{formData.order_number}</p>
                    <p className="text-blue-600 text-sm mt-2">
                        Número único de identificación de la orden
                    </p>
                </div>
            </div>

            {/* Customer Information Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-600" />
                    Información del Cliente
                </h2>

                {/* Customer Name */}
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900">
                            Nombre del Cliente *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <p>{formData.customer_name}</p>
                    </div>
                </div>

                {/* Customer Email */}
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900">
                            Email del Cliente *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <input
                            type="email"
                            id="customer_email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium"
                            placeholder="email@ejemplo.com"
                            required
                        />
                    </div>
                </div>

                {/* Customer Phone */}
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900">
                            Teléfono del Cliente *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <input
                            type="tel"
                            id="customer_phone"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium"
                            placeholder="+1 234 567 8900"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Addresses Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-purple-600" />
                    Direcciones
                </h2>

                {/* Shipping Address */}
                <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mt-1">
                            <FontAwesomeIcon
                                icon={faTruck}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-purple-900">
                            Dirección de Envío *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <textarea
                            id="shipping_address"
                            name="shipping_address"
                            value={formData.shipping_address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            placeholder="Dirección completa de envío"
                            required
                        />
                    </div>
                </div>

                {/* Billing Address */}
                <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mt-1">
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-purple-900">
                            Dirección de Facturación *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <textarea
                            id="billing_address"
                            name="billing_address"
                            value={formData.billing_address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            placeholder="Dirección completa de facturación"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Order Status Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-yellow-600" />
                    Estado de la Orden
                </h2>

                {/* Order Status */}
                <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-900">
                            Estado *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-lg font-medium"
                            required
                        >
                            <option value="pending">Pendiente</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">Enviado</option>
                            <option value="completed">Completado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faMoneyBillWave}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-green-900">
                            Estado de Pago *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <select
                            id="payment_status"
                            name="payment_status"
                            value={formData.payment_status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg font-medium"
                            required
                        >
                            <option value="pending">Pendiente</option>
                            <option value="paid">Pagado</option>
                            <option value="failed">Fallido</option>
                            <option value="refunded">Reembolsado</option>
                        </select>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="text-white text-lg"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-green-900">
                            Método de Pago *
                        </h3>
                    </div>
                    <div className="ml-13">
                        <select
                            id="payment_method"
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg font-medium"
                            required
                        >
                            <option value="credit_card">Tarjeta de Crédito</option>
                            <option value="debit_card">Tarjeta de Débito</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Transferencia Bancaria</option>
                            <option value="cash">Efectivo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Financial Details Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="mr-3 text-green-600" />
                    Detalles Financieros
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Subtotal */}
                    <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faDollarSign}
                                    className="text-white text-lg"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Subtotal *
                            </h3>
                        </div>
                        <div className="ml-13">
                            <input
                                type="number"
                                step="0.01"
                                id="subtotal"
                                name="subtotal"
                                value={formData.subtotal}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-lg font-medium"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Shipping Cost */}
                    {/* <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faTruck}
                                    className="text-white text-lg"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Costo de Envío *
                            </h3>
                        </div>
                        <div className="ml-13">
                            <input
                                type="number"
                                step="0.01"
                                id="shipping_cost"
                                name="shipping_cost"
                                value={formData.shipping_cost}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-lg font-medium"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div> */}

                    {/* Tax Amount */}
                    <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faDollarSign}
                                    className="text-white text-lg"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Impuestos *
                            </h3>
                        </div>
                        <div className="ml-13">
                            <input
                                type="number"
                                step="0.01"
                                id="tax_amount"
                                name="tax_amount"
                                value={formData.tax_amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-lg font-medium"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>


                </div>
            </div>

            {/* Notes Field */}
            <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mt-1">
                        <FontAwesomeIcon
                            icon={faFileText}
                            className="text-white text-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-900">
                        Notas
                    </h3>
                </div>
                <div className="ml-13">
                    <p>{formData.notes}</p>
                    <p className="text-yellow-600 text-sm mt-2">
                        Información adicional o comentarios sobre la orden
                    </p>
                </div>
            </div>

            {/* Required Fields Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-700">
                    <span className="text-red-500 font-bold">*</span>
                    <span className="font-medium ml-1">Campos requeridos</span> -
                    Todos los campos marcados son obligatorios para guardar los cambios.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    disabled={isSubmitting}
                >
                    <FontAwesomeIcon icon={faTimes} className="text-sm mr-2" />
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        className={`text-sm mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
                    />
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}