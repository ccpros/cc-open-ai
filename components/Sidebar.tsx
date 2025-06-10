"use client";

import { useRef } from "react";
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

interface SidebarProps {
  user: SidebarUser;
  profile?: {
    handle?: string;
    bio?: string;
    jobTitle?: string;
    company?: string;
    website?: string;
    location?: string;
    avatar?: SanityImage;
  } | null;
}

export default function Sidebar({ user, profile }: SidebarProps) {
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
              await fetch("/api/avatar", { method: "POST", body: form });
              toast.dismiss(t);
            }}
          >
            Upload
          </Button>
        </div>
      </div>
    ));

  const openFieldPopup = (field: string, label: string) => {
    const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    toast.custom((t) => (
      <div className="p-4 rounded-md bg-background space-y-2 shadow">
        {field === "bio" ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            defaultValue={profile?.[field as keyof typeof profile] as string}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        ) : (
          <Input
            ref={ref as React.RefObject<HTMLInputElement>}
            defaultValue={profile?.[field as keyof typeof profile] as string}
          />
        )}
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
              const value = (ref.current as HTMLInputElement | HTMLTextAreaElement)?.value;
              await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ field, value }),
              });
              toast.dismiss(t);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    ));
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
          {profile?.handle ? (
            <p>{profile.handle}</p>
          ) : (
            <Button size="sm" onClick={() => openFieldPopup("handle", "Handle")}>Add handle</Button>
          )}
        </div>
        <div>
          <h3 className="font-medium">Bio</h3>
          {profile?.bio ? (
            <p className="text-sm text-muted-foreground">
              {profile.bio.length > 80 ? profile.bio.slice(0, 77) + "..." : profile.bio}
            </p>
          ) : (
            <Button size="sm" onClick={() => openFieldPopup("bio", "Bio")}>Add bio</Button>
          )}
        </div>
        <div>
          <h3 className="font-medium">Job Title</h3>
          {profile?.jobTitle ? (
            <p>{profile.jobTitle}</p>
          ) : (
            <Button size="sm" onClick={() => openFieldPopup("jobTitle", "Job Title")}>Add job title</Button>
          )}
        </div>
        <div>
          <h3 className="font-medium">Company</h3>
          {profile?.company ? (
            <p>{profile.company}</p>
          ) : (
            <Button size="sm" onClick={() => openFieldPopup("company", "Company")}>Add company</Button>
          )}
        </div>
        <div>
          <h3 className="font-medium">Website</h3>
          {profile?.website ? (
            <p>{profile.website}</p>
          ) : (
            <Button size="sm" onClick={() => openFieldPopup("website", "Website")}>Add website</Button>
          )}
        </div>
        <div>
          <h3 className="font-medium">Location</h3>
          {profile?.location ? (
            <p>{profile.location}</p>
          ) : (
            <Button size="sm" onClick={() => openFieldPopup("location", "Location")}>Add location</Button>
          )}
        </div>
      </div>
    </aside>
  );
}
