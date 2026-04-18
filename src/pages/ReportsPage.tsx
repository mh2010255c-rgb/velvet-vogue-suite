import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore, formatDZD } from "@/lib/store";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { DollarSign, CalendarCheck, TrendingUp, Receipt } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof DollarSign; label: string; value: string | number; sub?: string }) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-2 font-display">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const bookings = useStore((s) => s.bookings);
  const dresses = useStore((s) => s.dresses);

  const today = new Date().toISOString().split("T")[0];
  const monthKey = today.slice(0, 7);

  const stats = useMemo(() => {
    let dailyIncome = 0, monthlyIncome = 0, totalIncome = 0;
    let dailyCount = 0, monthlyCount = 0;

    for (const b of bookings) {
      totalIncome += b.totalAmount;
      if (b.bookingDate === today) { dailyIncome += b.totalAmount; dailyCount++; }
      if (b.bookingDate.startsWith(monthKey)) { monthlyIncome += b.totalAmount; monthlyCount++; }
    }
    return { dailyIncome, monthlyIncome, totalIncome, dailyCount, monthlyCount, totalCount: bookings.length };
  }, [bookings, today, monthKey]);

  // Daily income last 14 days
  const dailySeries = useMemo(() => {
    const days: { date: string; revenue: number; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const dayBookings = bookings.filter((b) => b.bookingDate === key);
      days.push({
        date: key.slice(5),
        revenue: dayBookings.reduce((s, b) => s + b.totalAmount, 0),
        count: dayBookings.length,
      });
    }
    return days;
  }, [bookings]);

  // Monthly income last 6 months
  const monthlySeries = useMemo(() => {
    const months: { month: string; revenue: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthBookings = bookings.filter((b) => b.bookingDate.startsWith(key));
      months.push({
        month: d.toLocaleString("default", { month: "short" }),
        revenue: monthBookings.reduce((s, b) => s + b.totalAmount, 0),
        count: monthBookings.length,
      });
    }
    return months;
  }, [bookings]);

  // Top dresses
  const topDresses = useMemo(() => {
    const counts = new Map<string, { count: number; revenue: number }>();
    for (const b of bookings) {
      const c = counts.get(b.dressId) ?? { count: 0, revenue: 0 };
      c.count++; c.revenue += b.totalAmount;
      counts.set(b.dressId, c);
    }
    return Array.from(counts.entries())
      .map(([id, v]) => ({ name: dresses.find((d) => d.id === id)?.name ?? "—", ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [bookings, dresses]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Income, bookings & performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Today" value={formatDZD(stats.dailyIncome)} sub={`${stats.dailyCount} booking${stats.dailyCount !== 1 ? "s" : ""}`} />
          <StatCard icon={TrendingUp} label="This Month" value={formatDZD(stats.monthlyIncome)} sub={`${stats.monthlyCount} bookings`} />
          <StatCard icon={Receipt} label="All-time Revenue" value={formatDZD(stats.totalIncome)} />
          <StatCard icon={CalendarCheck} label="Total Bookings" value={stats.totalCount} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Daily Income (last 14 days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailySeries}>
                <defs>
                  <linearGradient id="pinkArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(338,100%,65%)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(338,100%,65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
                <XAxis dataKey="date" stroke="hsl(0,0%,45%)" fontSize={11} />
                <YAxis stroke="hsl(0,0%,45%)" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(0,0%,12%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,95%)" }}
                  formatter={(value: number) => [formatDZD(value), "Income"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(338,100%,65%)" fill="url(#pinkArea)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Monthly Income</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
                <XAxis dataKey="month" stroke="hsl(0,0%,45%)" fontSize={11} />
                <YAxis stroke="hsl(0,0%,45%)" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(0,0%,12%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,95%)" }}
                  formatter={(value: number) => [formatDZD(value), "Income"]}
                />
                <Bar dataKey="revenue" fill="hsl(338,100%,65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Top Dresses</h3>
          {topDresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="space-y-2">
              {topDresses.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{i + 1}</span>
                    <span className="truncate">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <span className="text-muted-foreground">{d.count} rental{d.count > 1 ? "s" : ""}</span>
                    <span className="font-semibold text-primary">{formatDZD(d.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
