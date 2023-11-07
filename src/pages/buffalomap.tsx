import dynamic from "next/dynamic";
import Footer from "~/components/Information/Footer";
import { Layout } from "~/components/Shared/Layout";

const Dynamap = dynamic(() => import("~/components/BuffaloMap/dynamicMap"), {
  ssr: false,
});

const BuffaloMap = () => {
  return (
    <>
      <Layout>
        <div
          id="map"
          className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-800"
        >
          <div className="py-3 text-3xl font-bold text-white">Buffalo Map</div>
          <Dynamap />
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default BuffaloMap;
