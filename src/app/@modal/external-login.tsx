"use client";
import { Icons } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
interface Props {
  state: "login" | "register";
}
export default function ExternalLogin({ state }: Props) {
  const text = state === "login" ? "Đăng nhập" : "Đăng ký";
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { data: session } = useSession();
  console.log(session);
  const handleLogin = (
    provider: "google" | "facebook" | "discord" | "github",
  ) => {
    signIn(provider, {
      callbackUrl: redirect || "/",
    });
  };
  return (
    <div className="mt-2 space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleLogin("google")}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        {text} bằng Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleLogin("facebook")}
      >
        <Icons.facebook className="mr-2 h-4 w-4" />
        {text} bằng Facebook
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleLogin("discord")}
      >
        <Icons.discord className="mr-2 h-4 w-4" />
        {text} bằng Discord
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleLogin("github")}
      >
        <Icons.github className="mr-2 h-4 w-4" />
        {text} bằng GitHub
      </Button>
    </div>
  );
}
