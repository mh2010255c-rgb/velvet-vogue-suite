import { useState } from "react";
import { sampleDresses, categories, sizes, formatDZD, type Dress } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Shirt, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const availableDresses = sampleDresses.filter((d) => d.status === "Available" || d.status === "Reserved");

  const filtered = availableDresses.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (filterSize !== "all" && d.size !== filterSize) return false;
    return true;
  });

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    toast.success(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-display text-xl font-bold text-gradient">Dress Boutique</h1>
          </div>
          <Link to="/wishlist">
            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Exquisite <span className="text-gradient">Collection</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Discover our handpicked selection of premium dresses for every occasion
        </p>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search our collection..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dress) => (
            <div key={dress.id} className="glass-card overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="aspect-[3/4] bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                <Shirt className="h-16 w-16 text-muted-foreground/20" />
                <button
                  onClick={() => toggleWishlist(dress.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      wishlist.includes(dress.id) ? "fill-primary text-primary" : "text-foreground"
                    }`}
                  />
                </button>
                {dress.status === "Reserved" && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-warning/90 text-xs font-medium text-background">
                    Reserved
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-display font-semibold">{dress.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dress.category} · {dress.size} · {dress.color}
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-primary font-bold text-lg">{formatDZD(dress.rentalPrice)}</p>
                    <p className="text-xs text-muted-foreground">per rental</p>
                  </div>
                  <Button size="sm" className="gap-1.5" disabled={dress.status === "Reserved"}>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Shirt className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No dresses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
