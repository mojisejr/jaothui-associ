import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeGeneratorProps {
  value: string;
  className?: string;
}

const QrCodeGenerator = ({ value, className }: QrCodeGeneratorProps) => {
  return (
    <div className={className}>
      <QRCodeSVG value={value} />
    </div>
  );
};

export default QrCodeGenerator;
