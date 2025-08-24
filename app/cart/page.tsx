"use client";
import React from 'react';
import { faAward, faHeadphones, faShield, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCartStore from '@/store/cartStore';
import CartContainer from '@/components/cartContainer';
import Link from 'next/link';


export default function CartPage() {
    const items = useCartStore((state) => state.cart);
  return (
    <div>
      {/* Cart Header Section */}
      <section className="bg-gray-50 pt-16 pb-10 mt-19">
        <div className="container mx-auto px-4">
          <div className="w-full">
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="flex space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800 no-underline">
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-500">/</span>
                  <span className="text-gray-500" aria-current="page">
                    Carrito de Compras
                  </span>
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl font-bold mb-3 relative">
              Tu Carrito
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-blue-600 mt-2 text-black"></div>
            </h1>
            <p className="text-gray-600 text-xl">
              Revisa tus items seleccionados
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4" id="cart">
          {/* Cart items would be rendered here */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
            </div>
          ) : (
            <div>
              {/* Cart items rendering logic would go here */}
              <CartContainer items={items} />
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="

      py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="trust-badge">
              <div className="mb-3">
                <FontAwesomeIcon icon={faTruck} className="w-10 h-10 text-blue-600 mx-auto text-4xl" />
              </div>
              <h5 className="font-semibold text-lg mb-2">Envío Gratuito</h5>
              <p className="text-gray-600 mb-0">En pedidos superiores a $50</p>
            </div>

            <div className="trust-badge">
              <div className="mb-3">
                <FontAwesomeIcon icon={faShield} className="w-10 h-10 text-blue-600 mx-auto text-4xl" />
              </div>
              <h5 className="font-semibold text-lg mb-2">Pago Seguro</h5>
              <p className="text-gray-600 mb-0">Seguro y encriptado</p>
            </div>

            <div className="trust-badge">
              <div className="mb-3">
                <FontAwesomeIcon icon={faHeadphones} className="w-10 h-10 text-blue-600 mx-auto text-4xl" />
              </div>
              <h5 className="font-semibold text-lg mb-2">Soporte Experto</h5>
              <p className="text-gray-600 mb-0">Más de 14 años de experiencia</p>
            </div>

            <div className="trust-badge">
              <div className="mb-3">
                <FontAwesomeIcon icon={faAward} className="w-10 h-10 text-blue-600 mx-auto text-4xl" />
              </div>
              <h5 className="font-semibold text-lg mb-2">Calidad Premium</h5>
              <p className="text-gray-600 mb-0">Marcas internacionales</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
