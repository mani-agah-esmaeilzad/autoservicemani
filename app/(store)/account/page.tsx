import AccountDashboard from './AccountDashboard';
import { getUserDashboard } from '@/lib/data';

export default function AccountPage() {
  const dashboard = getUserDashboard();
  return <AccountDashboard dashboard={dashboard} />;
}
