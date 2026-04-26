"use client";

import { useClerk } from "@clerk/nextjs";

export function AuthLogoutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
      className="w-full py-2.5 rounded-[8px] text-[13px] font-semibold"
      style={{ background: "rgba(0,0,0,0.08)", color: "#111" }}
    >
      Log out
    </button>
  );
}
