import type { Metadata } from "next";
import { SignInScreen } from "@/components/auth/sign-in-screen";

export const metadata: Metadata = {
  title: "Sign In | Brickwise",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInScreen />;
}
