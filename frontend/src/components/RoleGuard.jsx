"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ allowedRoles, children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.replace("/sign-in");

    const role = user?.publicMetadata?.role;
    if (!allowedRoles.includes(role)) router.replace("/unauthorized");
  }, [isSignedIn, isLoaded, user, router, allowedRoles]);

  if (!isLoaded || !isSignedIn) return <p>Loading...</p>;

  return <>{children}</>;
}
