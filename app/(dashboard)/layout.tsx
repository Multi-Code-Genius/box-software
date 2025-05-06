import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
