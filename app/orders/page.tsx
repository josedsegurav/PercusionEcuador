'use client'

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faCalendar,
    faDrum,
    faUser,
    faArrowRight,
    faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getInitialSession } from '@/hooks/userSession';
import { Order, User } from '../utils/types';
import Header from '@/components/header';
import Link from 'next/link';


export default function OrderIndex() {
    // const router = useRouter();
    const supabase = createClient();
    const [user, SetUser] = useState<User | null>();
    // const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isSearched, setIsSearched] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        order_number: '',
        email: ''
    });
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getInitialSession();
            SetUser(userData)
            if (userData) {
                setIsSearched(true)
                setAllowed(true)
                const { data, error } = await supabase.from("orders").select("*").eq("customer_email", userData.email);

                if (error) {
                    console.log(error)
                }

                setOrders(data || [])
            }
        }

        fetchUser();


    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchQuery(prev => ({
            ...prev,
            [name]: value
        }));
    }


    const handleSearch = async () => {
        // setIsLoading(true);
        const { data: orderList, error: orderError } = await supabase.from("orders").select("*").eq("customer_email", searchQuery.email);
        const { data: userExist, error: userExistError } = await supabase.from("users").select("email").eq("email", searchQuery.email);

        if (orderError) {
            console.log("error order list", orderError)
        } else {
            if (userExistError) {
                console.log("error user exist", userExistError)
            } else {
                if (!userExist) {
                    setAllowed(true)
                    setIsSearched(true)
                    setOrders(orderList)
                } else {
                    setIsSearched(true)
                }

            }

        }

    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
            processing: { color: 'bg-yellow-500 text-yellow-900', text: 'Procesando' },
            delivered: { color: 'bg-green-500 text-green-900', text: 'Entregado' },
            shipped: { color: 'bg-blue-500 text-blue-900', text: 'Enviado' },
            cancelled: { color: 'bg-red-500 text-red-900', text: 'Cancelado' },
            pending: { color: 'bg-gray-500 text-gray-900', text: 'Pendiente' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                {config.text}
            </span>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTotalAmount = (tax: number, subtotal: number) => {
        const total_amount = tax  + subtotal;
        return total_amount;
    }

    return (
        <div className="min-h-screen">
            {!user ? (
                <section className="bg-gradient-to-r from-cyan-900 to-percussion text-white py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                    Rastrea tu Pedido
                                </h1>
                                <p className="text-xl text-gray-200 leading-relaxed">
                                    Encuentra tu pedido de instrumentos de percusión de manera rápida y fácil.
                                    Ingresa los detalles de tu pedido para verificar el estado y la información de seguimiento.
                                </p>

                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h6 className="text-white mb-4 flex items-center">
                                        <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 mr-2" />
                                        Consejos de Búsqueda:
                                    </h6>
                                    <div className="flex items-center text-gray-200">
                                        @
                                        Usa tu correo electrónico para buscar tus pedidos
                                    </div>
                                </div>

                            </div>

                            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faSearch} className="w-8 h-8 text-cyan-600" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Encuentra tus Pedidos</h3>
                                <p className="text-gray-200 mb-6">
                                    Ingresa tu correo electrónico para buscar tus pedidos
                                </p>

                                <div className="space-y-4">

                                    <div className="text-left">
                                        <label className="block text-white font-semibold mb-3">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={searchQuery.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
                                            placeholder="ej: percuec@example.com"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSearch}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                                    >
                                            <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-2" />
                                            Buscar
                                    </button>
                                </div>

                                <div className="text-center mt-6">
                                    <p className="text-gray-200 mb-3">¿Necesitas ayuda para encontrar tu pedido?</p>
                                    <a
                                        href="https://wa.me/593996888655"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 mr-2" />
                                        Contactar Soporte
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : <Header title='Ordenes' description='Ordenes realizadas' currentPage='Orders' countDescription='Ordenes' count={orders.length} />}

            {isSearched && (

                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {allowed ?
                        orders.length > 0 ? (
                            <>
                                {!user ? (
                                    <div className="text-center mb-16">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Resultados de Búsqueda</h2>
                                        <p className="text-xl text-gray-600">
                                            {orders.length === 1 ? 'Encontrado 1 pedido' : `Encontrados ${orders.length} pedidos`}
                                        </p>
                                    </div>
                                ) : ''}

                                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h5 className="text-xl font-bold text-gray-900 mb-2">
                                                        {order.order_number}
                                                    </h5>
                                                    <div className="flex items-center text-gray-600 mb-2">
                                                        <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-2 text-cyan-600" />
                                                        {formatDate(order.created_at || '')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(order.status)}
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-gray-600">
                                                    <FontAwesomeIcon icon={faDrum} className="w-4 h-4 mr-2 text-cyan-600" />
                                                    {/* <span className="text-sm">
                                                        {order.order_items.slice(0, 2).map(item => item.product.name).join(', ')}
                                                        {order.order_items.length > 2 && ` y ${order.order_items.length - 2} más`}
                                                    </span> */}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2 text-cyan-600" />
                                                    <span className="text-sm">{order.customer_name}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    ${getTotalAmount(order.tax_amount, order.subtotal).toFixed(2)}
                                                </div>
                                                <Link href={`/orders/${order.order_number}`} className="flex items-center text-cyan-600 font-semibold">
                                                    Ver Detalles
                                                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center max-w-2xl mx-auto">
                                <div className="bg-white rounded-xl p-12 shadow-lg">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FontAwesomeIcon icon={faSearch} className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No se encontraron pedidos</h3>
                                    <p className="text-gray-600 mb-8">
                                        No se encontraron pedidos que coincidan con &ldquo;<strong>{searchQuery.email}</strong>&ldquo;.
                                        Por favor verifica los términos de búsqueda o contacta con soporte.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={() => {
                                                setSearchQuery({ order_number: '', email: '' });
                                                setIsSearched(false);
                                                setOrders([]);
                                            }}
                                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-2" />
                                            Nueva Búsqueda
                                        </button>
                                        <a
                                            href="https://wa.me/593996888655"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 mr-2" />
                                            Contactar Soporte
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center mb-16">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">No autorizado: Usuario registrado</h2>
                                        <p className="text-xl text-gray-600">
                                            Para ver tus pedidos inicia sesion
                                        </p>
                                    </div>
                        )
                    }

                    </div>
                </section>
            )
            }

        </div >
    )
}