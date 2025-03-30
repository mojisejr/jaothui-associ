import axios from "axios";

const paymentURL = process.env.N8N_PAYMENT_NOTIFY_URL!;
const approvemenURL = process.env.N8N_APPROVMENT_NOTIFY_URL!;
const token = process.env.N8N_NOTIFY_TOKEN!;

export const n8nRegisterNotify = async ({
  wallet,
  name,
  isLifeTime,
}: {
  wallet: string;
  name: string | null;
  isLifeTime: string;
}) => {
  try {
    const endpoint = paymentURL;
    const response = await axios.post(
      endpoint,
      {
        wallet,
        name,
        isLifeTime,
        approveUrl: "https://kwaithai.com",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
};

export async function n8nApprovementNotify({
  microchip,
  buffaloName,
  ownerName,
  buffaloUrl,
  approverName,
}: {
  microchip: string;
  buffaloName: string;
  ownerName?: string;
  buffaloUrl?: string;
  approverName?: string;
}) {
  try {
    const endpoint = approvemenURL;
    const response = await axios.post(
      endpoint,
      {
        microchip,
        buffaloName,
        ownerName,
        buffaloUrl,
        approverName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
}
