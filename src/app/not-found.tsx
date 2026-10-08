import Link from "next/link";
import "@/styles/not-found.css";

/**
 * Estado 404: composición cinematográfica que reutiliza el video y
 * la paleta visual de SYNAPSE. No modifica la navegación ni el footer.
 */
export default function NotFound() {
  return (
    <section className="synapse-404" aria-labelledby="synapse-404-title">
      <div className="synapse-404__media" aria-hidden="true">
        <div className="synapse-404__poster" />
        <video
          className="synapse-404__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/metal-human.jpg"
          disablePictureInPicture
        >
          <source src="/metal-human.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="synapse-404__mesh" aria-hidden="true" />
      <div className="synapse-404__orbit synapse-404__orbit--first" aria-hidden="true" />
      <div className="synapse-404__orbit synapse-404__orbit--second" aria-hidden="true" />
      <div className="synapse-404__cross synapse-404__cross--top" aria-hidden="true">+</div>
      <div className="synapse-404__cross synapse-404__cross--bottom" aria-hidden="true">+</div>

      <div className="synapse-404__container content-width">
        <div className="synapse-404__topline">
          <span><i className="synapse-404__pulse" /> SISTEMA / SYNAPSE</span>
          <span>ESTADO: RUTA NO ENCONTRADA</span>
        </div>

        <div className="synapse-404__body">
          <p className="synapse-404__index">ERROR 404 <span aria-hidden="true">—</span> COORDENADAS DESCONOCIDAS</p>
          <div className="synapse-404__number" aria-hidden="true">
            <span>4</span><span className="synapse-404__zero">0</span><span>4</span>
          </div>
          <h1 id="synapse-404-title">Perdimos la <em>señal.</em></h1>
          <p className="synapse-404__description">
            Esta ruta no forma parte de nuestro universo de investigación.
            Regresa al inicio o continúa explorando lo que estamos creando.
          </p>
          <div className="synapse-404__actions">
            <Link className="synapse-404__button synapse-404__button--primary" href="/">
              Volver al inicio <span aria-hidden="true">↗</span>
            </Link>
            <Link className="synapse-404__button synapse-404__button--secondary" href="/proyectos">
              Explorar proyectos <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="synapse-404__baseline" aria-hidden="true">
          <span>04 / SISTEMA DE NAVEGACIÓN</span>
          <span>INVESTIGACIÓN · TECNOLOGÍA · TERRITORIO</span>
          <span>QUIBDÓ, CHOCÓ</span>
        </div>
      </div>
    </section>
  );
}
