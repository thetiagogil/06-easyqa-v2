"use client";
import { Loading } from "@/components/shared/loading";
import { useAuthContext } from "@/contexts/auth.context";
import { WithChildren } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: WithChildren) {
  const { loading, isUserReady } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isUserReady) {
      router.replace("/setup");
    }
  }, [loading, isUserReady, router]);

  if (loading) return <Loading minHeight="100vh" />;

  return <>{children}</>;
}
