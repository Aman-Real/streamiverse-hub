import { Calendar, Edit, Mail, User } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { DEMO_USER } from "@/config/app.config";

const Profile = () => (
  <PageShell className="text-foreground">
    <div className="pt-24 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
          <User className="w-12 h-12 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{DEMO_USER.name}</h2>
          <p className="text-muted-foreground text-sm flex items-center gap-1"><Mail className="w-4 h-4" /> {DEMO_USER.email}</p>
          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1"><Calendar className="w-4 h-4" /> Member since {DEMO_USER.memberSince}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Display Name</p>
            <p className="text-muted-foreground text-sm">{DEMO_USER.name}</p>
          </div>
          <Edit className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-muted-foreground text-sm">{DEMO_USER.email}</p>
          </div>
          <Edit className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Subscription</p>
            <p className="text-muted-foreground text-sm">{DEMO_USER.plan}</p>
          </div>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Active</span>
        </div>
      </div>
    </div>
  </PageShell>
);

export default Profile;
