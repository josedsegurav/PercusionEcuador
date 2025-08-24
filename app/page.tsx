
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEnvelope, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faDrum } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/productCard";

export default async function Home() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");
  const { data: products } = await supabase.from("products").select("*");


  const productCount = products?.length || 0;
  const bestseller = products?.find((product) => product.stock_quantity < 10)
  const latest = products?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
  const onSale = products?.find((product) => product.stock_quantity > 30)


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-900 to-percussion text-white py-20 lg:py-32" id="inicio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                El ritmo que te inspira...
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Descubre la más amplia selección de instrumentos de percusión en Ecuador.
                14+ años de experiencia apoyando tu música.
              </p>

              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="space-y-2">
                  <span className="text-5xl font-bold block">14+</span>
                  <small className="text-gray-300">Años de Experiencia</small>
                </div>
                <div className="space-y-2">
                  <span className="text-5xl font-bold block">{productCount}+</span>
                  <small className="text-gray-300">Productos Disponibles</small>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#productos"
                  className="bg-percussion hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5 mr-2" />
                  Ver Productos
                </a>
                <a
                  href="https://wa.me/593996888655"
                  className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 mr-2" />
                  Mensaje WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
              <div className="w-50 h-50 rounded-full flex items-center justify-center mx-auto mb-6 bg-white">
                <Image src="/perc.png" alt="Drum" width={160} height={160} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Productos Premium</h3>
              <p className="text-gray-200">Importamos de marcas internacionales reconocidas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white" id="categorias">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Categorías</h2>
            <p className="text-xl text-gray-600">Encuentra exactamente lo que necesitas.</p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {categories?.map((category) => (
              <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <FontAwesomeIcon icon={faDrum} className="text-3xl text-percussion" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-gray-900">
                  <a href={`/productos?categoria=${category.id}`} className="hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </a>
                </h4>
                <p className="text-gray-600 mb-6">{category.description}</p>

              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/categories" className="bg-transparent border-2 border-percussion text-percussion hover:bg-percussion hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center">
              Ver Todas las Categorías
              <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50" id="productos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-xl text-gray-600">Más vendidos y recomendados</p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {/* Bestseller Product */}
            <ProductCard product={bestseller} badge="top" />

            {/* Latest Product */}
            <ProductCard product={latest} badge="latest" />

            {/* Sale Product */}
            <ProductCard product={onSale} badge="sale" />
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="bg-transparent border-2 border-percussion text-percussion hover:bg-percussion hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center">
              Ver Todos los Productos
              <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white" id="nosotros">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Acerca de Percusión Ecuador</h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Nos establecimos en el 2011, convirtiéndonos en la primera tienda ecuatoriana especializada en accesorios de percusión. Nos esforzamos por brindar el mejor servicio con las mejores marcas nacionales e internacionales.
            </p>
            <p>
              También ofrecemos educación continua a través de certificaciones y clases para percusionistas, bateristas, educadores y músicos en general. Estamos avalados por el Centro de Estudios Mariátegui, que mantiene un convenio con el Ministerio de Educación (MEC) 1965.
            </p>
            <p>
              Hemos participado en los principales festivales de percusión del Ecuador, como el Festival Internacional de Percusión, Ecuador Drum Fest, Drum Off, Bata Fest y Bataka Fest, donde hemos participado como expositores de Percusión Corporal y con nuestro stand de accesorios e instrumentos.
            </p>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50" id="contacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-xl text-gray-600">Múltiples canales para brindarte la mejor atención</p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {/* WhatsApp Card */}
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faWhatsapp} className="w-10 h-10 text-white text-5xl" />
              </div>
              <h4 className="text-xl font-semibold mb-4">WhatsApp Business</h4>
              <p className="text-gray-600 mb-6">Respuesta rápida a todos los requerimientos</p>
              <Link href="https://wa.me/593996888655" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center">
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 mr-2 text-2xl" />
                Chatear Ahora
              </Link>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faEnvelope} className="w-10 h-10 text-white text-4xl" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Correo Electrónico</h4>
              <p className="text-gray-600 mb-6">Consultas detalladas y cotizaciones.</p>
              <Link href="mailto:info@percusionecuador.com" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mr-2 text-xl" />
                Enviar Email
              </Link>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faFacebook} className="w-10 h-10 text-white text-4xl" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Redes Sociales</h4>
              <p className="text-gray-600 mb-6">Síguenos para estar al día</p>
              <div className="flex justify-center space-x-3">
                <Link href="https://www.facebook.com/percusionecuador" className="bg-blue-600 hover:bg-blue-700 text-white w-15 h-15 rounded-full flex items-center justify-center transition-colors duration-300">
                  <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 text-3xl" />
                </Link>
                <Link href="https://www.instagram.com/percusion_ec/" className="bg-pink-600 hover:bg-pink-700 text-white w-15 h-15 rounded-full flex items-center justify-center transition-colors duration-300">
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-3xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
