import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Shirt } from "lucide-react";
import {
  useStore,
  categories,
  sizes,
  colors,
  dressStatuses,
  formatDZD,
  type Dress,
  type DressStatus,
} from "@/lib/store";
import { toast } from "sonner";

const statusColors: Record<DressStatus, string> = {
  Available: "bg-success/15 text-success",
  Reserved: "bg-warning/15 text-warning",
  Rented: "bg-info/15 text-info",
  "Under Cleaning": "bg-muted text-muted-foreground",
  Sold: "bg-primary/15 text-primary",
};

function DressForm({
  dress,
  onSave,
  onClose,
}: {
  dress?: Dress;
  onSave: (d: Omit<Dress, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: dress?.name ?? "",
    category: dress?.category ?? "Evening",
    size: dress?.size ?? "M",
    color: dress?.color ?? "Black",
    imageUrl: dress?.imageUrl ?? "",
    images: dress?.images ?? [],
    salePrice: dress?.salePrice ?? 0,
    rentalPrice: dress?.rentalPrice ?? 0,
    pricePerHour: dress?.pricePerHour ?? 0,
    depositAmount: dress?.depositAmount ?? 0,
    condition: dress?.condition ?? "New",
    notes: dress?.notes ?? "",
    status: dress?.status ?? ("Available" as DressStatus),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
    toast.success(dress ? "Dress updated" : "Dress added");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Dress Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label>Image URL</Label>
          <Input
            placeholder="https://…"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="mt-1"
          />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-md border border-border/40" />
          )}
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Size</Label>
          <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color</Label>
          <Select value={form.color} onValueChange={(v) => setForm({ ...form, color: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {colors.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Condition</Label>
          <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["New", "Excellent", "Good", "Fair"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Price / Day (DA)</Label>
          <Input type="number" value={form.rentalPrice} onChange={(e) => setForm({ ...form, rentalPrice: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <Label>Price / Hour (DA)</Label>
          <Input type="number" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <Label>Sale Price (DA)</Label>
          <Input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <Label>Deposit (DA)</Label>
          <Input type="number" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: Number(e.target.value) })} className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as DressStatus })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {dressStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
        <Button type="submit">{dress ? "Update" : "Add"} Dress</Button>
      </div>
    </form>
  );
}

export default function DressesPage() {
  const dresses = useStore((s) => s.dresses);
  const addDress = useStore((s) => s.addDress);
  const updateDress = useStore((s) => s.updateDress);
  const deleteDress = useStore((s) => s.deleteDress);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDress, setEditingDress] = useState<Dress | undefined>();

  const filtered = dresses.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (filterSize !== "all" && d.size !== filterSize) return false;
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    return true;
  });

  const handleSave = (data: Omit<Dress, "id" | "createdAt">) => {
    if (editingDress) updateDress(editingDress.id, data);
    else addDress(data);
    setEditingDress(undefined);
  };

  const handleDelete = (id: string) => {
    deleteDress(id);
    toast.success("Dress deleted");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Dresses</h1>
            <p className="text-muted-foreground mt-1">Manage your dress inventory</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditingDress(undefined); }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Dress</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editingDress ? "Edit" : "Add"} Dress</DialogTitle>
              </DialogHeader>
              <DressForm dress={editingDress} onSave={handleSave} onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search dresses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterSize} onValueChange={setFilterSize}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {dressStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((dress) => (
            <div key={dress.id} className="glass-card overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="aspect-[3/4] bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                {dress.imageUrl ? (
                  <img src={dress.imageUrl} alt={dress.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <Shirt className="h-12 w-12 text-muted-foreground/30" />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[dress.status]}`}>
                    {dress.status}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display font-semibold text-sm truncate">{dress.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{dress.category}</span><span>·</span>
                  <span>{dress.size}</span><span>·</span>
                  <span className="truncate">{dress.color}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-primary font-semibold text-sm">{formatDZD(dress.rentalPrice)}<span className="text-[10px] text-muted-foreground font-normal">/day</span></p>
                    <p className="text-[10px] text-muted-foreground">{formatDZD(dress.pricePerHour)}/hr</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => { setEditingDress(dress); setDialogOpen(true); }}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(dress.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Shirt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No dresses found matching your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
