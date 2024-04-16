import Head from "next/head";
import Hero from "~/components/Hero";
import Information from "~/components/Information";
import AlertMessageDialog from "~/components/Shared/AlertMessageDialog";
import { Layout } from "~/components/Shared/Layout";
import PleaseConnectWalletDialog from "~/components/Shared/PleaseConnectWalletDialog";
import QrCodeGenerator from "~/components/Member/QrCodeGenerator";

export default function Home() {
  return (
    <>
      <Layout>
        <Hero />
        <Information />
        <PleaseConnectWalletDialog />
        <AlertMessageDialog
          title={"ประกาศ!"}
          message={"เปิดให้สมัครสมาชิก 26 สิงหาคม นี้ !"}
        />
      </Layout>
    </>
  );
}
