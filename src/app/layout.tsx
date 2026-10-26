import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Alpha Academy",
  description: "The Alpha Academy",
  icons: {
    icon: "/jubilee-group-logo.png",
    shortcut: "/jubilee-group-logo.png",
    apple: "/jubilee-group-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
