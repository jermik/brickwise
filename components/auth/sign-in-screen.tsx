"use client";

import { useUser, useClerk, SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { BrickwiseMark } from "@/components/brand/brickwise-mark";

const BrickwiseLogo = () => (
  <Link href="/" className="flex items-center gap-2.5 mb-10 no-underline">
    <BrickwiseMark size={32} variant="dark" />
    <span className="text-[16px] font-bold tracking-[-0.4px]" style={{ color: "#111" }}>
      Brickwise
    </span>
  </Link>
);

function AlreadySignedIn() {
  const { signOut } = useClerk();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#f5f5f3" }}
    >
      <BrickwiseLogo />
      <div
        className="w-full max-w-[340px] rounded-[14px] overflow-hidden"
        style={{ border: "1px solid #e2e2e2", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div className="text-[15px] font-semibold mb-1" style={{ color: "#111" }}>
            You&apos;re already signed in
          </div>
          <div className="text-[13px]" style={{ color: "#888" }}>
            Continue to your Brickwise dashboard.
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col gap-2.5">
          <Link
            href="/dashboard"
            className="block w-full text-center py-[10px] rounded-[8px] text-[13px] font-semibold no-underline"
            style={{ background: "#111", color: "#fff" }}
          >
            Go to dashboard
          </Link>
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="w-full py-[10px] rounded-[8px] text-[13px] font-medium cursor-pointer"
            style={{ background: "#f5f5f3", color: "#555", border: "1px solid #e2e2e2" }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export function SignInScreen() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f5f3" }} />
    );
  }

  if (isSignedIn) {
    return <AlreadySignedIn />;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#f5f5f3" }}
    >
      <BrickwiseLogo />
      <SignIn
        fallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#111111",
            colorBackground: "#ffffff",
            colorInputBackground: "#ffffff",
            colorInputText: "#111111",
            borderRadius: "8px",
            fontFamily: "var(--font-inter)",
          },
          elements: {
            card: "shadow-none border border-[#e2e2e2] rounded-[12px]",
            headerTitle: "text-[18px] font-bold tracking-[-0.4px]",
            headerSubtitle: "text-[13px]",
            formButtonPrimary: "bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold",
            footerActionLink: "text-[#111] font-medium",
          },
        }}
      />
    </div>
  );
}
