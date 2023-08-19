import Link from "next/link";
import Modal from "../Shared/Modal";
import { BsArrowUpRight } from "react-icons/bs";

interface RegisterResultProps {
  success: boolean;
}

const RegisterResultDialog = ({ success }: RegisterResultProps) => {
  return (
    <Modal id="register_result_dialog">
      <>{success ? <OkResult /> : <ErrorReuslt />}</>
    </Modal>
  );
};

const OkResult = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-xl font-bold text-green-400">
          สมัครสมาชิกเสร็จสมบูรณ์
        </div>
        <Link href="/member" className="btn-primary btn font-bold">
          <BsArrowUpRight size={30} /> ไปที่หน้า ข้อมูลสมาชิก
        </Link>
      </div>
    </>
  );
};
const ErrorReuslt = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-xl font-bold text-red-400">
          เกิดข้อผิดพลาดในการสมัคร!
        </div>
        <div>ติดต่อสมาคมเพื่อแก้ไข</div>
        <Link href="/" className="btn font-bold">
          <BsArrowUpRight size={30} /> กลับหน้าหลัก
        </Link>
      </div>
    </>
  );
};
export default RegisterResultDialog;
