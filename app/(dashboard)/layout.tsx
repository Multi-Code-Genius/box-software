import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Dashboard from "@/imports/account/page/Sidebar";
import "tui-calendar/dist/tui-calendar.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Dashboard>{children}</Dashboard>
      <Footer />
    </div>
  );
};

export default Layout;
