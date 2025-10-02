"use client"
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBox, faStore, faCartPlus, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faDrum } from "@fortawesome/free-solid-svg-icons";
import { Product } from "@/app/utils/types";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductCard({ product, badge }: { product: Product, badge: string }) {
    const { addToCart } = useCartStore();
    const router = useRouter();


    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            stock: product.stock_quantity,
            image: product.image || '',
            selling_price: product.selling_price,
            quantity: 1,
        });

        toast(
            "Producto agregado al carrito",
            {
                description: "El producto ha sido agregado al carrito",
                action: {
                    label: "Ver carrito",
                    onClick: () => {
                        router.push("/cart");
                    }
                }
            }
        )
    }
    return (

        <div
            key={product.id}
            className="rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
        >
            <div className="relative h-64 bg-gray-100">
                {product.image_name ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="10"
                        className="object-cover"
                    />

                ) : (
                    <div className="flex items-center justify-center h-full text-sky-500 opacity-40">
                        <FontAwesomeIcon icon={faDrum} className="text-6xl" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-1">
                    {badge === "product" && product.stock_quantity <= 5 && (
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded text-xs font-semibold">
                            Few Stock
                        </span>
                    )}
                    {badge === "product" && new Date(product.created_at) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                            <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold">
                                New
                            </span>
                        )}
                    {badge === "top" && <span className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold">
                        Más Vendido
                    </span>}
                    {badge === "latest" && <span className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold">
                        Nuevo
                    </span>}
                    {badge === "sale" && <span className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
                        Oferta
                    </span>}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3">
                    <Link
                        href={`/products/${product.name.replace(/ /g, '-')}-${product.id}`}
                        className="w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-gray-100"
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
                        <button
                            onClick={() => handleAddToCart()}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg">
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
                        <Link
                            href={`https://wa.me/593996888655?text=Hola, me interesa el producto: ${product.name}`}
                            target="_blank"
                            className="border border-green-500 text-green-600 py-2 rounded-lg text-sm flex items-center justify-center hover:bg-green-50"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </Link>
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
    )
}