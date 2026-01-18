import AppShell from "@/components/layout/app-shell";
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard";
import { DataSimulator } from "@/components/dashboard/data-simulator";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time sensor readings from your device.
          </p>
        </header>
        <RealtimeDashboard />
        <DataSimulator />
      </div>
    </AppShell>
  );
}
