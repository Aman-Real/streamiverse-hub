import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import TmdbHealthCheck from "@/app/TmdbHealthCheck";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { VideoLibraryProvider } from "@/features/catalog/context/VideoLibraryProvider";
import { MyListProvider } from "@/features/my-list/context/MyListProvider";
import { NotificationsProvider } from "@/features/notifications/context/NotificationsProvider";
import { queryClient } from "@/lib/queryClient";

/**
 * Every global provider lives here, in one place.
 * Order matters: an outer provider must never depend on an inner one.
 */
const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <VideoLibraryProvider>
          <MyListProvider>
            <NotificationsProvider>
              {children}
              <Toaster />
              {/* DEV-ONLY TMDB token check. Keep it after <Toaster /> so a failure toast isn't dropped. */}
              {import.meta.env.DEV && <TmdbHealthCheck />}
            </NotificationsProvider>
          </MyListProvider>
        </VideoLibraryProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default AppProviders;
