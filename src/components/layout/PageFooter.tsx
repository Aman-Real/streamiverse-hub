import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { APP_CONFIG } from "@/config/app.config";

const FOOTER_LINKS = [
  { label: "Terms of Service", path: ROUTES.help },
  { label: "Privacy Policy", path: ROUTES.help },
  { label: "Help Center", path: ROUTES.help },
  { label: "Audio/Video Calibrations", path: ROUTES.settings },
];

const PageFooter = () => (
  <footer className="border-t">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted-foreground md:px-12 xl:flex-row xl:justify-between">
      <p>
        <span className="font-bold tracking-wide text-foreground">{APP_CONFIG.brand}</span>
        <span className="mx-3">•</span>Cinema Lounge &amp; Ultra Fidelity
      </p>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {FOOTER_LINKS.map(link => (
          <Link key={link.label} to={link.path} className="transition-colors hover:text-foreground">{link.label}</Link>
        ))}
      </div>
      <p className="text-xs uppercase tracking-wider">© {APP_CONFIG.copyrightYear} {APP_CONFIG.brand} Cinema</p>
    </div>
  </footer>
);

export default PageFooter;
