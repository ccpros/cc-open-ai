import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Build a plain user object so we don't pass a Clerk class instance to the client
  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    firstName: user.firstName,
    username: user.username,
  };

  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  let profile = await client.fetch(
    `*[_type == "profile" && user._ref == $id][0]{
      _id,
      handle,
      bio,
      jobTitle,
      company,
      website,
      location,
      avatar
    }`,
    { id: docId }
  );

  if (!profile) {
    profile = await client.create({
      _type: "profile",
      user: { _type: "reference", _ref: docId },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 flex gap-6">
      <Sidebar user={safeUser} profile={profile} />
      <div className="flex-1 flex flex-col min-h-[calc(100vh-160px)] relative">
        {children}
      </div>
    </div>
  );
}
