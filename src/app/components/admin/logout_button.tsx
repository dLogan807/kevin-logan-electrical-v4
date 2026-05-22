"use client";

import { logout } from "@/actions/mongodb/sessions/management";
import { Button, Group, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useState } from "react";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  return (
    <Button
      variant="default"
      loading={isLoggingOut}
      onClick={() => {
        setIsLoggingOut(true);
        logout();
      }}
    >
      <Group>
        <Text>Logout</Text>
        <IconLogout aria-label="Logout" />
      </Group>
    </Button>
  );
}
