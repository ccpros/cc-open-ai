import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container mx-auto max-w-md py-10">
      <SignIn redirectUrl="/dashboard" />
    </div>
  );
}
