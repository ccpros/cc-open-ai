import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
85xwgc-codex/add-sidebar-with-user-profile-details
import type { User } from "@clerk/nextjs/server";

bfdqbu-codex/add-sidebar-with-user-profile-details

import Image from "next/image";
 
import { urlForImage } from "@/lib/sanity-image";
import type { User } from "@clerk/nextjs/server";
import type { Image as SanityImage } from "sanity";

interface SidebarProps {
  user: User;
  profile?: {
    handle?: string;
    bio?: string;
 85xwgc-codex/add-sidebar-with-user-profile-details
    avatar?: string;

    avatar?: SanityImage;

  } | null;
}

export default function Sidebar({ user, profile }: SidebarProps) {
85xwgc-codex/add-sidebar-with-user-profile-details
  const avatarUrl = profile?.avatar
    ? profile.avatar
    : user.hasImage
      ? user.imageUrl
      : undefined;
 bfdqbu-codex/add-sidebar-with-user-profile-details
  const avatarUrl = profile?.avatar
    ? urlForImage(profile.avatar).width(80).height(80).url()
    : user.hasImage
      ? user.imageUrl
      : undefined;
  const avatarUrl = profile?.avatar ? urlForImage(profile.avatar).width(64).height(64).url() : undefined;
 

  return (
    <aside className="w-64 space-y-6">
      <div className="flex flex-col items-center space-y-2 border p-4 rounded">
 85xwgc-codex/add-sidebar-with-user-profile-details
        <Avatar className="h-20 w-20 border-2 border-border">

 bfdqbu-codex/add-sidebar-with-user-profile-details
        <Avatar className="h-20 w-20 border-2 border-border">

        <Avatar className="h-16 w-16 border-2 border-border">
 
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={user.fullName || "User avatar"} />
          ) : (
            <AvatarFallback className="text-xl font-semibold">
              {user.firstName?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <p className="font-semibold">{profile?.handle || user.username || user.id}</p>
        {profile?.bio && (
          <p className="text-sm text-center text-muted-foreground">
            {profile.bio.length > 80 ? profile.bio.slice(0, 77) + "..." : profile.bio}
          </p>
        )}
      </div>
    </aside>
  );
}
