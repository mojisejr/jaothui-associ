import Head from "next/head";
import About from "~/components/Information/About";
import Hero from "~/components/Hero";
import Information from "~/components/Information";
import Navbar from "~/components/Nav";

export default function Home() {
  return (
    <>
      <Head>
        <title>สมาคมอนุรักษ์ และพัฒนาควายไทย</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Hero />
      <Information />
    </>
  );
}
