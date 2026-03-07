import { AdminBar } from '@/components/public/AdminBar';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminBar />
      {children}
    </div>
  );
}
