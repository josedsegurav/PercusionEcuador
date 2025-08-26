
"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { LogoutButton } from "./logout-button";

export default function Navbar({ loggedIn, userId }: { loggedIn: boolean, userId: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCartStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black shadow z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Mobile Menu button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {/* Logo */}
        <Link href="/" className="flex items-center text-xl font-bold text-gray-800">
          <Image src="/pec.png" alt="Drum" width={160} height={160} />
        </Link>

        {/* Mobile Menu buttons */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/account" className="bg-percussion text-white border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-white hover:text-percussion transition">
            <FontAwesomeIcon icon={faUser} className="mr-1" /> Sign In
          </Link>

          <Link href="/cart" className="relative text-2xl">
            <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-percussion text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

        </div>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-500 text-white">Home</Link>

          <Link href="/categories" className="hover:text-blue-500 text-white">Categorías</Link>

          <Link href="/products" className="hover:text-blue-500 text-white">Products</Link>
          <Link href="/#nosotros" className="hover:text-blue-500 text-white">About Us</Link>
          <Link href="/#contacto" className="hover:text-blue-500 text-white">Contact</Link>
          <Link href="/orders" className="hover:text-blue-500 text-white">Orders</Link>
        </div>

        {/* Desktop Menu buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {loggedIn ? (
            <>
            <Link href="/account" className="bg-percussion text-white border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-white hover:text-percussion transition">
              <FontAwesomeIcon icon={faUser} className="mr-1" /> {userId}
            </Link>
            <LogoutButton />
            </>
          ) : (
            <Link href="/auth/login" className="bg-percussion text-white border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-white hover:text-percussion transition">
              <FontAwesomeIcon icon={faUser} className="mr-1" /> Sign In
            </Link>
          )}

          <Link href="/cart" className="relative">
            <FontAwesomeIcon icon={faShoppingCart} className="text-white text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-percussion text-white text-xs px-1 rounded-full">
              {cartCount}
            </span>
            )}
          </Link>

          <Link
            href="https://wa.me/593996888655"
            className="flex items-center justify-center w-9 h-9 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-white text-2xl" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu bar */}
      {isMenuOpen && (
        <div className="md:hidden text-white border-t border-gray-100 bg-gradient-to-r from-cyan-900 from-10% to-percussion to-90%">
          <ul className="flex flex-col p-4 space-y-2 divide-y divide-white">
            <li><Link href="/" className="block hover:text-blue-500 bg-gradient-to-r from-cyan-900 from-10% to-percussion to-90%" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link href="/categories" className="block hover:text-blue-500 bg-gradient-to-r from-cyan-900 from-20% to-percussion to-90%" onClick={() => setIsMenuOpen(false)}>Categorías</Link></li>
            <li><Link href="/products" className="block hover:text-blue-500 bg-gradient-to-r from-cyan-900 from-30% to-percussion to-90%" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
            <li><Link href="/#nosotros" className="block hover:text-blue-500 bg-gradient-to-r from-cyan-900 from-40% to-percussion to-90%" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
            <li><Link href="/#contacto" className="block hover:text-blue-500 bg-gradient-to-r from-cyan-900 from-50% to-percussion to-90%" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            <li><Link href="/orders" className="block hover:text-blue-500 bg-gradient-to-r from-cyan-900 from-60% to-percussion to-90%" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
          </ul>

        </div>
      )}
    </nav>
  );
}
