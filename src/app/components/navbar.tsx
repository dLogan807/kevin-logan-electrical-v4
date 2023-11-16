"use client";

import { useState } from "react";
import { Container, Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ThemeSelector } from "./themeSelector";
import logo from "../assets/logo.png";
import Image from "next/image";
import classes from "./navbar.module.css";

const links = [
  { link: "/home", label: "Home" },
  { link: "/aboutus", label: "About Us" },
  { link: "/rateandservices", label: "Rate & Services" },
  { link: "/contactus", label: "Contact Us" },
];

export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Image src={logo} height="25" alt="logo" />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <ThemeSelector />

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
