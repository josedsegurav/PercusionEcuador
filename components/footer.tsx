import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDrum, faEnvelope, faMapMarkerAlt, faPhone, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default async function Footer() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from("categories").select("*");
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Logo & About */}
          <div className="col-span-2">
            <h5 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faDrum} className="mr-2" />
              Percusion Ecuador
            </h5>
            <p className="text-gray-300 leading-relaxed">
              Your percussion instrument specialist since 2010. Quality,
              experience, and a passion for music in every product we offer.
            </p>
            <div className="flex space-x-3 mt-4">
              <a
                href="https://wa.me/593996888655"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a
                href="https://www.facebook.com/percusionecuador"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/percusion_ec/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 transition"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="mailto:info@percusionecuador.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h6 className="text-lg font-semibold mb-4">Products</h6>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-gray-300 hover:text-blue-400 transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h6 className="text-lg font-semibold mb-4">Help</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400">My Account</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400">Track Order</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400">Shipping</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400">Refunds</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="text-lg font-semibold mb-4">Contact</h6>
            <div className="space-y-3 text-gray-300">
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Quito, Ecuador
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                <a
                  href="https://wa.me/593996888655"
                  className="hover:text-blue-400"
                >
                  +593 99 688 8655
                </a>
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                <a
                  href="mailto:info@percusionecuador.com"
                  className="hover:text-blue-400"
                >
                  info@percusionecuador.com
                </a>
              </p>
              <p>
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                <a
                  href="https://percusionecuador.com"
                  className="hover:text-blue-400"
                >
                  percusionecuador.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <p>&copy; 2025 Percusion Ecuador. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-blue-400">Terms and Conditions</a>
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
