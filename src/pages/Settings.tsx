import { Bell, Globe, Monitor, Settings as SettingsIcon, Shield } from "lucide-react";
import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [hd, setHd] = useState(true);

  return (
    <PageShell className="text-foreground">
      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8"><SettingsIcon className="w-8 h-8" /> Settings</h1>
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Monitor className="w-5 h-5 text-primary" /> Playback</h2>
            <div className="flex justify-between items-center">
              <div><p className="text-sm">Autoplay next episode</p><p className="text-xs text-muted-foreground">Automatically play the next episode</p></div>
              <Switch checked={autoplay} onCheckedChange={setAutoplay} />
            </div>
            <div className="flex justify-between items-center">
              <div><p className="text-sm">HD Streaming</p><p className="text-xs text-muted-foreground">Stream in high definition when available</p></div>
              <Switch checked={hd} onCheckedChange={setHd} />
            </div>
          </section>
          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h2>
            <div className="flex justify-between items-center">
              <div><p className="text-sm">Push Notifications</p><p className="text-xs text-muted-foreground">Receive alerts for new releases</p></div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </section>
          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Language &amp; Region</h2>
            <div className="flex justify-between items-center">
              <p className="text-sm">Language</p>
              <span className="text-sm text-muted-foreground">English</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">Region</p>
              <span className="text-sm text-muted-foreground">United States</span>
            </div>
          </section>
          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Privacy</h2>
            <p className="text-sm text-muted-foreground">Manage your data and privacy preferences in your profile settings.</p>
          </section>
        </div>
      </div>
    </PageShell>
  );
};

export default Settings;
