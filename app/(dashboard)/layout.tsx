import Dashboard from "@/imports/account/page/Sidebar";
import "tui-calendar/dist/tui-calendar.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Dashboard>{children}</Dashboard>
    </div>
  );
};

export default Layout;
