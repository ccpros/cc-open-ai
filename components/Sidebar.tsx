"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import { urlForImage } from "@/lib/sanity-image";
type SidebarUser = {
  id: string;
  fullName: string | null;
  firstName: string | null;
  username: string | null;
};
import type { Image as SanityImage } from "sanity";

interface Profile {
  handle?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  website?: string;
  location?: string;
  avatar?: SanityImage;
}

interface SidebarProps {
  user: SidebarUser;
  profile?: Profile | null;
}

export default function Sidebar({ user, profile: initialProfile }: SidebarProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null);

  const avatarUrl = profile?.avatar
    ? urlForImage(profile.avatar).width(64).height(64).url()
    : "https://github.com/shadcn.png";

  const fileRef = useRef<HTMLInputElement>(null);

  const openAvatarUpload = () =>
    toast.custom((t) => (
      <div className="p-4 rounded-md bg-background space-y-2 shadow">
        <Input type="file" ref={fileRef} />
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              const file = fileRef.current?.files?.[0];
              if (!file) return;
              const form = new FormData();
              form.append("file", file);
              const res = await fetch("/api/avatar", { method: "POST", body: form });
              if (res.ok) {
                const data = await res.json();
                setProfile(data.profile);
              }
              toast.dismiss(t);
            }}
          >
            Upload
          </Button>
        </div>
      </div>
    ));


  const EditProfilePopup = ({ toastId }: { toastId: string | number }) => {
    const handleRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);
    const jobTitleRef = useRef<HTMLInputElement>(null);
    const companyRef = useRef<HTMLInputElement>(null);
    const websiteRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    return (
      <div className="p-4 rounded-md bg-background space-y-2 shadow max-w-sm">
        <Input ref={handleRef} defaultValue={profile?.handle} placeholder="Handle" />
        <textarea
          ref={bioRef}
          defaultValue={profile?.bio}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Bio"
        />
        <Input ref={jobTitleRef} defaultValue={profile?.jobTitle} placeholder="Job Title" />
        <Input ref={companyRef} defaultValue={profile?.company} placeholder="Company" />
        <Input ref={websiteRef} defaultValue={profile?.website} placeholder="Website" />
        <Input ref={locationRef} defaultValue={profile?.location} placeholder="Location" />
        <div className="flex justify-end gap-2 pt-2">
          <Button size="sm" variant="ghost" onClick={() => toast.dismiss(toastId)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  handle: handleRef.current?.value,
                  bio: bioRef.current?.value,
                  jobTitle: jobTitleRef.current?.value,
                  company: companyRef.current?.value,
                  website: websiteRef.current?.value,
                  location: locationRef.current?.value,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setProfile(data.profile);
              }
              toast.dismiss(toastId);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  const openEditProfilePopup = () => {
    toast.custom((t) => <EditProfilePopup toastId={t} />);
  };

 


  return (
    <aside className="w-64 space-y-6">
      <div className="flex flex-col items-center space-y-2 border p-4 rounded">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarImage src={avatarUrl} alt={user.fullName || "User avatar"} />
          <AvatarFallback className="text-xl font-semibold">
            {user.firstName?.[0]}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold">Welcome {user.fullName}</p>
        <Button size="sm" onClick={openAvatarUpload}>Change Avatar</Button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Handle</h3>
          <p>{profile?.handle || "Not provided"}</p>
        </div>
        <div>
          <h3 className="font-medium">Bio</h3>
          {profile?.bio ? (
            <p className="text-sm text-muted-foreground">
              {profile.bio.length > 80 ? profile.bio.slice(0, 77) + "..." : profile.bio}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Not provided</p>
          )}
        </div>
        <div>
          <h3 className="font-medium">Job Title</h3>
          <p>{profile?.jobTitle || "Not provided"}</p>
        </div>
        <div>
          <h3 className="font-medium">Company</h3>
          <p>{profile?.company || "Not provided"}</p>
        </div>
        <div>
          <h3 className="font-medium">Website</h3>
          <p>{profile?.website || "Not provided"}</p>
        </div>
        <div>
          <h3 className="font-medium">Location</h3>
          <p>{profile?.location || "Not provided"}</p>
        </div>
        <Button size="sm" onClick={openEditProfilePopup} className="w-full">
          Update Profile
        </Button>
      </div>
    </aside>
  );
}
