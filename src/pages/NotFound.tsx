import { House, SearchX } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import EmptyState from "@/components/common/EmptyState";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

/** Unknown address, or a title TMDB doesn't have. */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageShell>
      <div className="page-container-narrow">
        <EmptyState
          icon={SearchX}
          title="Page not found"
          description="This page or title doesn't exist, or it was moved. Check the link, or head back home."
          action={<Button onClick={() => navigate(ROUTES.home)}><House /> Back to Home</Button>}
          className="mt-10"
        />
      </div>
    </PageShell>
  );
};

export default NotFound;
