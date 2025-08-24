'use client'
import { Product } from "@/app/utils/types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import useCartStore from "@/store/cartStore";

export default function QuantitySet({ initialQuantity, product }: { initialQuantity: number, product: Product }) {
    const { addToCart } = useCartStore();

    const [quantity, setQuantity] = useState(initialQuantity);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        if (quantity < product.stock_quantity) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            stock: product.stock_quantity,
            image: product.image || '',
            selling_price: product.selling_price,
            quantity: quantity,
        });
    }
        return (
            <div>
                <label className="block font-semibold mb-2">Cantidad:</label>
                <div className="flex items-center gap-2 mb-5">
                    <button
                        onClick={decreaseQuantity}
                        className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        min={1}
                        max={product.stock_quantity}
                        readOnly
                        className="w-16 text-center border rounded"
                    />
                    <button
                        onClick={increaseQuantity}
                        className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <button onClick={handleAddToCart} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full">
                    <FontAwesomeIcon icon={faCartPlus} />Agregar al carrito
                </button>
            </div>

        );
}
