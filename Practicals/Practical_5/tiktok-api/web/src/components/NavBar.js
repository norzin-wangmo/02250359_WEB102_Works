"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getToken, setToken } from "@/lib/api";

export default function NavBar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));
  }, [pathname]);

  return (
    <header
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #222",
        background: "#111",
      }}
    >
      <Link href="/" style={{ color: "#fafafa", fontWeight: 700, textDecoration: "none" }}>
        TikTok Web
      </Link>
      <Link href="/upload" style={{ color: "#93c5fd", textDecoration: "none" }}>
        Upload
      </Link>
      {!loggedIn ? (
        <>
          <Link href="/login" style={{ color: "#e5e5e5", textDecoration: "none", marginLeft: "auto" }}>
            Log in
          </Link>
          <Link href="/register" style={{ color: "#e5e5e5", textDecoration: "none" }}>
            Register
          </Link>
        </>
      ) : (
        <button
          type="button"
          style={{ marginLeft: "auto", cursor: "pointer" }}
          onClick={() => {
            setToken(null);
            setLoggedIn(false);
            window.location.href = "/";
          }}
        >
          Log out
        </button>
      )}
    </header>
  );
}
