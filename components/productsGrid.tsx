"use client";

import Link from "next/link";
import { Product, Category } from "@/app/utils/types";
import { useState } from "react";
import ProductCard from "./productCard";


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
            <section className="py-6 container mx-auto px-6 bg-white">
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
                                        <ProductCard key={product.id} product={product} badge="product" />
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