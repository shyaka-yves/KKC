import { setRequestLocale } from "next-intl/server";

import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminDashboardClient />;
}

