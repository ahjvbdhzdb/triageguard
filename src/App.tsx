import { StoreProvider, useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Review from "./pages/Review";
import AuditLog from "./pages/AuditLog";

function AppContent() {
  const { page } = useStore();

  return (
    <Layout>
      {page === "dashboard" && <Dashboard />}
      {page === "submit" && <Submit />}
      {page === "review" && <Review />}
      {page === "audit" && <AuditLog />}
    </Layout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
