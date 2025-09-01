"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faCreditCard, faDrum, faEnvelope, faMoneyBillWave, faPlus, faShippingFast, faShoppingCart, faSpinner, faStickyNote, faTruck, faUniversity } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCartStore from "@/store/cartStore";
import Image from "next/image";
import { Item } from "@/store/cartStore";
import Link from "next/link";
import { User } from "@/app/utils/types";

const CartContainer = ({ items, userData }: { items: Item[], userData: User }) => {
    const { updateQuantity: updateQuantityStore, removeFromCart, clearCart: clearCartStore, getTotal } = useCartStore();
    const [cartItems, setCartItems] = useState(items);
    const [subTotal, setSubTotal] = useState(getTotal());
    const [customerName, setCustomerName] = useState(userData ? userData.first_name + ' ' + userData.last_name : '');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [shippingOption, setShippingOption] = useState('standard');
    const [notes, setNotes] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setCartItems(items);

    }, [items]);

    const getShippingCost = () => {
        switch (shippingOption) {
            case 'express':
                return 5.00;
            case 'standard':
            case 'pickup':
            default:
                return 0.00;
        }
    };

    const getTaxAmount = () => {

        const taxRate = 0.15;
        return subTotal * taxRate;
    };

    const getTotalAmount = () => {
        return subTotal + getShippingCost() + getTaxAmount();
    };

    const updateQuantity = (item: Item, delta: number) => {
        updateQuantityStore(item, item.quantity + delta);

        setSubTotal(getTotal());
    };

    const removeItem = (item: Item) => {
        removeFromCart(item);

        setSubTotal(getTotal());
    };

    const clearCart = () => {
        clearCartStore();
        setCartItems([]);
        setSubTotal(0);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Additional validation check
        if (!isFormValid()) {
            alert('Please fill in all required fields and accept the terms and conditions.');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customer_name: customerName,
                customer_email: email,
                customer_phone: phone,
                shipping_address: shippingAddress,
                billing_address: sameAsBilling ? shippingAddress : billingAddress,
                payment_method: paymentMethod,
                notes: notes,
                subtotal: subTotal,
                tax_amount: getTaxAmount(),
                shipping_cost: getShippingCost(),
                total_amount: getTotalAmount(),
                shipping_option: shippingOption
            };

            const response = await fetch('/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken(),
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.redirect_url) {
                    window.location.href = result.redirect_url;
                } else {
                    clearCartStore();
                    alert('Order placed successfully!');
                }
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // WhatsApp order handler
    const handleWhatsAppOrder = () => {

        if (!isFormValid()) {
            alert('Please fill in all required fields and accept the terms and conditions.');
            return;
        }

        const orderSummary = `
*New Order - Percussion Ecuador*

*Customer:* ${customerName}
*Email:* ${email}
*Phone:* ${phone}

*Shipping Address:*
${shippingAddress}

*Items:*
${cartItems.map(item => `• ${item.name} x${item.quantity} - $${(item.selling_price * item.quantity).toFixed(2)}`).join('\n')}

*Order Summary:*
Subtotal: $${subTotal.toFixed(2)}
Shipping: ${getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}
Tax: $${getTaxAmount().toFixed(2)}
*Total: $${getTotalAmount().toFixed(2)}*

*Payment Method:* ${paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}

${notes ? `*Notes:* ${notes}` : ''}
    `.trim();

        const whatsappUrl = `https://wa.me/593996888655?text=${encodeURIComponent(orderSummary)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Form validation
    const isFormValid = () => {
        return (
            customerName.trim() !== '' &&
            email.trim() !== '' &&
            phone.trim() !== '' &&
            shippingAddress.trim() !== '' &&
            (!sameAsBilling ? billingAddress.trim() !== '' : true) &&
            paymentMethod !== '' &&
            agreeTerms
        );
    };

    const getCsrfToken = () => {
        return document.querySelector("meta[name='csrf-token']")?.getAttribute("content") || '';
    };

    return (
        cartItems.length !== 0 ? (
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg shadow-sm border border-gray-200">
                            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                                <h4 className="text-xl font-semibold text-gray-900 mb-0">Artículos del Carrito ({items.length})</h4>
                            </div>
                            <div className="p-0">
                                {cartItems.map(item => (
                                    <div className="cart-item p-6 border-b border-gray-200 last:border-b-0" key={item.id}>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="w-full md:w-24 flex-shrink-0 mb-3 md:mb-0">
                                                <div className="product-image flex items-center justify-center bg-gray-100 rounded h-24 w-24">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="max-h-full w-auto rounded object-contain"
                                                            width={96}
                                                            height={96}
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faDrum} className="text-blue-600 text-3xl opacity-30" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h5 className="font-semibold text-gray-900 mb-1 text-lg">{item.name}</h5>
                                                <p className="text-gray-600 mb-2 text-sm truncate">{item.description.slice(0, 80)}...</p>
                                                <div className="text-blue-600 font-bold text-lg">${item.selling_price}</div>
                                            </div>
                                            <div className="w-full md:w-36 flex-shrink-0">
                                                <label htmlFor={`quantity_${item.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Cantidad:</label>
                                                <div className="flex items-center border border-gray-300 rounded-md max-w-36">
                                                    <button
                                                        className={`flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 border-r border-gray-300 ${item.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        onClick={() => updateQuantity(item, -1)}
                                                        disabled={item.quantity === 1}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                                    </button>
                                                    <input
                                                        id={`quantity_${item.id}`}
                                                        type="number"
                                                        className="flex-1 text-center border-0 focus:ring-0 focus:outline-none h-8"
                                                        onChange={(e) => {
                                                            const newValue = parseInt(e.target.value, 10);
                                                            if (!isNaN(newValue) && newValue > 0) {
                                                                updateQuantity(item, newValue - item.quantity);
                                                            }
                                                        }}
                                                        min="1"
                                                        max={item.stock}
                                                        value={item.quantity}
                                                    />
                                                    <button
                                                        className={`flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 border-l border-gray-300 ${item.quantity === item.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        onClick={() => updateQuantity(item, 1)}
                                                        disabled={item.quantity === item.stock}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-24 text-right flex-shrink-0">
                                                <div className="text-xl text-blue-600 font-bold mb-2">${(item.quantity * item.selling_price).toFixed(2)}</div>
                                                <button
                                                    className="inline-flex items-center px-3 py-1 border border-red-300 rounded text-red-600 hover:bg-red-50 text-sm"
                                                    onClick={() => removeItem(item)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 p-6 rounded-b-lg">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <Link href="/products" className="inline-flex items-center px-4 py-2 border border-blue-300 rounded text-blue-600 hover:bg-blue-50">
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                        Continuar Comprando
                                    </Link>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                                        onClick={clearCart}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                        Vaciar Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg shadow-sm border border-gray-200 sticky top-24">
                            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
                                <h4 className="text-xl font-semibold mb-0">Resumen del Pedido</h4>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold">${subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span>Impuesto:</span>
                                        <span>${getTaxAmount().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span>Envío:</span>
                                        <span>{getShippingCost() === 0 ? 'Gratis' : `$${getShippingCost().toFixed(2)}`}</span>
                                    </div>
                                    <hr className="my-3 border-gray-200" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold">Total:</span>
                                        <span className="text-xl font-bold text-blue-600">${getTotalAmount().toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Form */}
                                <form className="checkout-form space-y-6" onSubmit={handleSubmit}>
                                    {/* Customer Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                                            <i className="fas fa-user mr-2"></i>Información del Cliente
                                        </h5>
                                        <div className="mt-3">
                                            <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Tu nombre completo"
                                                defaultValue={userData ? userData.first_name + ' ' + userData.last_name : ''}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="tu@correo.com"
                                                defaultValue={userData ? userData.email : ''}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <div className="text-xs text-gray-500 mt-1">La confirmación se enviará aquí</div>
                                        </div>

                                        <div className="mt-3">
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Número de Teléfono *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="+593 999 999 999"
                                                defaultValue={userData ? userData.phone : ''}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                            <div className="text-xs text-gray-500 mt-1">Requerido para coordinar entrega</div>
                                        </div>
                                    </div>

                                    {/* Shipping Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                                            <FontAwesomeIcon icon={faShippingFast} className="mr-2" />Información de Envío
                                        </h5>
                                        <div className="mb-3">
                                            <label htmlFor="shippingAddress" className="block text-sm font-semibold text-gray-700 mb-1">Dirección de Envío *</label>
                                            <textarea
                                                id="shippingAddress"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={4}
                                                placeholder="Dirección, ciudad, provincia, código postal"
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <input
                                                className="mr-2 text-blue-600 focus:ring-blue-500"
                                                type="checkbox"
                                                id="sameAsBilling"
                                                checked={sameAsBilling}
                                                onChange={(e) => setSameAsBilling(e.target.checked)}
                                            />
                                            <label className="text-sm text-gray-700" htmlFor="sameAsBilling">
                                                La dirección de facturación es la misma que la de envío
                                            </label>
                                        </div>
                                        {!sameAsBilling && (
                                            <div className="mb-3">
                                                <label htmlFor="billingAddress" className="block text-sm font-semibold text-gray-700 mb-1">Dirección de Facturación *</label>
                                                <textarea
                                                    id="billingAddress"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows={4}
                                                    placeholder="Dirección, ciudad, provincia, código postal"
                                                    value={billingAddress}
                                                    onChange={(e) => setBillingAddress(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />Método de Pago
                                        </h5>
                                        <div className="payment-methods space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="bank_transfer"
                                                    value="bank_transfer"
                                                    checked={paymentMethod === 'bank_transfer'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="flex items-center text-gray-700" htmlFor="bank_transfer">
                                                    <FontAwesomeIcon icon={faUniversity} className="mr-2 text-blue-600" />Transferencia Bancaria
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="cash_on_delivery"
                                                    value="cash_on_delivery"
                                                    checked={paymentMethod === 'cash_on_delivery'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="flex items-center text-gray-700" htmlFor="cash_on_delivery">
                                                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-600" />Pago Contra Entrega
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="whatsapp_order"
                                                    value="whatsapp_order"
                                                    checked={paymentMethod === 'whatsapp_order'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="flex items-center text-gray-700" htmlFor="whatsapp_order">
                                                    <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-green-600" />Pedido por WhatsApp
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Options */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                                            <FontAwesomeIcon icon={faTruck} className="mr-2" />Opciones de Envío
                                        </h5>
                                        <div className="shipping-options space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        className="mr-3 text-blue-600 focus:ring-blue-500"
                                                        type="radio"
                                                        name="shippingOption"
                                                        id="standard_shipping"
                                                        value="standard"
                                                        checked={shippingOption === 'standard'}
                                                        onChange={(e) => setShippingOption(e.target.value)}
                                                    />
                                                    <label htmlFor="standard_shipping" className="text-gray-700">
                                                        Envío Estándar (3-5 días hábiles)
                                                    </label>
                                                </div>
                                                <span className="text-green-600 font-semibold">Gratis</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        className="mr-3 text-blue-600 focus:ring-blue-500"
                                                        type="radio"
                                                        name="shippingOption"
                                                        id="express_shipping"
                                                        value="express"
                                                        checked={shippingOption === 'express'}
                                                        onChange={(e) => setShippingOption(e.target.value)}
                                                    />
                                                    <label htmlFor="express_shipping" className="text-gray-700">
                                                        Envío Rápido (1-2 días hábiles)
                                                    </label>
                                                </div>
                                                <span className="font-semibold">$5.00</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        className="mr-3 text-blue-600 focus:ring-blue-500"
                                                        type="radio"
                                                        name="shippingOption"
                                                        id="pickup"
                                                        value="pickup"
                                                        checked={shippingOption === 'pickup'}
                                                        onChange={(e) => setShippingOption(e.target.value)}
                                                    />
                                                    <label htmlFor="pickup" className="text-gray-700">
                                                        Recoger en Tienda (Disponible al día siguiente)
                                                    </label>
                                                </div>
                                                <span className="text-green-600 font-semibold">Gratis</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Notes */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                                            <FontAwesomeIcon icon={faStickyNote} className="mr-2" />Información Adicional
                                        </h5>
                                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">Notas del Pedido (Opcional)</label>
                                        <textarea
                                            id="notes"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={4}
                                            placeholder="Instrucciones especiales, preferencias de entrega, o preguntas..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div>
                                        <div className="flex items-start">
                                            <input
                                                className="mr-2 mt-1 text-blue-600 focus:ring-blue-500"
                                                type="checkbox"
                                                id="agreeTerms"
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                required
                                            />
                                            <label className="text-sm text-gray-700" htmlFor="agreeTerms">
                                                Acepto los <a href="#" className="text-blue-600 hover:underline">Términos y Condiciones</a> y la
                                                <a href="#" className="text-blue-600 hover:underline"> Política de Privacidad</a> *
                                            </label>
                                        </div>
                                    </div>

                                    {/* Order Summary Display */}
                                    <div className="bg-gray-100 p-4 rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Subtotal:</span>
                                            <span>${subTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Envío:</span>
                                            <span>{getShippingCost() === 0 ? 'Gratis' : `$${getShippingCost().toFixed(2)}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Impuesto:</span>
                                            <span>${getTaxAmount().toFixed(2)}</span>
                                        </div>
                                        <hr className="my-2 border-gray-300" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total:</span>
                                            <span className="font-bold text-blue-600">${getTotalAmount().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                                            disabled={isSubmitting || !isFormValid()}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} className="mr-2" />Procesando Pedido...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faCheck} className="mr-2" />Realizar Pedido
                                                </>
                                            )}
                                        </button>
                                        {paymentMethod === 'whatsapp_order' && (
                                            <button
                                                type="button"
                                                className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!isFormValid()}
                                                onClick={handleWhatsAppOrder}
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />Continuar con WhatsApp
                                            </button>
                                        )}
                                        {!isFormValid() && (
                                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center">
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                                Por favor completa todos los campos requeridos y acepta los términos y condiciones.
                                            </div>
                                        )}
                                    </div>

                                    {/* Alternative Contact Methods */}
                                    <div className="text-center border-t border-gray-200 pt-6">
                                        <p className="text-gray-600 mb-3">O contáctanos directamente:</p>
                                        <div className="space-y-2">
                                            <a href="https://wa.me/593996888655" className="w-full inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
                                                <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />Pedir por WhatsApp
                                            </a>
                                            <a href="mailto:info@percusionecuador.com" className="w-full inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50">
                                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />Envíanos un Email
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            // Empty Cart
            <div className="flex justify-center">
                <div className="w-full max-w-lg text-center">
                    <div className="empty-cart py-12">
                        <div className="mb-6">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-gray-400 text-8xl opacity-30" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900">Tu carrito está vacío</h3>
                        <p className="text-gray-600 text-xl mb-6">¡Comienza agregando algunos instrumentos de percusión a tu carrito!</p>
                        <Link href="/products" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg">
                            <FontAwesomeIcon icon={faDrum} className="mr-2" />Ver Productos
                        </Link>
                    </div>
                </div>
            </div>
        )
    );
};

export default CartContainer;

