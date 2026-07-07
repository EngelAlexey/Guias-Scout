import { SiteHeader } from "@/components/site-header";

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="main-content">
        <section className="hero" aria-labelledby="home-title">
          <div className="hero__content">
            <p className="eyebrow">Proyecto TCU - base inicial</p>
            <h1 id="home-title">Grupo 35 de Guias y Scouts</h1>
            <p className="hero__lead">
              Repositorio base para construir el sitio web del grupo, con
              Next.js, TypeScript y Supabase preparados para los modulos futuros.
            </p>
            <div className="status-row" aria-label="Estado tecnico">
              <span className="status-pill">Next.js App Router</span>
              <span className="status-pill">TypeScript</span>
              <span className="status-pill">
                Supabase {supabaseConfigured ? "configurado" : "pendiente"}
              </span>
            </div>
          </div>

          <aside className="summary-panel" aria-label="Resumen del alcance">
            <h2>Alcance actual</h2>
            <ul className="summary-list">
              <li>
                <strong>Base del repositorio</strong>
                <span>Estructura inicial, scripts y convenciones tecnicas.</span>
              </li>
              <li>
                <strong>Backend previsto</strong>
                <span>
                  Supabase queda preparado para autenticacion, datos, imagenes y
                  metricas ambientales.
                </span>
              </li>
              <li>
                <strong>Sin modulos finales</strong>
                <span>
                  Aun no se implementan galeria, formularios, panel
                  administrativo ni metricas.
                </span>
              </li>
            </ul>
          </aside>
        </section>

        <section className="section-grid" aria-label="Documentacion inicial">
          <article className="info-card" id="propuesta">
            <span className="info-card__accent" aria-hidden="true" />
            <h2>Propuesta TCU</h2>
            <p>
              La documentacion formal resume el objetivo, alcance inicial y
              modulos futuros del proyecto.
            </p>
          </article>
          <article className="info-card" id="reglas">
            <span className="info-card__accent" aria-hidden="true" />
            <h2>Reglas tecnicas</h2>
            <p>
              El flujo de ramas queda definido con dev, qa y main para ordenar
              desarrollo, validacion y publicacion.
            </p>
          </article>
          <article className="info-card" id="supabase">
            <span className="info-card__accent" aria-hidden="true" />
            <h2>Supabase</h2>
            <p>
              Las variables publicas estan declaradas, pero las tablas,
              politicas RLS y autenticacion se configuraran despues.
            </p>
          </article>
        </section>

        <p className="footer-note">
          Esta pantalla es un placeholder tecnico para confirmar que la base de
          la aplicacion funciona antes de iniciar el desarrollo de funcionalidades
          completas.
        </p>
      </main>
    </div>
  );
}
