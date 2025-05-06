import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  <div className="flex flex-col min-h-screen">
    <Header />
    {children}
    <Footer />
  </div>;
};

export default layout;
