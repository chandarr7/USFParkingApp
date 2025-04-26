import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import MyReservations from "@/pages/MyReservations";
import Favorites from "@/pages/Favorites";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/home">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/visualizations">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/reservations">
        <Layout>
          <MyReservations />
        </Layout>
      </Route>
      <Route path="/favorites">
        <Layout>
          <Favorites />
        </Layout>
      </Route>
      <Route path="/about">
        <Layout>
          <AboutUs />
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
