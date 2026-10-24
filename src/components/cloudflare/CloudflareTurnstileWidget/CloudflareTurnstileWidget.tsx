import { useComputedColorScheme } from "@mantine/core";

export default function CloudflareTurnstileWidget() {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  return (
    <div
      className="cf-turnstile"
      data-theme={computedColorScheme}
      data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
    />
  );
}
