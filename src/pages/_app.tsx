import type { AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { BitkubNextProvider } from "~/contexts/bitkubNextContext";
import Script from "next/script";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <BitkubNextProvider>
      <Component {...pageProps} />
    </BitkubNextProvider>
  );
};

export default api.withTRPC(MyApp);
