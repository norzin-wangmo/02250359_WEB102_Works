import Link from "next/link";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "TikTok Web — Web 102",
  description: "Feed and Supabase uploads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0a" }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
