"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCartPlus, faEnvelope, faEye, faInfoCircle, faStore, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// Mock data types (replace with your fetched data)
interface Product {
    id: number;
    name: string;
    description: string;
    selling_price: number;
    stock_quantity: number;
    image?: string;
    categories?: { id: number; name: string };
    vendors?: { id: number; name: string };
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

export default function Products() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const[filters, setFilters] = useState<{search: string | null, categoryId: string | number}>({search: null, categoryId: "all"});
    const [sortBy, setSortBy] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [slice, setSlice] = useState<number>(10);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data: products, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                description,
                selling_price,
                stock_quantity,
                categories (id, name),
                vendors (id, name),
                created_at
                `);
            if (error) {
                setError(error.message);
            }
            setProducts(products as unknown as Product[]);
            setFilteredProducts(products as unknown as Product[]);
            setIsLoading(false);
        };
        const fetchCategories = async () => {
            const { data: categories, error } = await supabase.from("categories").select("*");
            if (error) {
                setError(error.message);
            }
            setCategories(categories || []);
        };
        fetchProducts();
        fetchCategories();
    }, [supabase]);

    console.log(products);


    if (error) {
        return <div>Error: {error}</div>;
    }
    const totalProducts = products.length;


    const handleSearchByCategory = async (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const newFilters = {...filters, [name]: value};
        setFilters(newFilters);
        console.log(newFilters);

        let result = products;

        if (newFilters.categoryId !== "all" ) {

            result = result.filter((product) => product.categories?.id == newFilters.categoryId);
        }

        if (newFilters.search !== null ) {
            result = result.filter((product) => product.name.toLowerCase().includes(newFilters.search?.toLowerCase() ?? ""));
        }

        setFilteredProducts(result);
    }

    const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (slice < filteredProducts.length) {
            setSlice(slice + 10);
        }
    }

    return (
        <div>
            {/* Page Header */}
            <section className="bg-gradient-to-r from-sky-600 to-sky-400 py-24 mt-20">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
                    <div className="text-white lg:w-2/3">
                        <nav className="mb-3 text-sm">
                            <ol className="flex space-x-2">
                                <li>
                                    <Link href="/" className="text-white/70 hover:text-white">
                                        Home
                                    </Link>
                                </li>
                                <li className="text-white">/ Products</li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl font-bold mb-3">Our Products</h1>
                        <p className="text-white/80 text-lg">
                            Discover our wide selection of percussion instruments from the
                            world&apos;s best brands.
                        </p>
                    </div>
                    <div className="text-white text-right mt-6 lg:mt-0">
                        <span className="text-5xl font-bold block">{totalProducts}</span>
                        <small className="opacity-75 text-sm">Available Products</small>
                    </div>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-6 border-b bg-white">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-4">
                    {/* Search */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            name="search"
                            onChange={handleSearchByCategory}
                            className="w-full px-4 py-3 rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-sky-400"
                        />


                    {/* Filters */}
                    <div className="flex gap-3">
                        {/* Category Filter */}
                        <select
                            name="categoryId"
                            defaultValue="all"
                            onChange={handleSearchByCategory}
                            className="px-4 py-3 border rounded-lg shadow-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border rounded-lg shadow-sm"
                        >
                            <option value="">Sort By</option>
                            <option value="newest">Most Recent</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Name A-Z</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12">
                {isLoading ? (
                    <div className="text-center py-16">
                        <i className="fas fa-spinner fa-spin text-gray-400 text-6xl mb-4"></i>
                        <h3 className="text-xl text-gray-500 mb-2">Loading...</h3>
                    </div>
                ) : (
                <div className="container mx-auto px-4">
                    {filteredProducts.length > 0 ? (
                        <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.slice(0, slice).map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                                >
                                    <div className="relative h-64 bg-gray-100">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-sky-500 opacity-40">
                                                <i className="fas fa-drum text-6xl"></i>
                                            </div>
                                        )}

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 space-y-1">
                                            {product.stock_quantity <= 5 && (
                                                <span className="bg-yellow-400 text-black px-3 py-1 rounded text-xs font-semibold">
                                                    Few Stock
                                                </span>
                                            )}
                                            {new Date(product.created_at) >
                                                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                                                    <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold">
                                                        New
                                                    </span>
                                                )}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="absolute top-3 right-3">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <span className="inline-block text-sky-600 text-sm mb-2">
                                            {product.categories?.name}
                                        </span>
                                        <h5 className="text-lg font-semibold mb-2">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="hover:text-sky-600"
                                            >
                                                {product.name}
                                            </Link>
                                        </h5>
                                        <p className="text-gray-600 text-sm flex-1">
                                            {product.description.slice(0, 80)}...
                                        </p>

                                        {/* Price & stock */}
                                        <div className="flex justify-between items-center mt-4 mb-3">
                                            <div className="text-2xl font-bold text-sky-600">
                                                ${product.selling_price}
                                            </div>
                                            <small className="text-gray-500">
                                                <FontAwesomeIcon icon={faBox} />
                                                {product.stock_quantity} available
                                            </small>
                                        </div>

                                        {/* Vendor */}
                                        {product.vendors?.name && (
                                            <div className="text-sm text-gray-500 mb-3">
                                                <FontAwesomeIcon icon={faStore} />
                                                {product.vendors?.name}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="space-y-2">
                                            {product.stock_quantity > 0 ? (
                                                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg">
                                                    <FontAwesomeIcon icon={faCartPlus} />Add to Cart
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />Out of Stock
                                                </button>
                                            )}

                                            <div className="grid grid-cols-2 gap-2">
                                                <a
                                                    href={`https://wa.me/593996888655?text=Hola, me interesa el producto: ${product.name}`}
                                                    target="_blank"
                                                    className="border border-green-500 text-green-600 py-2 rounded-lg text-sm flex items-center justify-center hover:bg-green-50"
                                                >
                                                    <FontAwesomeIcon icon={faWhatsapp} />
                                                </a>
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="border border-sky-500 text-sky-600 py-2 rounded-lg text-sm flex items-center justify-center hover:bg-sky-50"
                                                >
                                                    <FontAwesomeIcon icon={faInfoCircle} />Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            ))}
                        </div>
                        {slice < filteredProducts.length && (
                            <div className="flex justify-center mt-10">
                                <button onClick={handleLoadMore} className="w-1/8 bg-white hover:bg-percussion hover:text-white text-percussion py-2 rounded-lg border border-percussion">Load More</button>
                            </div>
                        )}
                        </>

                    ) : (
                        // Empty state
                        <div className="text-center py-16">
                            <i className="fas fa-search text-gray-400 text-6xl mb-4"></i>
                            <h3 className="text-xl text-gray-500 mb-2">No products found.</h3>
                            <p className="text-gray-400 mb-4">
                                Try a different search or clear the filters.
                            </p>
                            <Link
                                href="/products"
                                className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                            >
                                Browse all Products
                            </Link>
                        </div>
                    )}
                    </div>
                )}
            </section>

            {/* Quick Contact */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-semibold mb-3">
                        Don’t find what you need?
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Contact us directly and we&apos;ll help you find the perfect
                        instrument.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="https://wa.me/593996888655"
                            target="_blank"
                            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} className="mr-2"/>WhatsApp
                        </a>
                        <a
                            href="mailto:info@percusionecuador.com"
                            className="px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2"/>Email
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
