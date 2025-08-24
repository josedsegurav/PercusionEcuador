
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuantitySet from "@/components/quantitySet";
import { Product } from "@/app/utils/types";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faCheckCircle, faDrum, faEnvelope, faStore, faTag, faTimesCircle } from "@fortawesome/free-solid-svg-icons";


export default async function ProductPage({ params, }: { params: Promise<{ slug: string }> }) {

    const slugArray = (await params).slug.split('-');
    const id = slugArray.pop();
    const slug = slugArray.join('-');

    const supabase = await createClient();


    const { data: productData, error } = await supabase.from('products').select(`
    id,
    name,
    description,
    selling_price,
    stock_quantity,
    categories (id, name),
    vendors (id, name),
    created_at
  `).eq('id', id).single();

    if (error) {
        return notFound();
    }

    const product: Product = productData as unknown as Product;

    const { data: relatedProductsData, error: relatedProductsError } = await supabase.from('products').select(`
    id,
    name,
    description,
    selling_price,
    stock_quantity,
    categories (id, name),
    vendors (id, name),
    created_at
    `).eq('category_id', product.categories?.id).neq('id', id).limit(4);

    if (relatedProductsError) {
        return notFound();
    }

    const relatedProducts: Product[] = relatedProductsData as unknown as Product[];

    if (slug !== product.name.replaceAll(" ", "-")) {
        redirect(`${product.name.replaceAll(" ", "-")}-${product.id}`);
    }

    return (
        <div className="pt-20">
            {/* Breadcrumb */}
            <section className="bg-gray-100 py-3">
                <div className="max-w-6xl mx-auto px-4">
                    <nav className="text-sm text-gray-600">
                        <ol className="flex gap-2">
                            <li>
                                <Link href="/" className="hover:underline">Inicio</Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/products" className="hover:underline">Productos</Link>
                            </li>
                            {product?.categories && (
                                <>
                                    <li>/</li>
                                    <li>
                                        <Link href={`/categories/${product.categories.id}`} className="hover:underline">
                                            {product.categories.name}
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>/</li>
                            <li className="font-semibold text-gray-800">{product?.name}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {/* Product Details */}
            <section className="py-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                    {/* Product Image */}
                    <div>
                        {product?.image ? (
                            <div className="relative h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                <Image
                                    src={product?.image}
                                    alt={product?.name}
                                    id="mainProductImage"
                                    className="w-full h-full object-contain cursor-zoom-in"
                                    width={500}
                                    height={500}
                                />

                                {/* Badges */}
                                <div className="absolute top-3 left-3 space-y-1">
                                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                        <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded">Pocas unidades</span>
                                    )}
                                    {product.stock_quantity === 0 && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Agotado</span>
                                    )}
                                    {new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Nuevo</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
                                <div className="text-center text-gray-400">
                                    <FontAwesomeIcon icon={faDrum} />
                                    <p>No hay imagen disponible</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {product?.categories && (
                            <Link
                                href={`/categories/${product.categories.id}`}
                                className="inline-block mb-3 bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded"
                            >
                                <FontAwesomeIcon icon={faTag} />{product.categories.name}
                            </Link>
                        )}

                        <h1 className="text-3xl font-bold mb-3">{product?.name}</h1>

                        <div className="text-2xl text-blue-600 font-bold mb-5">
                            ${product?.selling_price}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-5">
                            {product && product?.stock_quantity > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    <span>En stock ({product?.stock_quantity} disponibles)</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                    <span>Agotado</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {product?.description && (
                            <div className="mb-5">
                                <h5 className="font-semibold mb-2">Descripción</h5>
                                <p className="text-gray-600">{product?.description}</p>
                            </div>
                        )}

                        {/* Vendor */}
                        {product?.vendors && (
                            <div className="bg-gray-100 rounded-lg p-3 mb-5">
                                <h6 className="font-semibold mb-1">
                                    <FontAwesomeIcon icon={faStore} />Compañía/Marca
                                </h6>
                                <p className="text-gray-600">{product?.vendors.name}</p>
                            </div>
                        )}

                        {/* Purchase Section */}
                        {product && product?.stock_quantity > 0 ? (
                            <QuantitySet initialQuantity={1} product={product} />
                        ) : (
                            <button className="bg-gray-400 text-white px-6 py-3 rounded-lg w-full" disabled>
                                <FontAwesomeIcon icon={faTimesCircle} />Agotado
                            </button>
                        )}

                        {/* Contact Options */}
                        <div className="mt-8">
                            <h6 className="font-semibold mb-3">¿Alguna pregunta?</h6>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href={`https://wa.me/593996888655?text=Hola, tengo una pregunta sobre: ${product?.name}`}
                                    target="_blank"
                                    className="bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} />WhatsApp
                                </Link>
                                <Link
                                    href={`mailto:info@percusionecuador.com?subject=Pregunta sobre ${product?.name}`}
                                    className="border border-blue-600 text-blue-600 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50"
                                >
                                    <FontAwesomeIcon icon={faEnvelope} />Email
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="py-10">
                    <div className="max-w-6xl mx-auto px-4">
                        <h3 className="text-center font-bold text-xl mb-8">Productos relacionados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((rp) => (
                                <div key={rp.id} className="border rounded-lg shadow-sm overflow-hidden">
                                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                                        {rp.image ? (
                                            <Image src={rp.image} alt={rp.name} className="w-full h-full object-cover" width={500} height={500} />
                                        ) : (
                                            <FontAwesomeIcon icon={faDrum} />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h6 className="font-semibold mb-2">
                                            <Link href={`/products/${rp.id}`} className="hover:underline">
                                                {rp.name}
                                            </Link>
                                        </h6>
                                        <div className="text-blue-600 font-bold mb-3">${rp.selling_price}</div>
                                        <Link
                                            href={`/products/${rp.id}`}
                                            className="border border-blue-600 text-blue-600 py-2 px-3 rounded-lg block text-center hover:bg-blue-50"
                                        >
                                            Ver producto
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
