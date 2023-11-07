import { prisma } from "~/server/db";

export const addMicrochips = async (microchips: string[]) => {
  const preparedData = microchips.map((m) => ({ microchip: m }));
  try {
    const output = await prisma.microchip.createMany({
      data: preparedData,
    });

    if (output.count <= 0) {
      throw new Error("low-level: microchip insertion failed");
    }

    return output;
  } catch (error) {
    throw new Error("low-level: cannot add any microchip");
  }
};

export const getAllMicrochips = async () => {
  try {
    const microchips = await prisma.microchip.findMany({
      where: {
        sold: false,
      },
    });
    return microchips;
  } catch (error) {
    throw new Error(
      "low-level: cannot find any microchip avaliable in database"
    );
  }
};

// get one avaliable microchip
export const getAvaliableMicrochip = async () => {
  try {
    const microchip = await prisma.microchip.findFirst({
      where: {
        sold: false,
      },
    });
    console.log(microchip);
    return microchip;
  } catch (error) {
    throw new Error(
      "low-level: cannot find any microchip avaliable in database"
    );
  }
};

export const markMicrochipAsSold = async (id: number) => {
  try {
    const marked = await prisma.microchip.update({
      data: {
        sold: true,
      },
      where: {
        id,
      },
    });
    if (!marked) {
      throw new Error(`low-level: marked #${id.toString()} as sold failed`);
    }
    return marked;
  } catch (error) {
    throw new Error(`low-level: cannot mark #${id.toString()} as sold`);
  }
};

export const markMicrochipAsActive = async (id: number) => {
  try {
    const marked = await prisma.microchip.update({
      data: {
        active: true,
      },
      where: {
        id,
      },
    });
    if (!marked) {
      throw new Error(`low-level: marked #${id.toString()} as active failed`);
    }
    return marked;
  } catch (error) {
    throw new Error(`low-level: cannot mark #${id.toString()} as active`);
  }
};
