import { signOut } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  signOut();
  return redirect("/");
}
