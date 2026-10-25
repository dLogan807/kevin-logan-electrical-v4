import { Metadata } from "next";
import { getCurrentSession } from "@/actions/mongodb/sessions/cookie";
import { redirect } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm/LoginForm";
import { Box, Paper, Title } from "@mantine/core";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Login | Kevin Logan Electrical - Your Trusted Electrician",
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

export default async function LoginPage() {
  const { session } = await getCurrentSession();
  if (session !== null) return redirect("/admin");

  return (
    <Box className={"content_grid"}>
      <Paper
        classNames={{ root: `${classes.login_paper} main_section` }}
        withBorder
      >
        <Title order={1} classNames={{ root: classes.login_title }}>
          Login
        </Title>
        <LoginForm />
      </Paper>
    </Box>
  );
}
