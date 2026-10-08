"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SceneMessage = {
  source: "synapse-tunnel-parent";
  type: "state";
  progress: number;
  x: number;
  y: number;
  active: boolean;
  pointerActive: boolean;
};

const chapters = [
  {
    index: "01 / EXPLORACIÓN",
    title: <>Todo comienza<br />con una <em>pregunta.</em></>,
    text: "Investigamos lo que ocurre a nuestro alrededor para descubrir oportunidades donde otros solo ven desafíos.",
    tag: "CURIOSIDAD / TERRITORIO",
  },
  {
    index: "02 / CONOCIMIENTO",
    title: <>Mirar más allá<br />de los <em>datos.</em></>,
    text: "Conectamos ciencia, análisis e inteligencia artificial para entender mejor nuestro contexto.",
    tag: "DATOS / INTELIGENCIA ARTIFICIAL",
  },
  {
    index: "03 / CREACIÓN",
    title: <>Las ideas toman<br /><em>forma.</em></>,
    text: "Transformamos hallazgos en prototipos, software y soluciones que las personas pueden utilizar.",
    tag: "DISEÑO / INGENIERÍA",
  },
  {
    index: "04 / IMPACTO",
    title: <>El siguiente paso<br />es <em>transformar.</em></>,
    text: "Investigación aplicada que nace en el Chocó y busca generar valor más allá del laboratorio.",
    tag: "INNOVACIÓN / CHOCÓ",
  },
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Immersive scroll chapter. The standalone WebGL scene is isolated in an iframe
 * so its exact Three.js r143 importmap never changes Next.js' dependency graph.
 * Scroll remains on the parent document; messages carry its progress to the scene.
 */
export default function TunnelJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointerLastMoveRef = useRef(-Infinity);
  const nearRef = useRef(false);
  const readyRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setMotion = () => setReducedMotion(motionQuery.matches);
    setMotion();
    motionQuery.addEventListener("change", setMotion);

    const observer = new IntersectionObserver(
      ([entry]) => {
        nearRef.current = entry.isIntersecting;
        if (entry.isIntersecting) setStarted(true);
      },
      { rootMargin: "150px 0px 150px 0px", threshold: 0 },
    );
    observer.observe(section);

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / range);
      const nextChapter = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
      section.style.setProperty("--tunnel-progress", `${progress * 100}%`);
      setChapter(prev => prev === nextChapter ? prev : nextChapter);
      const payload: SceneMessage = {
        source: "synapse-tunnel-parent",
        type: "state",
        progress,
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        active: nearRef.current && !document.hidden && !motionQuery.matches,
        pointerActive: performance.now() - pointerLastMoveRef.current < 3000,
      };
      if (readyRef.current) frameRef.current?.contentWindow?.postMessage(payload, window.location.origin);
    };
    const onScroll = () => {
      if (raf === 0) raf = window.requestAnimationFrame(update);
    };
    const onPointer = (event: PointerEvent) => {
      mouseRef.current.x = event.clientX / window.innerWidth * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight * 2 - 1);
      pointerLastMoveRef.current = performance.now();
      onScroll();
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.source !== "synapse-tunnel-scene") return;
      if (event.data.type === "ready") {
        readyRef.current = true;
        update();
      }
      if (event.data.type === "error") setSceneFailed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("message", onMessage);
    document.addEventListener("visibilitychange", onScroll);
    update();

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      motionQuery.removeEventListener("change", setMotion);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="inmersion" className="tunnel-journey" aria-label="Experiencia inmersiva: de las ideas al impacto">
      <div className="tunnel-sticky">
        <div className="tunnel-scene-fallback" aria-hidden="true"><span /><span /><span /></div>
        {started && !reducedMotion && !sceneFailed && (
          <iframe
            ref={frameRef}
            className="tunnel-frame"
            title="Animación de túnel tridimensional SYNAPSE"
            src="/tunnel/index.html?embed=1"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => {
              // An importmap dependency can fail before the module runs; detect missing handshake.
              window.setTimeout(() => {
                if (!readyRef.current) setSceneFailed(true);
              }, 10000);
            }}
          />
        )}
        <div className="tunnel-vignette" aria-hidden="true" />
        <div className="tunnel-ui content-width">
          <div className="tunnel-topline">
            <span className="tunnel-kicker"><span className="tunnel-signal" /> SYNAPSE / EXPERIENCIA INMERSIVA</span>
            <span className="tunnel-coordinates">05°41′ N · 76°39′ O&nbsp;&nbsp; / &nbsp;&nbsp;CHOCÓ</span>
          </div>
          <div className="tunnel-story" key={chapter}>
            <span className="tunnel-chapter-num">{chapters[chapter].index}</span>
            <h2>{chapters[chapter].title}</h2>
            <p>{chapters[chapter].text}</p>
            <span className="tunnel-story-tag">{chapters[chapter].tag}</span>
          </div>
          <div className="tunnel-bottomline">
            <div className="tunnel-bottom-left">
              <span className="tunnel-wheel" aria-hidden="true"><span /></span>
              <span>DESLIZA PARA ATRAVESAR LA EXPERIENCIA</span>
            </div>
            <div className="tunnel-chapter-dots" aria-label={`Capítulo ${chapter + 1} de ${chapters.length}`}>
              {chapters.map((step, index) => <span key={step.index} className={index === chapter ? "is-current" : ""} />)}
            </div>
            <Link href="/proyectos" className="tunnel-exit-link">Explorar proyectos <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <span className="tunnel-vertical-label" aria-hidden="true">INVESTIGAR · CONSTRUIR · IMPACTAR</span>
        <div className="tunnel-progress-track" aria-hidden="true"><span /></div>
        {reducedMotion && <span className="sr-only">La animación 3D está desactivada por su preferencia de movimiento reducido.</span>}
        {sceneFailed && <span className="sr-only">No se pudo cargar WebGL. Se muestra una alternativa visual estática.</span>}
      </div>
    </section>
  );
}
