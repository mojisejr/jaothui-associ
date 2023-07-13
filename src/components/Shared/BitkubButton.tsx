import {
  ReactBitkubNextOauth2,
  ReactBitkubNextOauth2Props,
} from "@bitkub-blockchain/react-bitkubnext-oauth2";

const bitkubNextProps: ReactBitkubNextOauth2Props = {
  clientId:
    process.env.NODE_ENV == "production"
      ? (process.env.NEXT_PUBLIC_client_id_prod as string)
      : (process.env.NEXT_PUBLIC_client_id_dev as string),
  redirectURI:
    process.env.NODE_ENV == "production"
      ? (process.env.NEXT_PUBLIC_redirect_prod as string)
      : (process.env.NEXT_PUBLIC_redirect_dev as string),
  mode: "redirect",
};

const ConnectBitkubNextButton = () => {
  return (
    <>
      <ReactBitkubNextOauth2 {...bitkubNextProps}>
        <button className="w768:btn-outline w768:btn w768:rounded-full">
          Connect Bitkubnext
        </button>
      </ReactBitkubNextOauth2>
    </>
  );
};

export default ConnectBitkubNextButton;
