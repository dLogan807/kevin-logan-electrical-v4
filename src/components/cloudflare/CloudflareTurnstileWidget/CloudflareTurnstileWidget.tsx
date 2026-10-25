"use client";

import { Box } from "@mantine/core";
import { Turnstile } from "react-turnstile";
import classes from "./CloudflareTurnstileWidget.module.css";

type CloudflareTurnstileWidgetProp = {
  onTurnstileTokenChange: (token: string) => void;
};

export default function CloudflareTurnstileWidget({
  onTurnstileTokenChange,
}: CloudflareTurnstileWidgetProp) {
  return (
    <Box className={classes.turnstile_box}>
      <Turnstile
        sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ""}
        onVerify={onTurnstileTokenChange}
        onExpire={() => onTurnstileTokenChange("")}
        onError={() => onTurnstileTokenChange("")}
      />
    </Box>
  );
}
