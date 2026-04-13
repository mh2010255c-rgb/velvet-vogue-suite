import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { sampleBookings, sampleDresses } from "@/lib/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)); // April 2025

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookingsByDate = useMemo(() => {
    const map: Record<string, typeof sampleBookings> = {};
    sampleBookings.forEach((b) => {
      const start = new Date(b.bookingDate);
      const end = new Date(b.returnDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split("T")[0];
        if (!map[key]) map[key] = [];
        map[key].push(b);
      }
    });
    return map;
  }, []);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">Reservation schedule overview</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-display text-xl font-semibold">{monthName}</h2>
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
                {day}
              </div>
            ))}

            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayBookings = bookingsByDate[dateStr] || [];
              const hasBooking = dayBookings.length > 0;

              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-2 rounded-lg border transition-colors ${
                    hasBooking
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/30 hover:border-border/60"
                  }`}
                >
                  <span className={`text-sm font-medium ${hasBooking ? "text-primary" : ""}`}>
                    {day}
                  </span>
                  {dayBookings.map((b) => {
                    const dress = sampleDresses.find((d) => d.id === b.dressId);
                    return (
                      <div key={b.id} className="mt-1 px-1.5 py-0.5 bg-primary/15 rounded text-[10px] text-primary truncate">
                        {dress?.name?.split(" ")[0]}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
