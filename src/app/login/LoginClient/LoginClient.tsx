"use client";

import { Box, Paper, Title } from "@mantine/core";
import classes from "./LoginClient.module.css";
import LoginForm from "@/components/forms/LoginForm/LoginForm";

export default function LoginClient() {
  return (
    <Box className={"content_grid"}>
      <Paper className={"main_section"} withBorder>
        <Title order={1} className={classes.heading}>
          Login
        </Title>
        <LoginForm />
      </Paper>
    </Box>
  );
}
