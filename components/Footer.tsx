export default function Footer() {
  return (
    <footer className="bg-amber-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} CCPROS. All rights reserved.
      </div>
    </footer>
  );
}
