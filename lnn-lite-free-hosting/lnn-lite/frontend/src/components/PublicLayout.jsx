import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import BreakingNewsTicker from './BreakingNewsTicker';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <BreakingNewsTicker />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
