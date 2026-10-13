import { Metadata } from "next";
import { headers } from "next/headers";
import { getCurrentSession } from "@/actions/mongodb/sessions/cookie";
import { redirect } from "next/navigation";
import LoginClient from "@/components/routeClients/LoginClient/LoginClient";

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

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { session } = await getCurrentSession();
  if (session !== null) return redirect("/admin");

  const [{ logout }, requestHeaders] = await Promise.all([
    searchParams,
    headers(),
  ]);
  const nonce = requestHeaders.get("x-nonce") || "";

  return <LoginClient nonce={nonce} loggedOut={logout !== undefined} />;
}
