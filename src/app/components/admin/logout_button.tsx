"use client";

import { logout } from "@/actions/mongodb/sessions/management";
import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useLayoutEffect, useState } from "react";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useLayoutEffect(() => setIsLoggingOut(false), []);

  function handleLogout() {
    setIsLoggingOut(true);
    logout();
  }

  return (
    <Button
      variant="default"
      loading={isLoggingOut}
      onClick={handleLogout}
      rightSection={<IconLogout aria-hidden="true" />}
    >
      Logout
    </Button>
  );
}
