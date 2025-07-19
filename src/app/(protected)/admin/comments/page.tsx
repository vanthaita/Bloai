import AdminSidebar from '../components/AdminSidebar';
import AdminCommentsSection from '../components/AdminCommentsSection';

export default function AdminCommentsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <AdminCommentsSection />
      </main>
    </div>
  );
} 