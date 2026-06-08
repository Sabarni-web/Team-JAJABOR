import { DM_Sans } from "next/font/google";
import "./admin.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={dmSans.variable} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
