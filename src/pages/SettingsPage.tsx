import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Store, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BoutiqueProfile {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  currency: string;
  description: string;
  logoUrl: string;
}

const DEFAULT_PROFILE: BoutiqueProfile = {
  name: "Dress Boutique",
  tagline: "Elegance Redefined",
  email: "",
  phone: "",
  address: "",
  wilaya: "",
  currency: "DZD",
  description: "",
  logoUrl: "",
};

const STORAGE_KEY = "boutique_profile";

export default function SettingsPage() {
  const [profile, setProfile] = useState<BoutiqueProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
      } catch {
        // ignore
      }
    }
  }, []);

  const update = <K extends keyof BoutiqueProfile>(key: K, value: BoutiqueProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    toast({
      title: "Settings saved",
      description: "Your boutique profile has been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your boutique information</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-xl">Boutique Profile</CardTitle>
              <CardDescription>
                These details appear on invoices, reports, and your public catalog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Boutique Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Dress Boutique"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={profile.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                    placeholder="Elegance Redefined"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={profile.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  placeholder="https://..."
                />
                {profile.logoUrl && (
                  <div className="mt-2 h-20 w-20 rounded-lg border border-border/50 overflow-hidden bg-muted/30">
                    <img
                      src={profile.logoUrl}
                      alt="Boutique logo preview"
                      className="h-full w-full object-cover"
                      onError={(e) => ((e.currentTarget.style.display = "none"))}
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="contact@boutique.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+213 ..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Street, building"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wilaya">Wilaya / City</Label>
                  <Input
                    id="wilaya"
                    value={profile.wilaya}
                    onChange={(e) => update("wilaya", e.target.value)}
                    placeholder="Algiers"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={profile.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  placeholder="DZD"
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="A short description shown on the public catalog..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
