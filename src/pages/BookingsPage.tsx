import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CalendarCheck, MessageCircle } from "lucide-react";
import {
  sampleBookings,
  sampleDresses,
  wilayas,
  formatDZD,
  type Booking,
  type PaymentStatus,
} from "@/lib/store";
import { toast } from "sonner";

const paymentStatuses: PaymentStatus[] = ["Pending", "Partial", "Paid", "Refunded"];

function BookingForm({ onSave, onClose }: { onSave: (b: Partial<Booking>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    dressId: "",
    customerName: "",
    phone: "",
    wilaya: "",
    address: "",
    bookingDate: "",
    returnDate: "",
    depositPaid: 0,
    totalAmount: 0,
    paymentStatus: "Pending" as PaymentStatus,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
    toast.success("Booking created");
  };

  const availableDresses = sampleDresses.filter((d) => d.status === "Available");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Dress</Label>
          <Select value={form.dressId} onValueChange={(v) => {
            const dress = sampleDresses.find((d) => d.id === v);
            setForm({ ...form, dressId: v, totalAmount: dress?.rentalPrice ?? 0, depositPaid: dress?.depositAmount ?? 0 });
          }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select a dress" /></SelectTrigger>
            <SelectContent>
              {availableDresses.map((d) => <SelectItem key={d.id} value={d.id}>{d.name} - {d.size}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
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
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select wilaya" /></SelectTrigger>
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
          <Label>Booking Date</Label>
          <Input type="date" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} required className="mt-1" />
        </div>
        <div>
          <Label>Return Date</Label>
          <Input type="date" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} required className="mt-1" />
        </div>
        <div>
          <Label>Deposit Paid (DA)</Label>
          <Input type="number" value={form.depositPaid} onChange={(e) => setForm({ ...form, depositPaid: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <Label>Total Amount (DA)</Label>
          <Input type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
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
        <Button type="submit">Create Booking</Button>
      </div>
    </form>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = (data: Partial<Booking>) => {
    setBookings((prev) => [...prev, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString().split("T")[0] } as Booking]);
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hello ${name}, this is Dress Boutique. We'd like to follow up on your booking.`);
    window.open(`https://wa.me/${phone.replace(/^0/, "213")}?text=${msg}`, "_blank");
  };

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
              <BookingForm onSave={handleSave} onClose={() => setDialogOpen(false)} />
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
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const dress = sampleDresses.find((d) => d.id === b.dressId);
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
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-success/10 hover:text-success" onClick={() => handleWhatsApp(b.phone, b.customerName)}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
