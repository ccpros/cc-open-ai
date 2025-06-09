import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/app/sanity/client";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await client.fetch(
    `*[_type == "profile" && user._ref == $id][0]`,
    { id: user.id }
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome {user.fullName}</p>
      {profile && (
        <div className="border p-4 rounded space-y-2">
          <p className="font-semibold">@{profile.handle}</p>
          {profile.bio && <p>{profile.bio}</p>}
        </div>
      )}
    </div>
  );
}
