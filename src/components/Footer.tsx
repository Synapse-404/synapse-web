import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top content-width">
        <div>
          <p className="eyebrow footer-eyebrow"><span className="eyebrow-dot" /> DESDE QUIBDÓ, CHOCÓ</p>
          <h2>Las ideas cambian<br /><span>realidades.</span></h2>
          <Link className="footer-action" href="/#contacto">Hagamos parte del cambio <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="footer-right">
          <p>Un espacio para investigar, crear tecnología y generar conocimiento que aporte al territorio.</p>
          <div className="footer-links">
            <div><span>EXPLORA</span><Link href="/proyectos">Proyectos</Link><Link href="/publicaciones">Publicaciones</Link><Link href="/equipo">Equipo</Link><Link href="/blog">Bitácora</Link><Link href="/seguimiento">Estado de admisión</Link></div>
            <div><span>ENCUÉNTRANOS</span><a href="https://github.com/Synapse-404" rel="noopener noreferrer" target="_blank">GitHub ↗</a><Link href="/#identidad">Nuestra historia</Link><Link href="/#contacto">Vinculación</Link></div>
          </div>
        </div>
      </div>
      <div className="footer-bottom content-width">
        <Link href="/" aria-label="Volver al inicio" className="footer-brand">
          <Image
            src="/synapse-brandmark-v3.png"
            width={186}
            height={217}
            alt=""
            aria-hidden="true"
            unoptimized
            className="footer-brand-symbol"
          />
          <span className="footer-brand-name">
            <Image
              src="/synapse-logotype-v3.png"
              width={745}
              height={139}
              alt="SYNAPSE"
              unoptimized
              className="footer-logo"
            />
            <span className="footer-brand-caption">SEMILLERO DE INVESTIGACIÓN</span>
          </span>
        </Link>
        <span>SEMILLERO DE INVESTIGACIÓN · UNICLARETIANA</span>
        <span>QUIBDÓ, CHOCÓ · COLOMBIA</span>
        <Link href="#contenido">VOLVER ARRIBA ↑</Link>
      </div>
    </footer>
  );
}
