import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore, getCustomersFromBookings, formatDZD } from "@/lib/store";
import { Users, Phone, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CustomersPage() {
  const bookings = useStore((s) => s.bookings);
  const dresses = useStore((s) => s.dresses);
  const customers = useMemo(() => getCustomersFromBookings(bookings), [bookings]);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">{customers.length} clients · derived from bookings</p>
        </div>

        <div className="glass-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((customer) => {
            const customerBookings = bookings
              .filter((b) => b.phone === customer.phone || b.customerName === customer.name)
              .sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));
            return (
              <div key={customer.id} className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold truncate">{customer.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" /><span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" /><span>{customer.wilaya || "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="font-semibold text-primary text-sm">{formatDZD(customer.totalSpent)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Bookings</p>
                    <p className="font-semibold text-sm">{customer.bookingCount}</p>
                  </div>
                </div>

                {customerBookings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/30 max-h-40 overflow-y-auto">
                    <p className="text-xs text-muted-foreground mb-2">Booking History</p>
                    {customerBookings.map((b) => {
                      const dress = dresses.find((d) => d.id === b.dressId);
                      return (
                        <div key={b.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-muted-foreground truncate flex-1">{dress?.name ?? "—"}</span>
                          <span className="text-muted-foreground/70 mx-2">{b.bookingDate}</span>
                          <span className="font-medium">{formatDZD(b.totalAmount)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="glass-card p-12 text-center col-span-full">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No customers found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
