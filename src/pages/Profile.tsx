import { Calendar, Camera, ImagePlus, LoaderCircle, Mail, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import DetailRow from "@/components/common/DetailRow";
import EditableField from "@/components/common/EditableField";
import PageHeader from "@/components/common/PageHeader";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import PageShell from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROFILE_CONFIG } from "@/config/profile.config";
import { useAccount } from "@/features/profile/hooks/useAccount";
import { useProfile } from "@/features/profile/hooks/useProfile";

const validateDisplayName = (name: string) => {
  if (!name) return "Enter a display name.";
  if (name.length > PROFILE_CONFIG.displayName.maxLength) {
    return `Use ${PROFILE_CONFIG.displayName.maxLength} characters or fewer.`;
  }
  return null;
};

/** My Profile: photo, display name (editable), email and plan. Changes save to the account's database record. */
const Profile = () => {
  const account = useAccount();
  const { updateDisplayName, updatePhoto, removePhoto } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState<"upload" | "remove" | null>(null);

  const choosePhoto = () => fileInputRef.current?.click();

  const onPhotoChosen = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear the input so choosing the same file again still triggers a change.
    event.target.value = "";
    if (!file) return;
    setPhotoBusy("upload");
    try {
      await updatePhoto(file);
      toast.success("Profile photo saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save your photo. Try again.");
    } finally {
      setPhotoBusy(null);
    }
  };

  const onRemovePhoto = async () => {
    setPhotoBusy("remove");
    try {
      await removePhoto();
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't remove your photo. Try again.");
    } finally {
      setPhotoBusy(null);
    }
  };

  const saveDisplayName = async (name: string) => {
    await updateDisplayName(name);
    toast.success("Display name saved");
  };

  return (
    <PageShell className="text-foreground" withFooter>
      <div className="page-container-narrow">
        <PageHeader title="My Profile" />

        <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <button
            type="button"
            onClick={choosePhoto}
            disabled={photoBusy !== null}
            aria-label={account.photoUrl ? "Change profile photo" : "Add a profile photo"}
            className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ProfileAvatar name={account.name} src={account.photoUrl} size="xl" className="border-2" />
            <span className="absolute inset-0 grid place-items-center rounded-full bg-background/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Camera className="h-6 w-6 text-foreground" />
            </span>
            <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
              {photoBusy === "upload" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </span>
          </button>
          <div className="min-w-0 space-y-1">
            <h2 className="break-words text-xl font-semibold">{account.name}</h2>
            <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{account.email}</span>
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" /> Member since {account.memberSince ?? "—"}
            </p>
          </div>
        </section>

        <div className="space-y-4">
          <DetailRow
            title="Profile Picture"
            description={
              account.hasUploadedPhoto
                ? "Shown on your profile and in the menu. JPG, PNG or WebP."
                : "Add a photo so your profile feels like yours. JPG, PNG or WebP."
            }
            action={
              <>
                <Button variant="outline" size="sm" onClick={choosePhoto} disabled={photoBusy !== null}>
                  {photoBusy === "upload" ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
                  <span className="hidden sm:inline">{account.hasUploadedPhoto ? "Change" : "Upload"}</span>
                  <span className="sr-only sm:hidden">{account.hasUploadedPhoto ? "Change photo" : "Upload photo"}</span>
                </Button>
                {account.hasUploadedPhoto && (
                  <Button variant="ghost" size="icon" onClick={onRemovePhoto} disabled={photoBusy !== null} aria-label="Remove profile photo">
                    {photoBusy === "remove" ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                  </Button>
                )}
              </>
            }
          />
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={onPhotoChosen} />

          <EditableField
            label="Display Name"
            value={account.name}
            onSave={saveDisplayName}
            maxLength={PROFILE_CONFIG.displayName.maxLength}
            placeholder="Your name"
            validate={validateDisplayName}
          />

          <DetailRow title="Email" description={account.email} />

          <DetailRow
            title="Subscription"
            description={account.planLabel}
            action={<Badge variant="brand" className="normal-case tracking-normal">Active</Badge>}
          />
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;
