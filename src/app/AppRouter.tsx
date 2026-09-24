import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ROUTES } from "@/app/routes";
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

/** Add a new screen: create the page, add its path to ROUTES, add a <Route> here. */
const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path={ROUTES.home} element={<Index />} />
      <Route path={`${ROUTES.explore}/:id?`} element={<Explore />} />
      <Route path={`${ROUTES.watch}/:id?`} element={<WatchRoom />} />
      <Route path={ROUTES.movies} element={<Movies />} />
      <Route path={ROUTES.series} element={<Series />} />
      <Route path={ROUTES.myList} element={<MyList />} />
      <Route path={ROUTES.profile} element={<Profile />} />
      <Route path={ROUTES.watchHistory} element={<WatchHistory />} />
      <Route path={ROUTES.settings} element={<Settings />} />
      <Route path={ROUTES.help} element={<HelpCenter />} />
      <Route path={ROUTES.auth} element={<Auth />} />
      {/* Keep the catch-all last. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
