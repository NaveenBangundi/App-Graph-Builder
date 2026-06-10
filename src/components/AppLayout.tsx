import LeftRail from './LeftRail';
import TopBar from './TopBar';
import type { AppInfo } from '../api/mockApi';

interface AppLayoutProps {
  apps: AppInfo[];
  isLoadingApps: boolean;
  children: React.ReactNode;
}

export default function AppLayout({ apps, isLoadingApps, children }: AppLayoutProps) {
  return (
    <div className="w-screen h-screen flex bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <LeftRail />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar apps={apps} isLoadingApps={isLoadingApps} />
        <main className="flex-1 flex min-h-0 relative overflow-hidden bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
