
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Product, Category } from "@/app/utils/types";
import ProductsGrid from "@/components/productsGrid";

export default async function Products() {
    const supabase = await createClient();


    const { data: productsData, error } = await supabase
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
        return <div>Error: {error.message}</div>;
    }

    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*");
    if (categoriesError) {
        return <div>Error: {categoriesError.message}</div>;
    }

    const products: Product[] = productsData as unknown as Product[];
    const categories: Category[] = categoriesData as unknown as Category[];

    console.log(products);

    const totalProducts = products.length;

    return (
        <div>
            {/* Page Header */}
            <section className="bg-gradient-to-r from-sky-600 to-sky-400 py-24">
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

            {/* Products Grid */}
            {products ? (
                <ProductsGrid
                    categoriesList={categories}
                    productsList={products}

                />
            ) : (
                <div className="text-center py-16">
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin text-gray-400 text-6xl mb-4" />
                    <h3 className="text-xl text-gray-500 mb-2">Loading...</h3>
                </div>
            )}



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
                            <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />WhatsApp
                        </a>
                        <a
                            href="mailto:info@percusionecuador.com"
                            className="px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />Email
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
