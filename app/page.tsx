
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faDrum } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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
      <section className="bg-percussion text-white py-20 lg:py-32" id="inicio">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center justify-center"
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
                <a href={`/categorias/${category.id}`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 inline-flex items-center">
                  Explorar productos
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/categorias" className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center">
              Ver Todas las Categorías
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
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
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                {bestseller.image ? (
                  <Image
                    src={bestseller.image}
                    alt={bestseller.name}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                ) : (
                  <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )}
                <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Más Vendido
                </span>
              </div>
              <div className="p-6">
                <h5 className="text-xl font-semibold mb-3">{bestseller.name}</h5>
                <p className="text-gray-600 mb-4">{bestseller.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">${bestseller.selling_price.toFixed(2)}</div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h16M16 16a2 2 0 11-4 0 2 2 0 014 0zM8 16a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al Carrito
                </button>
              </div>
            </div>

            {/* Latest Product */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                {latest.image ? (
                  <Image
                  alt={latest.name}
                  src={latest.image}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                ) : (
                  <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )}
                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Nuevo
                </span>
              </div>
              <div className="p-6">
                <h5 className="text-xl font-semibold mb-3">{latest.name}</h5>
                <p className="text-gray-600 mb-4">{latest.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">${latest.selling_price.toFixed(2)}</div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h16M16 16a2 2 0 11-4 0 2 2 0 014 0zM8 16a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al Carrito
                </button>
              </div>
            </div>

            {/* Sale Product */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                {onSale.image ? (
                  <Image
                    src={onSale.image}
                    alt={onSale.name}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                ) : (
                  <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )}
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Oferta
                </span>
              </div>
              <div className="p-6">
                <h5 className="text-xl font-semibold mb-3">{onSale.name}</h5>
                <p className="text-gray-600 mb-4">{onSale.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">${onSale.selling_price.toFixed(2)}</div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h16M16 16a2 2 0 11-4 0 2 2 0 014 0zM8 16a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center">
              Ver Todos los Productos
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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

          <div className="flex justify-center space-x-6 mt-10">
              <Link href="https://wa.me/593996888655" className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-colors duration-300" target="_blank">
              <FontAwesomeIcon icon={faWhatsapp} />
            </Link>
            <Link href="https://www.facebook.com/percusionecuador" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-300" target="_blank">
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link href="https://www.instagram.com/percusion_ec/" className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center text-white transition-colors duration-300" target="_blank">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link href="mailto:info@percusionecuador.com" className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors duration-300" target="_blank">
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
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
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">WhatsApp Business</h4>
              <p className="text-gray-600 mb-6">Respuesta rápida a todos los requerimientos</p>
              <Link href="https://wa.me/593996888655" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                </svg>
                Chatear Ahora
              </Link>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Correo Electrónico</h4>
              <p className="text-gray-600 mb-6">Consultas detalladas y cotizaciones.</p>
              <Link href="mailto:info@percusionecuador.com" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar Email
              </Link>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-linear-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Redes Sociales</h4>
              <p className="text-gray-600 mb-6">Síguenos para estar al día</p>
              <div className="flex justify-center space-x-3">
                <Link href="https://www.facebook.com/percusionecuador" className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
                <Link href="https://www.instagram.com/percusion_ec/" className="bg-pink-600 hover:bg-pink-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
