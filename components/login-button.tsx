"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();

  const login = async () => {
    router.push("/auth/login");
  };

  return (
    <Button variant={"default"} onClick={login}>
      Log in
    </Button>
  );
}

export function LoginLink() {
  return (
    <Link href="/auth/login" className="w-full cursor-pointer">
      Log in
    </Link>
  );
}
