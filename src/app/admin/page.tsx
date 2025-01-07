import { Button } from "@/components/ui/button";
import Link from "next/link";
export default async function AdminPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Welcome to Admin Dashboard</h2>
      <p>This page uses a different layout from the main app.</p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
}
