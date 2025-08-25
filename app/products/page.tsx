
import { createClient } from "@/lib/supabase/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Product, Category } from "@/app/utils/types";
import ProductsGrid from "@/components/productsGrid";
import Header from "@/components/header";
import QuickContact from "@/components/quickContact";

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
                created_at,
                bucket_id,
                image_name
                `);
    if (error) {
        return <div>Error: {error.message}</div>;
    }


    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*");
    if (categoriesError) {
        return <div>Error: {categoriesError.message}</div>;
    }

    const productsArray: Product[] = productsData as unknown as Product[];
    const categories: Category[] = categoriesData as unknown as Category[];

    const products = productsArray.map(product => {
        const productImage = product.image_name ? supabase.storage.from(product.bucket_id).getPublicUrl(product.image_name) : null;
        return {
            ...product,
            image: productImage?.data.publicUrl || ''
        };
    });

    console.log(products);

    const totalProducts = products.length;

    return (
        <div>
            {/* Page Header */}
            <Header
                currentPage="Productos"
                title="Nuestros Productos"
                description="Descubre nuestra amplia gama de instrumentos de percusión de las mejores marcas del mundo."
                count={totalProducts}
                countDescription="Productos Disponibles"
            />

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
            <QuickContact />
        </div>
    );
}
