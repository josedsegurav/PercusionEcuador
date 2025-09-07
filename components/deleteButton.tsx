'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Category, Product, User } from '@/app/utils/types';

function isProduct(item: Product | Category | User): item is Product {
    return 'bucket_id' in item && 'image_name' in item;
}

export default function DeleteButton({ href, item, itemData, table, }: { href: string, item: string, itemData: Product | Category | User, table: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const [deleteForm, setDeleteForm] = useState(false);
    const [id, setId] = useState<number>();
    const [idError, setIdError] = useState(false);
    console.log(itemData.id)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (itemData.id == id) {
            setIsLoading(true);

            // Only delete image if it's a product
            if (table === 'products' && isProduct(itemData)) {
                try {
                    console.log("Deleting image")
                    const { error } = await supabase.storage
                        .from(`${itemData.bucket_id}`)
                        .remove([`${itemData.image_name}`]);

                    if (error) {
                        console.error('Delete image failed:', error);
                    }
                    console.log("img deleted")
                } catch (err) {
                    console.error('Unexpected error deleting image:', err);
                }
            }

            try {
                console.log("Deleting item")
                console.log("id", itemData.id)
                const { error } = await supabase.from(`${table}`).delete().eq('id', itemData.id);

                if (error) {
                    console.error(error);
                } else {
                    console.log("item deleted")
                    router.push(`${href}${table}`);
                }

            } catch (err) {
                console.error('Unexpected error deleting item:', err);
            }


        } else {
            setIdError(true)
        }
    };

    const handleCancel = () => {
        setDeleteForm(false);
        setIdError(false);
    }



    return (
        <>
            {deleteForm ? (
                <div className="bg-gradient-to-r from-red-600 to-white flex rounded-lg gap-4 flex items-center justify-center p-4 flex-col">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Borrar {item}</h1>
                        <p className="text-gray-700 mb-2 font-bold">¿Estás seguro de querer borrar este item?</p>
                        <p className="text-gray-700 mb-2 font-bold">Esta acción es irreversible.</p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="number"
                                className="border bg-white border-gray-300 rounded-lg p-2"
                                placeholder={`Ingrese el ID de ${item}`}
                                onChange={(e) => setId(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                            <button
                                type='submit'
                                className="bg-red-500 text-white inline-flex items-center ml-2 px-4 py-2 text-white hover:bg-red-800 rounded-lg transition-colors font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? <FontAwesomeIcon icon={faSpinner} className={`text-sm mr-2 animate-spin`} /> : <FontAwesomeIcon icon={faTrash} className="text-sm mr-2" />}
                                Borrar
                            </button>
                            {idError ? <p className='mt-2 font-bold'>El ID no es correcto</p> : ''}
                        </form>
                    </div>
                    {isLoading ? '' : <button
                        onClick={handleCancel}
                        className="bg-green-500 text-white inline-flex items-center ml-2 px-4 py-2 text-white hover:bg-green-800 rounded-lg transition-colors font-medium"
                    >
                        Cancelar
                    </button>}
                </div>
            ) : (
                <button
                    onClick={() => setDeleteForm(true)}
                    className="bg-red-500 text-white inline-flex items-center px-4 py-2 text-gray-700 hover:bg-red-800 rounded-lg transition-colors font-medium"
                >
                    <FontAwesomeIcon icon={faTrash} className="text-sm mr-2" />
                    Borrar
                </button>
            )}
        </>
    );
};
