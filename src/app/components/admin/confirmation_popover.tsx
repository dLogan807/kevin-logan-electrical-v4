import {
  Button,
  ButtonVariant,
  DefaultMantineColor,
  Group,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import React, { useState } from "react";

export default function ConfirmationPopover({
  children,
  dialogue,
  buttonText,
  buttonTooltip,
  buttonColour,
  buttonVariant,
  clickAction,
}: {
  children?: React.ReactNode;
  dialogue: string;
  buttonText: string;
  buttonTooltip?: string;
  buttonColour: DefaultMantineColor | undefined;
  buttonVariant: ButtonVariant;
  clickAction: () => void;
}) {
  const [confirmIsOpened, setConfirmIsOpened] = useState<boolean>(false);

  const outerButton: React.ReactElement = (
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
  );

  return (
    <Popover
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={confirmIsOpened}
      onChange={setConfirmIsOpened}
    >
      <Popover.Target>
        {buttonTooltip ? (
          <Tooltip label={buttonTooltip}>{outerButton}</Tooltip>
        ) : (
          outerButton
        )}
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
