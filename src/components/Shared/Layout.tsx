import Head from "next/head";
import React, { ReactNode } from "react";
import Navbar from "../Nav";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>สมาคมอนุรักษ์ และพัฒนาควายไทย</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {children}
    </>
  );
};