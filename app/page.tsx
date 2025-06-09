import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to CCPROS</h1>
      <p>
        We build technology solutions focused on social justice and empowerment.
        Learn more <Link href="/about" className="text-amber-700 underline">about us</Link>.
      </p>
      <div className="border-2 border-dashed border-amber-700 rounded p-8 text-center">
        Chat interface coming soon.
      </div>
    </div>
  );
}
