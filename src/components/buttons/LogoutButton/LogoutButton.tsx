"use client";

import { logout } from "@/actions/mongodb/sessions/management";
import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useTransition } from "react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <Button
      variant="default"
      loading={isPending}
      onClick={handleLogout}
      rightSection={<IconLogout aria-hidden />}
    >
      Logout
    </Button>
  );
}
