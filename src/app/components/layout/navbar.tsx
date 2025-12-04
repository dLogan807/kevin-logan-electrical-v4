"use client";

import { useEffect, useState } from "react";
import { Group, Stack, Burger, ActionIcon, Overlay } from "@mantine/core";
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
import { Pages } from "@/components/layout/pages";
import classes from "./navbar.module.css";
import { theme } from "@/components/theme";

//Return the index of the currently navigated route
function getRoute(path: string): Pages | undefined {
  switch (path) {
    case "/":
      return Pages.Home;
    case "/aboutus":
      return Pages.AboutUs;
    case "/rateandservices":
      return Pages.RateAndServices;
    case "/contactus":
      return Pages.ContactUs;
  }

  return undefined;
}

interface ILink {
  link: string;
  label: string;
  icon: Icon;
  value: Pages;
}

//Load theme icon lazily
var DynamicThemeSelector = dynamic(
  () =>
    import("../theme_selector/theme_selector").then((mod) => mod.ThemeSelector),
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

  //Update route on manual path change
  const [active, setActive] = useState<Pages | undefined>(getRoute(pathname));

  //Update route when path changes
  useEffect(() => {
    setActive(getRoute(pathname));
  }, [pathname]);

  const [mobileNavOpened, { toggle, close }] = useDisclosure(false);
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  //Close on escape keypress
  useWindowEvent("keydown", (event) => {
    if (event.code === "Escape" && mobileNavOpened) {
      event.preventDefault();
      close();
    }
  });

  //Close on window resize to desktop view
  if (isDesktop && mobileNavOpened) {
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
      <div className={classes.inner}>
        <div className={classes.logo}>
          <Link href="/" aria-label="Kevin Logan Electrical Home">
            <Image
              src={logo}
              alt="Kevin Logan Electrical logo"
              aria-label="Kevin Logan Electrical Home"
              sizes={`(max-width: ${theme.breakpoints.sm}) 70vw, (max-width: ${theme.breakpoints.lg}) 50vw, (max-width: ${theme.breakpoints.xl}) 40vw`}
              priority
            />
          </Link>
        </div>
        <nav>
          <div
            className={[
              classes.navbar,
              mobileNavOpened ? classes.navbar_open : "",
            ].join(" ")}
          >
            <Group>{links}</Group>
            <Stack>{links}</Stack>
            <Overlay onClick={close} />
          </div>
        </nav>

        <div className={classes.inner_end}>
          <DynamicThemeSelector />
          <Burger
            opened={mobileNavOpened}
            onClick={toggle}
            aria-label="Toggle navigation panel"
          />
        </div>
      </div>
    </header>
  );
}
