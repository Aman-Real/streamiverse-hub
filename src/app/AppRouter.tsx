import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import HelpCenter from "@/pages/HelpCenter";
import Index from "@/pages/Index";
import Movies from "@/pages/Movies";
import MyList from "@/pages/MyList";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Series from "@/pages/Series";
import Settings from "@/pages/Settings";
import WatchHistory from "@/pages/WatchHistory";

/** Add a new screen: create the page, add its path to ROUTES, add a <Route> here. */
const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path={ROUTES.home} element={<Index />} />
      <Route path={ROUTES.movies} element={<Movies />} />
      <Route path={ROUTES.series} element={<Series />} />
      <Route path={ROUTES.myList} element={<MyList />} />
      <Route path={ROUTES.profile} element={<Profile />} />
      <Route path={ROUTES.watchHistory} element={<WatchHistory />} />
      <Route path={ROUTES.settings} element={<Settings />} />
      <Route path={ROUTES.help} element={<HelpCenter />} />
      {/* Keep the catch-all last. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
