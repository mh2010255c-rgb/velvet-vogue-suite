import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Shirt, CheckCircle, Clock, ShoppingCart, DollarSign, CalendarClock, Users, TrendingUp,
} from "lucide-react";
import { useStore, getCustomersFromBookings, formatDZD } from "@/lib/store";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof Shirt; label: string; value: string | number; sub?: string }) {
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

export default function DashboardPage() {
  const dresses = useStore((s) => s.dresses);
  const bookings = useStore((s) => s.bookings);
  const customers = useMemo(() => getCustomersFromBookings(bookings), [bookings]);

  const total = dresses.length;
  const available = dresses.filter((d) => d.status === "Available").length;
  const reserved = dresses.filter((d) => d.status === "Reserved").length;
  const rented = dresses.filter((d) => d.status === "Rented").length;
  const sold = dresses.filter((d) => d.status === "Sold").length;

  const today = new Date().toISOString().split("T")[0];
  const monthKey = today.slice(0, 7);
  const monthRevenue = bookings.filter((b) => b.bookingDate.startsWith(monthKey)).reduce((s, b) => s + b.totalAmount, 0);
  const upcoming = bookings.filter((b) => b.returnDate >= today && b.bookingDate <= today).length;

  const monthlySeries = useMemo(() => {
    const months: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({
        month: d.toLocaleString("default", { month: "short" }),
        revenue: bookings.filter((b) => b.bookingDate.startsWith(key)).reduce((s, b) => s + b.totalAmount, 0),
      });
    }
    return months;
  }, [bookings]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of dresses) map.set(d.category, (map.get(d.category) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [dresses]);

  const recent = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to your boutique overview</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/bookings">New Booking</Link></Button>
            <Button asChild><Link to="/pos">Open POS</Link></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Shirt} label="Total Dresses" value={total} sub={`${available} in stock`} />
          <StatCard icon={CheckCircle} label="Available" value={available} sub="Ready to rent" />
          <StatCard icon={Clock} label="Reserved" value={reserved} sub="Awaiting pickup" />
          <StatCard icon={ShoppingCart} label="Rented" value={rented} sub="Currently out" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Monthly Revenue" value={formatDZD(monthRevenue)} sub="This month" />
          <StatCard icon={CalendarClock} label="Active Today" value={upcoming} sub="Ongoing rentals" />
          <StatCard icon={Users} label="Customers" value={customers.length} />
          <StatCard icon={TrendingUp} label="Sold Dresses" value={sold} sub="All time" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySeries}>
                <defs>
                  <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(338,100%,65%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(338,100%,65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
                <XAxis dataKey="month" stroke="hsl(0,0%,45%)" fontSize={12} />
                <YAxis stroke="hsl(0,0%,45%)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(0,0%,12%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,95%)" }}
                  formatter={(value: number) => [formatDZD(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(338,100%,65%)" fill="url(#pinkGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
                <XAxis type="number" stroke="hsl(0,0%,45%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(0,0%,45%)" fontSize={12} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,12%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,95%)" }} />
                <Bar dataKey="count" fill="hsl(338,100%,65%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dress</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => {
                  const dress = dresses.find((d) => d.id === b.dressId);
                  return (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{b.customerName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{dress?.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{b.bookingDate}</td>
                      <td className="py-3 px-4">{formatDZD(b.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          b.paymentStatus === "Paid" ? "bg-success/15 text-success"
                          : b.paymentStatus === "Partial" ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground"
                        }`}>{b.paymentStatus}</span>
                      </td>
                    </tr>
                  );
                })}
                {recent.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">No bookings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
