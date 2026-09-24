import AppProviders from "@/app/AppProviders";
import AppRouter from "@/app/AppRouter";

/**
 * App = providers + routes, nothing else.
 * Global state goes in AppProviders. New screens go in AppRouter.
 */
const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;
