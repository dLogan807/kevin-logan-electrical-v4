"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Group,
  Stack,
  Burger,
  ActionIcon,
  Overlay,
} from "@mantine/core";
import { useDisclosure, useMediaQuery, useWindowEvent } from "@mantine/hooks";
import logo from "@/assets/logo.webp";
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
import { theme } from "@/components/theme";

export enum Pages {
  // eslint-disable-next-line no-unused-vars
  Error = -1,
  // eslint-disable-next-line no-unused-vars
  Home = 0,
  // eslint-disable-next-line no-unused-vars
  AboutUs = 1,
  // eslint-disable-next-line no-unused-vars
  RateAndServices = 2,
  // eslint-disable-next-line no-unused-vars
  ContactUs = 3,
}

//Return the index of the currently navigated route
function getRouteIndex(path: string | null): Pages {
  switch (path) {
    case null:
      return Pages.Error;
    case "/":
      return Pages.Home;
    case "/aboutus":
      return Pages.AboutUs;
    case "/rateandservices":
      return Pages.RateAndServices;
    case "/contactus":
      return Pages.ContactUs;
    default:
      return Pages.Error;
  }
}

interface ILink {
  link: string;
  label: string;
  icon: Icon;
  value: Pages;
}

//Load theme icon lazily
var DynamicThemeSelector = dynamic(
  () => import("./theme_selector").then((mod) => mod.ThemeSelector),
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

const linkData: ILink[] = [
  { link: "/", label: "Home", icon: IconHome, value: Pages.Home },
  {
    link: "/aboutus",
    label: "About Us",
    icon: IconInfoSquare,
    value: Pages.AboutUs,
  },
  {
    link: "/rateandservices",
    label: "Rate & Services",
    icon: IconPlugConnected,
    value: Pages.RateAndServices,
  },
  {
    link: "/contactus",
    label: "Contact Us",
    icon: IconPhoneCall,
    value: Pages.ContactUs,
  },
];

//Navbar component
export function Navbar() {
  //Maintain path hydration
  const pathname = usePathname();
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  //Update route on path change
  const [active, setActive] = useState(getRouteIndex(path));

  useEffect(() => {
    setActive(getRouteIndex(path));
  }, [path]);

  const [opened, { toggle, close }] = useDisclosure(false);
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  //Close on escape keypress
  useWindowEvent("keydown", (event) => {
    if (event.code === "Escape" && opened) {
      event.preventDefault();
      close();
    }
  });

  //Close on window resize to desktop view
  if (isDesktop && opened) {
    close();
  }

  //Generate link elements and set active link
  const links = linkData.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.value || undefined}
      onClick={() => {
        setActive(link.value);
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
            aria-label="Kevin Logan Electrical Home"
            onClick={() => {
              setActive(linkData[Pages.Home].value);
              close();
            }}
          >
            <Image
              src={logo}
              alt="Kevin Logan Electrical logo"
              sizes={`(max-width: ${theme.breakpoints.sm}) 70vw, (max-width: ${theme.breakpoints.lg}) 50vw, (max-width: ${theme.breakpoints.xl}) 40vw`}
              priority
            />
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
