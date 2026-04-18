import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useStore,
  formatDZD,
  daysBetween,
  hasBookingConflict,
  type PaymentStatus,
} from "@/lib/store";
import { toast } from "sonner";
import { Receipt, Printer, Zap, AlertTriangle, Shirt } from "lucide-react";

const paymentStatuses: PaymentStatus[] = ["Pending", "Partial", "Paid"];

export default function POSPage() {
  const dresses = useStore((s) => s.dresses);
  const bookings = useStore((s) => s.bookings);
  const addBooking = useStore((s) => s.addBooking);

  const today = new Date().toISOString().split("T")[0];
  const [dressId, setDressId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Paid");
  const [depositPaid, setDepositPaid] = useState(0);

  const dress = dresses.find((d) => d.id === dressId);
  const days = daysBetween(bookingDate, returnDate);
  const total = dress ? dress.rentalPrice * days : 0;
  const conflict = useMemo(
    () => hasBookingConflict(bookings, dressId, bookingDate, returnDate),
    [bookings, dressId, bookingDate, returnDate]
  );

  const reset = () => {
    setDressId(""); setCustomerName(""); setPhone("");
    setBookingDate(today); setReturnDate(today);
    setPaymentStatus("Paid"); setDepositPaid(0);
  };

  const printReceipt = (data: {
    receiptNo: string; customerName: string; phone: string;
    dressName: string; bookingDate: string; returnDate: string;
    days: number; pricePerDay: number; total: number; deposit: number;
    paymentStatus: string;
  }) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Receipt ${data.receiptNo}</title>
<style>
  *{box-sizing:border-box;font-family:'Helvetica Neue',Arial,sans-serif}
  body{margin:0;padding:24px;color:#111;background:#fff;max-width:380px}
  h1{font-family:Georgia,serif;font-size:20px;margin:0 0 4px;text-align:center}
  .sub{text-align:center;color:#666;font-size:11px;margin-bottom:16px}
  hr{border:none;border-top:1px dashed #999;margin:12px 0}
  .row{display:flex;justify-content:space-between;font-size:13px;padding:3px 0}
  .row b{font-weight:600}
  .total{font-size:16px;font-weight:700;border-top:2px solid #111;padding-top:8px;margin-top:8px}
  .footer{text-align:center;font-size:11px;color:#666;margin-top:20px}
  @media print {@page{size:80mm auto;margin:5mm}}
</style></head><body>
  <h1>Dress Boutique</h1>
  <div class="sub">RECEIPT · ${data.receiptNo}</div>
  <div class="sub">${new Date().toLocaleString()}</div>
  <hr/>
  <div class="row"><span>Customer</span><b>${data.customerName}</b></div>
  <div class="row"><span>Phone</span><b>${data.phone}</b></div>
  <hr/>
  <div class="row"><span>Item</span><b>${data.dressName}</b></div>
  <div class="row"><span>From</span><b>${data.bookingDate}</b></div>
  <div class="row"><span>To</span><b>${data.returnDate}</b></div>
  <div class="row"><span>Days</span><b>${data.days}</b></div>
  <div class="row"><span>Price / day</span><b>${formatDZD(data.pricePerDay)}</b></div>
  <hr/>
  <div class="row"><span>Deposit paid</span><b>${formatDZD(data.deposit)}</b></div>
  <div class="row"><span>Status</span><b>${data.paymentStatus}</b></div>
  <div class="row total"><span>TOTAL</span><span>${formatDZD(data.total)}</span></div>
  <div class="footer">Thank you for your business!<br/>Bring back the dress in good condition by ${data.returnDate}.</div>
  <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),300)}</script>
</body></html>`;
    const w = window.open("", "_blank", "width=420,height=640");
    if (!w) { toast.error("Popup blocked. Allow popups to print."); return; }
    w.document.write(html); w.document.close();
  };

  const handleCheckout = (alsoPrint: boolean) => {
    if (!dress) { toast.error("Select a dress"); return; }
    if (!customerName || !phone) { toast.error("Customer name and phone are required"); return; }
    if (conflict) { toast.error("Date conflict with an existing booking"); return; }

    const created = addBooking({
      dressId: dress.id,
      customerName, phone,
      wilaya: "", address: "",
      bookingDate, returnDate,
      depositPaid,
      totalAmount: total,
      paymentStatus,
      notes: "POS",
    });

    if (alsoPrint) {
      printReceipt({
        receiptNo: created.id.slice(0, 8).toUpperCase(),
        customerName, phone,
        dressName: dress.name,
        bookingDate, returnDate, days,
        pricePerDay: dress.rentalPrice,
        total, deposit: depositPaid,
        paymentStatus,
      });
    }
    toast.success("Sale recorded");
    reset();
  };

  const available = dresses.filter((d) => d.status !== "Sold");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" /> POS / Cashier
          </h1>
          <p className="text-muted-foreground mt-1">Fast checkout — pick a dress, enter customer, print receipt</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dress picker */}
          <div className="glass-card p-4 lg:col-span-2">
            <h3 className="font-display text-lg font-semibold mb-3">Select Dress</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {available.map((d) => {
                const selected = d.id === dressId;
                return (
                  <button key={d.id} type="button" onClick={() => setDressId(d.id)}
                    className={`text-left rounded-lg border transition-all overflow-hidden ${
                      selected ? "border-primary ring-2 ring-primary/40 pink-glow-sm" : "border-border/40 hover:border-primary/40"
                    }`}>
                    <div className="aspect-[3/4] bg-secondary/40 flex items-center justify-center">
                      {d.imageUrl ? <img src={d.imageUrl} alt={d.name} className="h-full w-full object-cover" /> : <Shirt className="h-8 w-8 text-muted-foreground/30" />}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold truncate">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">{d.size} · {d.color}</p>
                      <p className="text-xs text-primary font-semibold mt-1">{formatDZD(d.rentalPrice)}<span className="text-[9px] text-muted-foreground font-normal">/day</span></p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkout panel */}
          <div className="glass-card p-5 space-y-4 lg:sticky lg:top-20 self-start">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Checkout
            </h3>

            <div className="space-y-3">
              <div>
                <Label className="text-xs">Customer Name</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">From</Label>
                  <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">To</Label>
                  <Input type="date" min={bookingDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Deposit</Label>
                  <Input type="number" value={depositPaid} onChange={(e) => setDepositPaid(Number(e.target.value))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Payment</Label>
                  <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {conflict && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Already booked {conflict.bookingDate} → {conflict.returnDate}</span>
              </div>
            )}

            <div className="rounded-lg bg-secondary/30 p-3 text-sm space-y-1">
              <div className="flex justify-between text-muted-foreground"><span>Dress</span><span className="truncate ml-2">{dress?.name ?? "—"}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Days</span><span>{days}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Price / day</span><span>{dress ? formatDZD(dress.rentalPrice) : "—"}</span></div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-border/40 mt-2">
                <span>Total</span><span className="text-primary">{formatDZD(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => handleCheckout(false)} disabled={!dress || !!conflict}>Save</Button>
              <Button onClick={() => handleCheckout(true)} disabled={!dress || !!conflict} className="gap-2">
                <Printer className="h-4 w-4" /> Pay & Print
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
