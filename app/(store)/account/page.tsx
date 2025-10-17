// app/account/page.tsx
import AccountDashboard from "./AccountDashboard";

export default async function AccountPage() {
  const { getUserDashboard } = await import("@/lib/data");
  const dashboard = await getUserDashboard();

  return <AccountDashboard dashboard={dashboard} />;
}
