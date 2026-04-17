import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Save, KeyRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
}

const DEFAULT_USER: UserProfile = {
  fullName: "Boutique Manager",
  email: "",
  phone: "",
  role: "Admin",
  avatarUrl: "",
};

const STORAGE_KEY = "user_profile";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser({ ...DEFAULT_USER, ...JSON.parse(saved) });
      } catch {
        // ignore
      }
    }
  }, []);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setUser((u) => ({ ...u, [key]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.next.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password.next !== password.confirm) {
      toast({
        title: "Passwords don't match",
        description: "Please confirm the new password correctly.",
        variant: "destructive",
      });
      return;
    }
    setPassword({ current: "", next: "", confirm: "" });
    toast({
      title: "Password changed",
      description: "Connect authentication to persist this change.",
    });
  };

  const initials =
    user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <UserCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient">My Profile</h1>
            <p className="text-muted-foreground text-sm">
              Manage your personal information and password
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile}>
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-xl">Personal Information</CardTitle>
              <CardDescription>Update your account details and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/30">
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                  <AvatarFallback className="bg-primary/15 text-primary font-display text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    type="url"
                    value={user.avatarUrl}
                    onChange={(e) => update("avatarUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={user.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user.role} disabled />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+213 ..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <form onSubmit={handlePasswordChange}>
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>
                Use a strong password with at least 6 characters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="next">New Password</Label>
                  <Input
                    id="next"
                    type="password"
                    value={password.next}
                    onChange={(e) => setPassword({ ...password, next: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" className="gap-2">
                  <KeyRound className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
