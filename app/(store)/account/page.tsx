import AccountDashboard from './AccountDashboard';
import { getUserDashboard } from '@/lib/data';

export default async function AccountPage() {
  const dashboard = await getUserDashboard();
  return <AccountDashboard dashboard={dashboard} />;
}
