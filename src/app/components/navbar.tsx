"use client";

import React, { useState } from "react";
import {
  Container,
  Group,
  Stack,
  Burger,
  ActionIcon,
  Overlay,
} from "@mantine/core";
import { useDisclosure, useMediaQuery, useWindowEvent } from "@mantine/hooks";
import logo from "../assets/logo.webp";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  Icon,
  IconHome,
  IconInfoSquare,
  IconLoader2,
  IconPhoneCall,
  IconPlugConnected,
} from "@tabler/icons-react";
import classes from "./navbar.module.css";
import { theme } from "./theme";

interface ILink {
  link: string;
  label: string;
  icon: Icon;
}

const linkData: ILink[] = [
  { link: "/", label: "Home", icon: IconHome },
  { link: "/aboutus", label: "About Us", icon: IconInfoSquare },
  {
    link: "/rateandservices",
    label: "Rate & Services",
    icon: IconPlugConnected,
  },
  { link: "/contactus", label: "Contact Us", icon: IconPhoneCall },
];

//Load theme icon lazily
var DynamicThemeSelector = dynamic(
  () => import("./themeSelector").then((mod) => mod.ThemeSelector),
  {
    ssr: false,
    loading: () => (
      <ActionIcon
        className={classes.theme_icon_loading}
        aria-label="Toggle color theme"
      >
        <IconLoader2 />
      </ActionIcon>
    ),
  }
);

//Navbar component
export function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(linkData[GetRouteIndex()].link);
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  //Close on escape keypress
  useWindowEvent("keydown", (event) => {
    if (event.code === "Escape" && opened) {
      event.preventDefault();
      close();
    }
  });

  //Close on window resize
  if (isDesktop && opened) {
    close();
  }

  const links = linkData.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
        close();
      }}
    >
      <link.icon className={classes.link_icon} />
      <span>{link.label}</span>
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <Container className={classes.logo}>
          <Link
            href="/"
            onClick={() => {
              setActive(linkData[0].link);
              close();
            }}
          >
            <Image src={logo} alt="Kevin Logan Electrical logo" />
          </Link>
        </Container>
        <nav>
          <Group
            className={[classes.navbar, opened ? classes.navbar_open : ""].join(
              " "
            )}
          >
            <Group>{links}</Group>
            <Stack>{links}</Stack>
            <Overlay onClick={close} />
          </Group>
        </nav>

        <Container className={classes.inner_end}>
          <DynamicThemeSelector />
          <Burger
            opened={opened}
            onClick={toggle}
            aria-label="Toggle navigation panel"
          />
        </Container>
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
