import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@clerk/nextjs/server";

interface SidebarProps {
  user: User;
  profile?: {
    handle?: string;
    bio?: string;
    avatar?: string;
  } | null;
}

export default function Sidebar({ user, profile }: SidebarProps) {
  const avatarUrl = profile?.avatar
    ? profile.avatar
    : user.hasImage
      ? user.imageUrl
      : undefined;

  return (
    <aside className="w-64 space-y-6">
      <div className="flex flex-col items-center space-y-2 border p-4 rounded">
        <Avatar className="h-20 w-20 border-2 border-border">
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
