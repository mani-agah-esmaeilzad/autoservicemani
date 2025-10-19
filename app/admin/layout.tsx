import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <AdminSidebar />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
