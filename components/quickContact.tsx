import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function QuickContact() {
    return (


        <section className="bg-cyan-600 text-white py-12">
            <div className="container mx-auto px-6 grid md:grid-cols-2 items-center">
                <div>
                    <h3 className="text-2xl font-bold mb-2">¿Necesitas ayuda eligiendo?</h3>
                    <p className="text-lg">
                        Nuestros expertos pueden ayudarte a encontrar el instrumento
                        perfecto para tu nivel y estilo musical.
                    </p>
                </div>
                <div className="flex gap-3 mt-6 md:mt-0 justify-end">
                    <Link
                        href="https://wa.me/593996888655"
                        target="_blank"
                        className="bg-white text-cyan-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                    </Link>
                    <Link
                        href="mailto:info@percusionecuador.com"
                        className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-cyan-600 font-semibold"
                    >
                        <FontAwesomeIcon icon={faEnvelope} /> Email
                    </Link>
                </div>
            </div>
        </section>
    )
}