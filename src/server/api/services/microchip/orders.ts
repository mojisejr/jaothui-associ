import { prisma } from "~/server/db";
import { supabase } from "~/server/supabase";

export const getMicrochipOrderOf = async (wallet: string) => {
  try {
    const microcips = await prisma.microchipOrder.findMany({
      where: {
        wallet,
      },
      include: {
        microchip: true,
      },
    });

    return microcips;
  } catch (error) {
    throw new Error("microchip loading failed");
  }
};

export const getNotCompleteMicrochipOrders = async () => {
  try {
    const microchips = await prisma.microchipOrder.findMany({
      where: {
        OR: [
          {
            shipped: false,
          },
          {
            approved: false,
          },
          {
            canMint: false,
          },
          {
            minted: false,
          },
        ],
      },
      include: {
        farm: true,
        user: true,
        microchip: true,
      },
    });

    const parsedUrls = await Promise.all(
      microchips.map((m) => {
        const microchipToUrl = supabase.storage
          .from("slipstorage/microchip")
          .getPublicUrl(m.slipUrl!);
        return {
          ...m,
          slipUrl: microchipToUrl.data.publicUrl,
        };
      })
    );

    return parsedUrls;
  } catch (error) {
    throw new Error("microchip loading failed");
  }
};

export const approveMicrochipPayment = async (
  orderId: number,
  approver: string
) => {
  try {
    const updated = await prisma.microchipOrder.update({
      data: {
        approved: true,
        approver: {
          push: approver,
        },
      },
      where: {
        id: orderId,
      },
    });
    return updated;
  } catch (error) {
    throw new Error("approve payment failed");
  }
};

export const approveShipping = async (orderId: number, approver: string) => {
  try {
    const updated = await prisma.microchipOrder.update({
      data: {
        shipped: true,
        approver: {
          push: approver,
        },
      },
      where: {
        id: orderId,
      },
    });
    return updated;
  } catch (error) {
    throw new Error("approve shipping failed");
  }
};
