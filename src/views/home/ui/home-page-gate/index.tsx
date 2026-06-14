"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/entities/user/model/types";
import { authApi, ApiError } from "@/shared/api/auth/client";
import { HomePage } from "@/views/home/ui/home-page";

export function HomePageGate() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          router.replace("/login");
          return;
        }
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !user) return null;

  return <HomePage user={user} />;
}
