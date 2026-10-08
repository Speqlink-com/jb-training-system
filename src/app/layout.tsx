import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jubilee Learning Hub",
  description: "Training, performance, and compliance operations workspace",
  icons: {
    icon: "/jubilee-logo.png",
    shortcut: "/jubilee-logo.png",
    apple: "/jubilee-logo.png",
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
