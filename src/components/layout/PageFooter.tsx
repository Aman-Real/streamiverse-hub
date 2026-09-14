import { APP_CONFIG } from "@/config/app.config";

const PageFooter = () => (
  <footer className="py-8 px-12 text-center text-xs text-muted-foreground border-t border-border mt-8">
    © {APP_CONFIG.copyrightYear} {APP_CONFIG.name}. All rights reserved.
  </footer>
);

export default PageFooter;
