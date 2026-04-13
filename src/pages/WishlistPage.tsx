import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Shirt, Trash2 } from "lucide-react";
import { sampleDresses, formatDZD } from "@/lib/store";

export default function WishlistPage() {
  // In a real app, this would come from global state/context
  // For now, show an empty state with a link back
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link to="/catalog">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold">My Wishlist</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Browse our catalog and tap the heart icon to save dresses you love
        </p>
        <Link to="/catalog">
          <Button className="gap-2">
            <Shirt className="h-4 w-4" /> Browse Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
