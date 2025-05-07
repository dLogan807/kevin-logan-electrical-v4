import {
  Button,
  ButtonVariant,
  DefaultMantineColor,
  Group,
  Popover,
  Text,
} from "@mantine/core";
import React, { useState } from "react";

export default function ConfirmationPopover({
  children,
  dialogue,
  buttonText,
  buttonColour,
  buttonVariant,
  clickAction,
}: {
  children?: React.ReactNode;
  dialogue: string;
  buttonText: string;
  buttonColour: DefaultMantineColor | undefined;
  buttonVariant: ButtonVariant;
  clickAction: () => void;
}) {
  const [confimIsOpened, setConfirmIsOpened] = useState<boolean>(false);

  return (
    <Popover
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={confimIsOpened}
      onChange={setConfirmIsOpened}
    >
      <Popover.Target>
        <Button
          type="button"
          color={buttonColour}
          variant={buttonVariant}
          onClick={() => setConfirmIsOpened((o) => !o)}
        >
          <Group>
            {buttonText}
            {children}
          </Group>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text>{dialogue}</Text>
        <Group justify="center" mt="md">
          <Button
            type="button"
            color={buttonColour}
            variant="filled"
            onClick={() => {
              setConfirmIsOpened(false);
              clickAction();
            }}
          >
            {buttonText}
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}
