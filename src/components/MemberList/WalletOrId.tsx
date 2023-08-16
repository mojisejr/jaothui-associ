interface WalletOrIdProps {
  text?: string;
}

const WalletOrId = ({ text }: WalletOrIdProps) => {
  if (!text) {
    return <>N/A</>;
  }

  if (text.slice(0, 1) != "0x") {
    return <>{text}</>;
  }

  return <>{`${text.slice(0, 5)}...${text.slice(37)}`}</>;
};

export default WalletOrId;
