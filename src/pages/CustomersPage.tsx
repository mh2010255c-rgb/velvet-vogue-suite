import { DashboardLayout } from "@/components/DashboardLayout";
import { sampleCustomers, sampleBookings, sampleDresses, formatDZD } from "@/lib/store";
import { Users, Phone, MapPin } from "lucide-react";

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">Your valued clientele</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sampleCustomers.map((customer) => {
            const customerBookings = sampleBookings.filter((b) => b.customerName === customer.name);
            return (
              <div key={customer.id} className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold truncate">{customer.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{customer.wilaya}</span>
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
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2">Recent Rentals</p>
                    {customerBookings.slice(0, 2).map((b) => {
                      const dress = sampleDresses.find((d) => d.id === b.dressId);
                      return (
                        <div key={b.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-muted-foreground truncate">{dress?.name}</span>
                          <span>{b.bookingDate}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
