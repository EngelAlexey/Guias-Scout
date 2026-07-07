export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="/" aria-label="Inicio Grupo 35">
          <span className="brand__mark" aria-hidden="true">
            G35
          </span>
          <span className="brand__text">
            <span className="brand__name">Grupo 35</span>
            <span className="brand__meta">Guias y Scouts</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Navegacion principal">
          <a href="#propuesta">Propuesta</a>
          <a href="#reglas">Reglas</a>
          <a href="#supabase">Supabase</a>
        </nav>
      </div>
    </header>
  );
}
