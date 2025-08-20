import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export default function Header({
    currentPage,
    title,
    description,
    count,
    countDescription
    }: {
    currentPage: string,
    title: string,
    description: string,
    count: number,
    countDescription: string
}) {
    return (


        <section className="flex items-center bg-gradient-to-r from-cyan-900 to-percussion py-28 mt-16">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <nav className="mb-3 text-sm">
                        <ol className="flex gap-2 text-white/80">
                            <li>
                                <Link href="/" className="hover:underline">
                                    <FontAwesomeIcon icon={faHome} /> Inicio
                                </Link>
                            </li>
                            <li className="text-white">{currentPage}</li>
                        </ol>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        {title}
                    </h1>
                    <p className="text-white/80 text-lg">
                        {description}
                    </p>
                </div>
                <div className="text-right text-white">
                    <span className="text-4xl font-bold block">{count}</span>
                    <small className="opacity-75 text-base">{countDescription}</small>
                </div>
            </div>
        </section>
    )
}