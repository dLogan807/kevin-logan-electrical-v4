"use client"

import { useMantineColorScheme, Button, Group, isMantineColorScheme } from '@mantine/core';

export function ThemeSelector() {
  const { setColorScheme } = useMantineColorScheme();

  setColorScheme('auto');

  return (
    <Button onClick={() => ToggleColourScheme}>Toggle Colour</Button>
  );
}

function ToggleColourScheme() {
  const { setColorScheme } = useMantineColorScheme();

  if (isMantineColorScheme('light')) {
    setColorScheme('dark')
  }
}