/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import qs from "qs";

export async function tgRegistrationNotify({
  wallet,
  name,
  isLifeTime,
}: {
  wallet: string;
  name: string | null;
  isLifeTime: string;
}) {
  try {
    await axios.get(process.env.tg_payment_url as string, {
      params: {
        chat_id: process.env.tg_chat_id,
        text: qs.stringify({
          message: `แจ้งเตือนสมัครสมาชิก
        Wallet: ${wallet}
        
        ชื่อ:  ${name ? name : "ไม่ระบุชื่อ"}
        
        สถานะ: ${isLifeTime ? "ตลอดชีพ" : "รายปี"} 
        
        กรุณาตรวจสอบชำระเงิน 📌
        https://kwaithai.com`,
        }),
      },
    });
    // console.log("notification response", response);
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
}

export async function tgMicrochipPaymentNotify({
  wallet,
  name,
  microchip,
  slipUrl,
}: {
  wallet: string;
  name: string | null;
  microchip: string;
  slipUrl: string;
}) {
  try {
    const token = process.env.line_microchip_payment as string;
    const response = await axios.post(
      process.env.line_uri as string,
      /*การแจ้งเตือนสมัครสมาชิก✨️
  Wallet :

  ชื่อ : 

  สถานะ : ตลอดชีพ

  กรุณาตรวจสอบการโอนเงิน📍*/
      qs.stringify({
        message: `แจ้งเตือนออเดอร์ไมโครชิพ
        Wallet: ${wallet}
        
        ชื่อควาย:  ${name ? name : "ไม่ระบุชื่อ"}
        
        เลขไมโครชิพ: ${microchip} 

        slipUrl: ${slipUrl}
        
        กรุณาตรวจสอบชำระเงิน 📌
        https://kwaithai.com`,
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log("notification response", response);
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
}

export async function tgCertificationApprovementNotify({
  microchip,
  buffaloName,
  ownerName,
  approverName,
}: {
  microchip: string;
  buffaloName: string;
  ownerName?: string;
  approverName?: string;
}) {
  try {
    const token = process.env.line_certification_approvment as string;
    const response = await axios.post(
      process.env.line_uri as string,
      qs.stringify({
        message: `แจ้งเตือนอนุมัติคำร้องของ
        ✅ เจ้าของควาย: ${ownerName ?? "ไม่พบ"}  
        ✅ ชื่อควาย:  ${buffaloName ?? "ไม่พบ"}
        ✅ เลขไมโครชิพ: ${microchip} 

        📝 ผู้อนุมัติ ${approverName ?? "ไม่พบ"}
        `,
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/x-www-form-urlencoded",
        },
      }
    );
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
}
