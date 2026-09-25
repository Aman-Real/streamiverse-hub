import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { APP_CONFIG, getCopyrightYear } from "@/config/app.config";

const FOOTER_LINKS = [
  { label: "Movies", path: ROUTES.movies },
  { label: "Series", path: ROUTES.series },
  { label: "Help Center", path: ROUTES.help },
  { label: "Playback Settings", path: ROUTES.settings },
];

const PageFooter = () => (
  <footer className="border-t">
    <div className="page-width flex flex-col items-center gap-4 py-8 text-center text-sm text-muted-foreground xl:flex-row xl:justify-between xl:text-left">
      <p>
        <span className="font-bold tracking-wide text-foreground">{APP_CONFIG.brand}</span>
        <span className="mx-3">•</span>Cinema Lounge &amp; Ultra Fidelity
      </p>
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {FOOTER_LINKS.map(link => (
          <Link key={link.label} to={link.path} className="transition-colors hover:text-foreground">{link.label}</Link>
        ))}
      </nav>
      <p className="text-xs uppercase tracking-wider">© {getCopyrightYear()} {APP_CONFIG.brand} Cinema</p>
    </div>
  </footer>
);

export default PageFooter;
