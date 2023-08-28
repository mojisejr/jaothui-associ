import Image from "next/image";
interface MemberCardProps {
  admin: boolean;
  wallet: string;
  isLifeTime: boolean;
  name: string;
}

const MemberCard = ({ admin, wallet, isLifeTime, name }: MemberCardProps) => {
  return (
    <>
      <div className="card card-compact w-96 rounded-xl bg-base-100 text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <figure className="px-3 py-3">
          <Image
            className="rounded-xl"
            src={admin ? "/images/Committee.jpg" : "/images/Member.jpg"}
            width={350}
            height={350}
            alt="member-image"
          />
        </figure>
        <div className="card-body">
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex flex-col items-start gap-3">
              <div>
                <div className="text-xl font-bold">
                  {admin ? "COMMITTEE" : "MEMBER"}
                </div>
                <div className="text-sm font-bold leading-[0.6rem] text-gray-500">{`${wallet.slice(
                  0,
                  5
                )}...${wallet.slice(38)}`}</div>
              </div>
              <div className="text-md font-bold">
                <span>TYPE: </span> {isLifeTime ? "ตลอดชีพ" : "รายปี"}{" "}
              </div>

              <div className="text-md font-bold">
                <div>COLLECTION:</div>
                <div>KWAITHAI ASSOCIATION</div>
              </div>

              <div className="text-md font-bold">{name}</div>
            </div>

            <div>
              <Image
                src="/images/QR.png"
                width={150}
                height={150}
                alt="QR-code"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCard;
