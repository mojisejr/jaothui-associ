import { useBitkubNext } from "~/contexts/bitkubNextContext";
import Footer from "~/components/Information/Footer";
import { useEffect, useState } from "react";
import ApprovementDashBoard from "~/components/Dashboard/Dashboard";
import Unauthurized from "~/components/Shared/Unauthorized";
import { useRouter } from "next/router";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import { Layout } from "~/components/Shared/Layout";

const Approvement = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { isConnected } = useBitkubNext();
  const { replace } = useRouter();

  const { admin, isSuccess: adminOK, isError: adminErr } = useIsAdmin();

  useEffect(() => {
    if (isConnected) {
      if (admin && adminOK) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        void replace("/");
      }
    }
    if (!isConnected) void replace("/");
  }, [isAdmin, admin, isConnected, adminOK, adminErr]);

  if (!isAdmin) {
    return (
      <>
        <Unauthurized message="กำลังกลับไปหน้าหลัก.." />
      </>
    );
  }

  if (!isConnected) {
    return (
      <>
        <Unauthurized message="กำลังกลับไปหน้าหลัก.." />
      </>
    );
  }

  return (
    <>
      <Layout>
        <ApprovementDashBoard />
        <Footer />
      </Layout>
    </>
  );
};

export default Approvement;
