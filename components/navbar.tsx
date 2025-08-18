
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faDrum, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

export default function Navbar({ cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categories, error } = await supabase
          .from("categories")
          .select("*");

        if (error) throw error;

        setCategories(categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black shadow z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center text-xl font-bold text-gray-800">
          <Image src="/pec.png" alt="Drum" width={160} height={160} />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-500 text-white">Home</Link>

          {/* Categories Dropdown */}
          <div ref={categoriesRef} className="relative">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="hover:text-blue-500 flex items-center text-white"
            >
              Categories <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
            </button>
            {isCategoriesOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faDrum} className="mr-2" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/products" className="hover:text-blue-500 text-white">Products</Link>
          <Link href="/#nosotros" className="hover:text-blue-500 text-white">About Us</Link>
          <Link href="/#contacto" className="hover:text-blue-500 text-white">Contact</Link>
          <Link href="/orders" className="hover:text-blue-500 text-white">Orders</Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="#" className="bg-percussion text-white border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-white hover:text-percussion transition">
            <FontAwesomeIcon icon={faUser} className="mr-1" /> Sign In
          </Link>

          <Link href="/cart" className="relative">
            <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 rounded-full">
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
            <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col p-4 space-y-2">
            <li><Link href="/" className="block hover:text-blue-500">Home</Link></li>
            <li>
              <button
                className="w-full text-left hover:text-blue-500 flex items-center justify-between"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                Categories <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
              </button>
              {isCategoriesOpen && (
                <ul className="mt-2 space-y-1 pl-4">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.id}`}
                        className="block hover:text-blue-500"
                      >
                        <FontAwesomeIcon icon={faDrum} className="mr-2" />
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><Link href="/products" className="block hover:text-blue-500">Products</Link></li>
            <li><Link href="/#nosotros" className="block hover:text-blue-500">About Us</Link></li>
            <li><Link href="/#contacto" className="block hover:text-blue-500">Contact</Link></li>
            <li><Link href="/orders" className="block hover:text-blue-500">Orders</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
