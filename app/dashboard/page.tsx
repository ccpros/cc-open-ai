import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
