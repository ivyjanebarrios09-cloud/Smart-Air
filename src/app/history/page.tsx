import AppShell from "@/components/layout/app-shell";
import { HistoryView } from "@/components/history/history-view";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Historical Data
          </h1>
          <p className="text-muted-foreground">
            Explore past sensor readings with interactive charts.
          </p>
        </header>
        <HistoryView />
      </div>
    </AppShell>
  );
}
