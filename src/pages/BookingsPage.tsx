import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageCircle, AlertTriangle, Trash2 } from "lucide-react";
import {
  useStore,
  wilayas,
  formatDZD,
  daysBetween,
  hasBookingConflict,
  type Booking,
  type PaymentStatus,
} from "@/lib/store";
import { toast } from "sonner";

const paymentStatuses: PaymentStatus[] = ["Pending", "Partial", "Paid", "Refunded"];

function BookingForm({ onSave, onClose }: { onSave: (b: Omit<Booking, "id" | "createdAt">) => void; onClose: () => void }) {
  const dresses = useStore((s) => s.dresses);
  const bookings = useStore((s) => s.bookings);

  const [form, setForm] = useState({
    dressId: "",
    customerName: "",
    phone: "",
    wilaya: "Algiers",
    address: "",
    bookingDate: "",
    returnDate: "",
    depositPaid: 0,
    totalAmount: 0,
    paymentStatus: "Pending" as PaymentStatus,
    notes: "",
  });

  const selectedDress = dresses.find((d) => d.id === form.dressId);
  const days = daysBetween(form.bookingDate, form.returnDate);
  const computedTotal = selectedDress ? selectedDress.rentalPrice * days : 0;
  const conflict = useMemo(
    () => hasBookingConflict(bookings, form.dressId, form.bookingDate, form.returnDate),
    [bookings, form.dressId, form.bookingDate, form.returnDate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict) {
      toast.error(`Conflict: dress already booked ${conflict.bookingDate} → ${conflict.returnDate}`);
      return;
    }
    if (!form.dressId) {
      toast.error("Select a dress");
      return;
    }
    onSave({ ...form, totalAmount: form.totalAmount || computedTotal });
    onClose();
    toast.success("Booking created");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Dress</Label>
          <Select value={form.dressId} onValueChange={(v) => {
            const d = dresses.find((x) => x.id === v);
            setForm({ ...form, dressId: v, depositPaid: d?.depositAmount ?? 0 });
          }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select a dress" /></SelectTrigger>
            <SelectContent>
              {dresses.filter((d) => d.status !== "Sold").map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name} — {d.size} · {formatDZD(d.rentalPrice)}/day</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Booking Date</Label>
          <Input type="date" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} required className="mt-1" />
        </div>
        <div>
          <Label>Return Date</Label>
          <Input type="date" value={form.returnDate} min={form.bookingDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} required className="mt-1" />
        </div>

        {conflict && (
          <div className="col-span-2 flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Date conflict</p>
              <p className="opacity-80">This dress is already booked {conflict.bookingDate} → {conflict.returnDate} ({conflict.customerName})</p>
            </div>
          </div>
        )}

        {selectedDress && days > 0 && (
          <div className="col-span-2 p-3 rounded-md bg-primary/5 border border-primary/20 text-xs flex items-center justify-between">
            <span className="text-muted-foreground">{days} day{days > 1 ? "s" : ""} × {formatDZD(selectedDress.rentalPrice)}</span>
            <span className="font-semibold text-primary">{formatDZD(computedTotal)}</span>
          </div>
        )}

        <div className="col-span-2">
          <Label>Customer Name</Label>
          <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required className="mt-1" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="mt-1" />
        </div>
        <div>
          <Label>Wilaya</Label>
          <Select value={form.wilaya} onValueChange={(v) => setForm({ ...form, wilaya: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {wilayas.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Deposit Paid (DA)</Label>
          <Input type="number" value={form.depositPaid} onChange={(e) => setForm({ ...form, depositPaid: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <Label>Total Override (DA)</Label>
          <Input type="number" placeholder={String(computedTotal)} value={form.totalAmount || ""} onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })} className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label>Payment Status</Label>
          <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v as PaymentStatus })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {paymentStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" rows={2} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!!conflict}>Create Booking</Button>
      </div>
    </form>
  );
}

export default function BookingsPage() {
  const bookings = useStore((s) => s.bookings);
  const dresses = useStore((s) => s.dresses);
  const addBooking = useStore((s) => s.addBooking);
  const deleteBooking = useStore((s) => s.deleteBooking);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hello ${name}, this is Dress Boutique. We'd like to follow up on your booking.`);
    window.open(`https://wa.me/${phone.replace(/^0/, "213")}?text=${msg}`, "_blank");
  };

  const sorted = [...bookings].sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage reservations and rentals</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> New Booking</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-display">New Booking</DialogTitle></DialogHeader>
              <BookingForm onSave={(b) => addBooking(b)} onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dress</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dates</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Payment</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((b) => {
                  const dress = dresses.find((d) => d.id === b.dressId);
                  return (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium">{b.customerName}</p>
                        <p className="text-xs text-muted-foreground">{b.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{dress?.name ?? "—"}</td>
                      <td className="py-3 px-4">
                        <p className="text-xs">{b.bookingDate}</p>
                        <p className="text-xs text-muted-foreground">→ {b.returnDate}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{formatDZD(b.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground">Deposit: {formatDZD(b.depositPaid)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          b.paymentStatus === "Paid" ? "bg-success/15 text-success"
                          : b.paymentStatus === "Partial" ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground"
                        }`}>{b.paymentStatus}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-success/10 hover:text-success"
                          onClick={() => handleWhatsApp(b.phone, b.customerName)}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => { deleteBooking(b.id); toast.success("Booking removed"); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No bookings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
