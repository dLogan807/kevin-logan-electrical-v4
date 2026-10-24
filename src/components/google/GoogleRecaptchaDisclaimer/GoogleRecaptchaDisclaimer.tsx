import { Box, Text } from "@mantine/core";
import Link from "next/link";
import classes from "./GoogleRecaptchaDisclaimer.module.css";

type GoogleRecaptchaDisclaimerProps = {
  className?: string;
};

export default function GoogleRecaptchaDisclaimer({
  className,
}: GoogleRecaptchaDisclaimerProps) {
  return (
    <Box className={className}>
      {/* prettier-ignore */}
      <Text className={classes.recaptcha_disclaimer}>
          This site is protected by reCAPTCHA and the Google <Link href="https://policies.google.com/privacy">Privacy Policy</Link> and <Link href="https://policies.google.com/terms">Terms of Service</Link> apply.
        </Text>
    </Box>
  );
}
