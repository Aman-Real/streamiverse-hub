import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { MyListProvider } from "@/features/my-list/context/MyListProvider";
import { NotificationsProvider } from "@/features/notifications/context/NotificationsProvider";
import { ProfileProvider } from "@/features/profile/context/ProfileProvider";
import { WatchProgressProvider } from "@/features/watch-progress/context/WatchProgressProvider";
import { queryClient } from "@/lib/queryClient";

/**
 * Every global provider lives here, in one place.
 * Order matters: an outer provider must never depend on an inner one.
 * Profile, watch progress and My List all read the signed-in account, so they sit inside AuthProvider.
 */
const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <TooltipProvider>
          <WatchProgressProvider>
            <MyListProvider>
              <NotificationsProvider>
                {children}
                <Toaster />
              </NotificationsProvider>
            </MyListProvider>
          </WatchProgressProvider>
        </TooltipProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default AppProviders;
