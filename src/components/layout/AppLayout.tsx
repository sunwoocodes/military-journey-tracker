import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useUserStore, BRANCH_META } from '@/stores/userStore';

export default function AppLayout({ children }: { children: ReactNode }) {
  const branch = useUserStore((s) => s.branch);
  const themeClass = BRANCH_META[branch].themeClass;

  return (
    <div className={`min-h-screen bg-background ${themeClass}`}>
      <main className="mx-auto max-w-lg pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
