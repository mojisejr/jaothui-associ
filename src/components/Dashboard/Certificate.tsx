import Image from "next/image";
import { api } from "~/utils/api";
import { parseThaiDate } from "~/server/api/utils/parseThaiDate";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

interface CertificateProps {
  microchip: string;
  no: number;
  year: number;
  bornAt: string;
  owner: string;
}

const CertificateMobile = ({
  microchip,
  no,
  year,
  bornAt,
  owner,
}: CertificateProps) => {
  const [birthdate, setBirthdate] = useState<{
    date: string;
    thaiMonth: string;
    thaiMonth2: string;
    thaiYear: string;
    thaiYear2: string;
  }>();
  const certificateRef = useRef<HTMLDivElement>(null);
  const {
    data: metadata,
    isLoading,
    isSuccess: metadataLoaded,
  } = api.certification.getMetadataByMicrochip.useQuery({
    microchip,
  });

  const {
    data: cert,
    isLoading: certLoading,
    isSuccess: certLoaded,
  } = api.certification.getCert.useQuery({ microchip });

  useEffect(() => {
    if (certLoaded || metadataLoaded) {
      const parsed = parseThaiDate(metadata!.birthdate * 1000);
      setBirthdate(
        parsed as {
          date: string;
          thaiMonth: string;
          thaiMonth2: string;
          thaiYear: string;
          thaiYear2: string;
        }
      );
    }
  }, [cert, certLoaded, metadata, metadataLoaded]);

  //   async function handleDownloadImage() {
  //     if (!certificateRef) return;
  //     const canvas = await html2canvas(certificateRef?.current!);
  //     const data = canvas.toDataURL("image/png");
  //     const link = document.createElement("a");

  //     link.href = data;
  //     link.download = `certificate-${new Date().getTime().toString()}.png`;

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }

  if (isLoading || certLoading) {
    return (
      <div className="container flex min-h-[600px]  w-[1000px] items-center justify-center bg-gradient-to-br from-[#EEEEEE] via-[#EEEDEB] to-[#EEEEEE] p-8 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="loading loading-spinner loading-lg text-[#ffffff]"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className=" relative shadow-xl">
      <div
        ref={certificateRef}
        className="container relative min-h-[250px] max-w-[425px]  bg-gradient-to-br bg-gradient-to-br from-[#EEEEEE] via-[#EEEDEB] to-[#EEEEEE] p-2"
      >
        <img
          className="absolute bottom-[15%] right-[15%] w-32 opacity-20"
          src="/images/logo-gray.png"
          width={80}
          height={80}
          alt="water-mark"
        />
        <div className="logo-text-qr flex items-center justify-between">
          <div>
            <img
              className="w-16"
              src="/images/logo.png"
              width={80}
              height={80}
              alt="kwaithai-logo"
            />
          </div>
          <div className="text-center">
            <div className="text-[8px] font-semibold">
              CERTIFICATE OF ENTRY IN HEARD REGISTRY OF THAI BUFFALO
            </div>
            <div className="text-[10px] font-semibold">
              สมาคมอนุรักษ์และพัฒนาควายไทย
            </div>
            <div className="text-[8px] font-semibold">
              ASSOC. FOR THAI BUFFALO CONSERVATION AND DEVELOPMENT
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm">
              <QRCodeSVG
                value={`https://jaothui.com/cert/${microchip}`}
                bgColor="none"
              />
            </div>
            <div className="text-[8px]">
              เลขที่{" "}
              <span className="text-[8px] font-bold">
                {no}/{year + 543}
              </span>
            </div>
          </div>
        </div>
        <div className="upper-zonep grid grid-cols-10 gap-1 p-1">
          {/** line 1 */}
          <div className="col-span-5 text-[8px]">
            ใบพันธุ์ประวัติควายชื่อ{" "}
            <span className="text-[8px] font-semibold">{metadata!.name}</span>
          </div>
          <div className="col-span-5 text-[8px]">
            หมายเลขประจำตัวสัตว์{" "}
            <span className="text-[8px] font-semibold">
              {metadata!.certify.microchip}
            </span>
          </div>
          {/** line 2 */}
          <div className="col-span-2 text-[8px]">
            เกิดวันที่{" "}
            {birthdate ? (
              <span className="text-[8px] font-semibold">
                {birthdate.date ?? "N/A"}
              </span>
            ) : (
              "N/A"
            )}
          </div>
          <div className="col-span-2 text-[8px]">
            เดือน{" "}
            {birthdate ? (
              <span className="text-[8px] font-semibold">
                {birthdate.thaiMonth ?? "N/A"}
              </span>
            ) : (
              "N/A"
            )}
          </div>
          <div className="col-span-2 text-[8px]">
            พ.ศ.{" "}
            {birthdate ? (
              <span className="text-[8px] font-semibold">
                {birthdate.thaiYear ?? "N/A"}
              </span>
            ) : (
              "N/A"
            )}
          </div>
          <div className="col-span-2 text-[8px]">
            ควายไทยสี{" "}
            <span className="text-[8px] font-semibold">
              {metadata!.color.toLowerCase() === "black" ? "ดำ" : "เผือก"}
            </span>
          </div>
          <div className="col-span-2 text-[8px]">
            เพศ{" "}
            <span className="text-[8px] font-semibold">
              {metadata!.sex.toLowerCase() === "female" ? "เมีย" : "ผู้"}
            </span>
          </div>
          {/** line 3 */}
          <div className="col-span-10 text-[8px]">
            ชื่อผู้ครอบครองควาย{" "}
            <span className="text-[8px] font-semibold">{owner}</span>
          </div>
          {/** line 4 */}
          <div className="col-span-10 text-[8px]">
            สถานที่เกิด{" "}
            <span className="text-[8px] font-semibold">{bornAt}</span>
          </div>
        </div>
        <div className="lower-zone grid grid-cols-2 place-items-center gap-2 px-2 py-1">
          <div className="relative h-[90px] w-[130px]">
            <Image
              fill
              src={metadata!.imageUri}
              // width={130}
              // height={90}
              style={{ objectFit: "contain" }}
              alt="buffalo-image"
            />
          </div>

          <div className="flex w-full flex-col gap-4 text-[8px]">
            <div className="flex items-center justify-evenly">
              <div>
                พ่อ{" "}
                <span className="text-[8px] font-semibold">
                  {cert?.dadId != null
                    ? (JSON.parse(cert?.dadId) as [string, string])[1]
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  ปู่{" "}
                  <span className="text-[8px] font-semibold">
                    {cert?.fGranDadId != null
                      ? (JSON.parse(cert?.fGranDadId) as [string, string])[1]
                      : "N/A"}
                  </span>
                </div>
                <div>
                  ย่า{" "}
                  <span className="text-[8px] font-semibold">
                    {cert?.fGrandMomId != null
                      ? (JSON.parse(cert?.fGrandMomId) as [string, string])[1]
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-evenly">
              <div>
                แม่{" "}
                <span className="text-[8px] font-semibold">
                  {cert?.momId != null
                    ? (JSON.parse(cert?.momId) as [string, string])[1]
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  ตา
                  <span className="text-[8px] font-semibold">
                    {cert?.mGrandDadId != null
                      ? (JSON.parse(cert?.mGrandDadId) as [string, string])[1]
                      : "N/A"}
                  </span>
                </div>
                <div>
                  ยาย{" "}
                  <span className="text-[8px] font-semibold">
                    {cert?.mGrandMomId != null
                      ? (JSON.parse(cert.mGrandMomId) as [string, string])[1]
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="signature-zone my-3 grid grid-cols-4 text-[7px]">
          <div className="col-span-1"></div>
          <div className="col-span-3 flex justify-evenly">
            <div className="flex flex-col items-center text-[5px]">
              <figure className="w-16">
                <Image
                  src={
                    cert?.approvers.find((approver) => approver.position == 0)
                      ?.signatureUrl as string
                  }
                  height={200}
                  width={200}
                  alt="signature"
                />
              </figure>
              <span className="font-semibold">{`(${
                cert?.approvers.find((approver) => approver.position == 0)?.user
                  .name as string
              })`}</span>
              <span>
                {
                  cert?.approvers.find((approver) => approver.position == 0)
                    ?.job as string
                }
              </span>
            </div>
            <div className="flex flex-col items-center text-[5px]">
              <figure className="w-16">
                <Image
                  src={
                    cert?.approvers.find((approver) => approver.position == 1)
                      ?.signatureUrl as string
                  }
                  height={200}
                  width={200}
                  alt="signature"
                />
              </figure>
              <span className="font-semibold">{`(${
                cert?.approvers.find((approver) => approver.position == 1)?.user
                  .name as string
              })`}</span>
              <span>
                {
                  cert?.approvers.find((approver) => approver.position == 1)
                    ?.job as string
                }
              </span>
            </div>
            <div className="flex flex-col items-center text-[5px]">
              <figure className="w-16">
                <Image
                  src={
                    cert?.approvers.find((approver) => approver.position == 2)
                      ?.signatureUrl as string
                  }
                  height={200}
                  width={200}
                  alt="signature"
                />
              </figure>
              <span className="font-semibold">{`(${
                cert?.approvers.find((approver) => approver.position == 2)?.user
                  .name as string
              })`}</span>
              <span>
                {
                  cert?.approvers.find((approver) => approver.position == 2)
                    ?.job as string
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateMobile;
