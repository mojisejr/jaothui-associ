/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import qs from "qs";

export async function registrationNotify({
  wallet,
  name,
  isLifeTime,
}: {
  wallet: string;
  name: string | null;
  isLifeTime: string;
}) {
  try {
    const token = process.env.line as string;
    const response = await axios.post(
      process.env.line_uri as string,
      /*การแจ้งเตือนสมัครสมาชิก✨️
  Wallet :

  ชื่อ : 

  สถานะ : ตลอดชีพ

  กรุณาตรวจสอบการโอนเงิน📍*/
      qs.stringify({
        message: `แจ้งเตือนสมัครสมาชิก
        Wallet: ${wallet}
        
        ชื่อ:  ${name ? name : "ไม่ระบุชื่อ"}
        
        สถานะ: ${isLifeTime ? "ตลอดชีพ" : "รายปี"} 
        
        กรุณาตรวจสอบชำระเงิน 📌
        https://jaothui-associ.vercel.app`,
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("notification response", response);
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
}
