import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";
import AddFriendButton from "@/components/AddFriendButton";

export default async function UserProfilePage({ params }: { params: { handle: string } }) {
  const profile = await client.fetch(
    `*[_type=='profile' && handle==$handle][0]{
      _id, handle, bio, jobTitle, company, website, location, avatar,
      "userId": user._ref,
      "fullName": user->fullName
    }`,
    { handle: params.handle }
  );

  if (!profile) return <div className="container mx-auto py-10">User not found</div>;

  const user = await currentUser();
  let friendship: any = null;
  if (user) {
    const viewerId = await ensureUser({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      fullName: user.fullName,
    });
    friendship = await client.fetch(
      '*[_type=="friendship" && ((user._ref==$viewer && friend._ref==$target) || (user._ref==$target && friend._ref==$viewer))][0]',
      { viewer: viewerId, target: profile.userId }
    );
  }

  const posts = await client.fetch(
    `*[_type=='post' && author._ref==$id]|order(createdAt desc){ _id,title }`,
    { id: profile.userId }
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">{profile.fullName}</h1>
      {user && user.id !== profile.userId.replace('user_', '') && (
        <AddFriendButton targetId={profile.userId} existing={friendship} />
      )}
      {profile.bio && <p>{profile.bio}</p>}
      <div className="space-y-2">
        <h2 className="font-semibold">Posts</h2>
        <ul className="list-disc list-inside space-y-1">
          {posts.map((post: any) => (
            <li key={post._id}>
              <Link href={`/posts/${post._id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
