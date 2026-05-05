import type { Metadata } from "next";
import { SignUpScreen } from "@/components/auth/sign-up-screen";

export const metadata: Metadata = {
  title: "Sign Up | Brickwise",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <SignUpScreen />;
}
