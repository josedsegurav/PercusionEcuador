"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faDrum, faEye, faBox, faStore, faCartPlus, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Product, Category } from "@/app/utils/types";
import { useState } from "react";


export default function ProductsGrid({
    categoriesList,
    productsList
}: {
    categoriesList: Category[],
    productsList: Product[],

}) {
    const [filters, setFilters] = useState<{ search: string | null, categoryId: string | number }>({ search: null, categoryId: "all" });
    const [sortBy, setSortBy] = useState<string>("");
    const [products] = useState<Product[]>(productsList);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsList);

    const [categories] = useState<Category[]>(categoriesList);
    const [slice, setSlice] = useState<number>(10);

    const handleSearchByCategory = async (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        console.log(newFilters);

        let result = products;

        if (newFilters.categoryId !== "all") {

            result = result.filter((product) => product.categories?.id == newFilters.categoryId);
        }

        if (newFilters.search !== null) {
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
                                                        <FontAwesomeIcon icon={faDrum} className="text-6xl" />
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
                                                        href={`/products/${product.name.replace(" ", "-")}-${product.id}`}
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
                                                        href={`/products/${product.name.replace(/ /g, '-')}-${product.id}`}
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
                                                            href={`/products/${product.name.replace(/ /g, '-')}-${product.id}`}
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

            </section>
        </div>

    )
}