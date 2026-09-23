import type { Metadata } from "next";
import { Toaster } from "@/components/ui/Toaster";
import "./admin.css";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin">
      {children}
      <Toaster />
    </div>
  );
}
