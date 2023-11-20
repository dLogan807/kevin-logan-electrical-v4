"use client";

import { useState } from "react";
import { Container, Group, Burger, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../assets/logo.png";
import Image from "next/image";
import classes from "./navbar.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

interface ILink {
  link: string;
  label: string;
}

const links: ILink[] = [
  { link: "/", label: "Home" },
  { link: "/aboutus", label: "About Us" },
  { link: "/rateandservices", label: "Rate & Services" },
  { link: "/contactus", label: "Contact Us" },
];

//Load the theme icon lazily
const DynamicThemeSelector = dynamic(
  () => import("./themeSelector").then((mod) => mod.ThemeSelector),
  {
    ssr: false,
    loading: () => (
      <ActionIcon variant="default" size="lg" aria-label="Toggle color theme">
        <IconLoader2 className={classes.icon_loading} />
      </ActionIcon>
    ),
  }
);

//Navbar component
export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[GetRouteIndex()].link);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Image src={logo} height="25" alt="logo" />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <DynamicThemeSelector />

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}

//Return the index of the currently navigated route
function GetRouteIndex(): number {
  const pathname = usePathname();

  switch (pathname) {
    case "/aboutus":
      return 1;
    case "/rateandservices":
      return 2;
    case "/contactus":
      return 3;
    default:
      return 0;
  }
}