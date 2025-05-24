import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import StudyMaterials from "@/pages/study-materials";
import LearningPath from "@/pages/learning-path";
import Schedule from "@/pages/schedule";
import Groups from "@/pages/groups";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/study-materials" component={StudyMaterials} />
      <Route path="/learning-path" component={LearningPath} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/groups" component={Groups} />
      <Route component={NotFound} />
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
