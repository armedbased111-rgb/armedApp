import AppSidebar from './AppSidebar';
import MusicPlayer from './MusicPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full pt-16">
        <main className="flex-1 overflow-auto bg-white dark:bg-neutral-900 p-4">
          {children}
        </main>
        <div className="w-full flex justify-center">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}

