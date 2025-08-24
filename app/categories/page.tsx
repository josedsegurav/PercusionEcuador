import { createClient } from "@/lib/supabase/server";
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClock, faDrum, faEye, faHome, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Header from "@/components/header";
import QuickContact from "@/components/quickContact";

type OrderItem = {
    id: number
}

type Vendor = {
    id: number
    name: string
}

type Product = {
    id: number
    name: string
    image?: string
    selling_price: number
    order_items: OrderItem[]
    vendors: Vendor[]
}

type Category = {
    id: number
    name: string
    description?: string
    products: Product[]
}



export default async function CategoriesPage() {
    const supabase = await createClient();

    const { data: categoriesData, error } = await supabase
        .from("categories")
        .select(`id,
            name,
            description,
            products (id, name, selling_price, order_items (id))
            `);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const { data: vendorsData, error: vendorsError } = await supabase
        .from("vendors")
        .select("id, name");
    if (vendorsError) {
        return <div>Error: {vendorsError.message}</div>;
    }

    const categories: Category[] = categoriesData as unknown as Category[];
    const vendors: Vendor[] = vendorsData as unknown as Vendor[];

    const popularCategories: Category[] = categories.sort((a, b) => b.products.length - a.products.length).slice(0, 4);
    // const popularCategories: Category[] = categories.sort((a, b) => b.products.order_items.length - a.products.order_items.length).slice(0, 4);

    const categoryCount = categories.length;
    const productCategoriesCount = categories.reduce((acc, category) => acc + category.products.length, 0);
    const vendorCategoriesCount = vendors.length;
    return (
        <div>
            {/* Encabezado */}
            <Header
                currentPage="Categorías"
                title="Nuestras Categorías"
                description="Explora nuestra amplia selección de instrumentos de percusión organizados por categoría"
                count={categoryCount}
                countDescription="Categorías disponibles"
            />

            {/* Lista de categorías */}
            <section className="py-12 container mx-auto px-6">
                {categories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                id={category.name.toLowerCase().replace(/ /g, "-")}
                                className="border rounded-2xl shadow-md overflow-hidden flex flex-col"
                            >
                                {/* Encabezado categoría */}
                                <div className="flex justify-between items-center p-4 pb-0">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-700 to-sky-500 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faDrum} />
                                    </div>
                                    <span className="bg-gray-100 text-cyan-600 text-sm px-3 py-1 rounded-full">
                                        {category.products.length} productos
                                    </span>
                                </div>

                                {/* Contenido categoría */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h4 className="font-bold text-lg mb-2">
                                        <p>
                                            {category.name}
                                        </p>

                                    </h4>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        {category.description
                                            ? category.description
                                            : `Descubre nuestro catálogo de marcas de ${category.name.toLowerCase()}.`}
                                    </p>

                                    {/* Productos destacados */}
                                    {category.products.length > 0 && (
                                        <div className="mb-4">
                                            <h6 className="text-gray-500 font-semibold mb-2">
                                                Productos destacados:
                                            </h6>
                                            <div className="grid grid-cols-3 gap-2">
                                                {category.products.slice(0, 3).map((product) => (
                                                    <div key={product.id} className="relative group">
                                                        {product.image ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-20 object-cover rounded-lg"
                                                                width={500}
                                                                height={500}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-20 bg-gray-100 flex items-center justify-center rounded-lg">
                                                                <FontAwesomeIcon icon={faDrum} />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                            <Link
                                                                href={`/products/${product.id}`}
                                                                className="text-white"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rango de precios */}
                                    {category.products.length > 0 && (
                                        <div className="mb-4 flex justify-between text-sm text-gray-600">
                                            <span>Rango de precios:</span>
                                            <span className="font-semibold text-cyan-600">
                                                ${Math.min(...category.products.map((p) => p.selling_price))} - $
                                                {Math.max(...category.products.map((p) => p.selling_price))}
                                            </span>
                                        </div>
                                    )}

                                    {/* Botones */}
                                    <div className="mt-auto space-y-2">

                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href={`https://wa.me/593996888655?text=Hola, me interesan los productos de la categoría: ${category.name}`}
                                                target="_blank"
                                                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-2 py-1 rounded text-sm text-center"
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                                            </Link>
                                            {category.products.length > 0 ? (
                                                <Link
                                                    href={`/products/${category.products[0].id}`}
                                                    className="border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white px-2 py-1 rounded text-sm text-center"
                                                >
                                                    <FontAwesomeIcon icon={faStar} /> Destacado
                                                </Link>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="border border-gray-400 text-gray-400 px-2 py-1 rounded text-sm w-full"
                                                >
                                                    <FontAwesomeIcon icon={faClock} /> Próximamente
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Estado vacío */
                    <div className="text-center py-20">
                        <FontAwesomeIcon icon={faTag} />
                        <h3 className="text-gray-500 mb-2">No hay categorías disponibles</h3>
                        <p className="text-gray-400 mb-4">
                            Actualmente no hay categorías registradas en el sistema.
                        </p>
                        <Link
                            href="/"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg inline-block"
                        >
                            <FontAwesomeIcon icon={faHome} /> Volver al inicio
                        </Link>
                    </div>
                )}
            </section>

            <div className="text-center mt-6 mb-12">
                <Link href="/products" className="bg-transparent border-2 border-percussion text-percussion hover:bg-percussion hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center">
                    Ver Todos los Productos
                    <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 ml-2" />
                </Link>
            </div>

            {/* Estadísticas */}
            {categories.length > 0 && (
                <section className="bg-gray-50 py-12">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-cyan-600 mb-2">
                                {categoryCount}
                            </div>
                            <p className="text-gray-500">Categorías</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-600 mb-2">
                                {productCategoriesCount}
                            </div>
                            <p className="text-gray-500">Productos</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-600 mb-2">
                                {vendorCategoriesCount}
                            </div>
                            <p className="text-gray-500">Marcas</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-600 mb-2">14+</div>
                            <p className="text-gray-500">Años de experiencia</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Categorías populares */}
            {popularCategories.length > 0 && (
                <section className="py-12 container mx-auto px-6">
                    <h3 className="text-center text-2xl font-bold mb-8">
                        Categorías Populares
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {popularCategories.map((category) => (
                            <div
                                key={category.id}
                                className="border rounded-xl shadow-md overflow-hidden flex"
                            >
                                <div className="w-1/3 bg-gradient-to-r from-cyan-700 to-sky-500 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faDrum} />
                                </div>
                                <div className="w-2/3 p-4">
                                    <h5 className="font-bold mb-1">
                                        <Link
                                            href={`/products?category_id=${category.id}`}
                                            className="hover:underline"
                                        >
                                            {category.name}
                                        </Link>
                                    </h5>
                                    <p className="text-gray-500 text-sm mb-3">
                                        {category.products.length} productos disponibles
                                    </p>
                                    <Link
                                        href={`/products?category_id=${category.id}`}
                                        className="border border-cyan-600 text-cyan-600 px-3 py-1 rounded hover:bg-cyan-600 hover:text-white text-sm inline-flex items-center"
                                    >
                                        Ver productos <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Contacto rápido */}
            <QuickContact />
        </div>
    )
}
