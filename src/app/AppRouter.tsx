import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import RequireAuth from "@/features/auth/components/RequireAuth";
import Auth from "@/pages/Auth";
import Explore from "@/pages/Explore";
import HelpCenter from "@/pages/HelpCenter";
import Index from "@/pages/Index";
import Movies from "@/pages/Movies";
import MyList from "@/pages/MyList";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Series from "@/pages/Series";
import Settings from "@/pages/Settings";
import WatchHistory from "@/pages/WatchHistory";
import WatchRoom from "@/pages/WatchRoom";
import WatchRoomHub from "@/pages/WatchRoomHub";

/** Every screen opens at the top, including title-to-title jumps. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Braces matter: an arrow that returns a value hands React that value as the effect's
    // cleanup, and React calls it on the next navigation.
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/** Messages the sign-in screen shows to guests sent there from a members-only screen. */
const SIGN_IN_TO = {
  watch: "Sign in to watch and explore titles.",
  lounge: "Sign in to open My Lounge and your Watchlist.",
  profile: "Sign in to see your profile.",
  history: "Sign in to see your watch history.",
} as const;

/**
 * Add a new screen: create the page, add its path to ROUTES, add a <Route> here.
 * Members-only screens are wrapped in RequireAuth: guests go to sign in, then come back.
 */
const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path={ROUTES.home} element={<Index />} />
      <Route path={`${ROUTES.explore}/:id?`} element={<RequireAuth message={SIGN_IN_TO.watch}><Explore /></RequireAuth>} />
      <Route path={ROUTES.watch} element={<RequireAuth message={SIGN_IN_TO.watch}><WatchRoomHub /></RequireAuth>} />
      <Route path={`${ROUTES.watch}/:id`} element={<RequireAuth message={SIGN_IN_TO.watch}><WatchRoom /></RequireAuth>} />
      <Route path={ROUTES.movies} element={<Movies />} />
      <Route path={ROUTES.series} element={<Series />} />
      <Route path={ROUTES.myList} element={<RequireAuth message={SIGN_IN_TO.lounge}><MyList /></RequireAuth>} />
      <Route path={ROUTES.profile} element={<RequireAuth message={SIGN_IN_TO.profile}><Profile /></RequireAuth>} />
      <Route path={ROUTES.watchHistory} element={<RequireAuth message={SIGN_IN_TO.history}><WatchHistory /></RequireAuth>} />
      <Route path={ROUTES.settings} element={<Settings />} />
      <Route path={ROUTES.help} element={<HelpCenter />} />
      <Route path={ROUTES.auth} element={<Auth />} />
      {/* Keep the catch-all last. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
