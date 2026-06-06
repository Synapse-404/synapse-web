import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-synapse-black py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5">
            <Link href="/">
                <Image src="/Recurso9.png" alt="SYNAPSE Logo" width={60} height={60} className="h-auto w-full object-contain" />
            </Link>
            <div className="font-mono text-[11.5px] text-white/75 text-center md:text-right leading-loose">
                Semillero de Investigación — Uniclaretiana
                <br />
                Quibdó, Chocó · Colombia
                <br />
                Investiga · Desarrolla · Impacta
            </div>
        </footer>
    );
};

export default Footer;