import { prisma } from "~/server/db";

export const addMicrochips = async (microchips: string[]) => {
  const preparedData = microchips.map((m) => ({ microchip: m }));
  try {
    const output = await prisma.microchip.createMany({
      data: preparedData,
      skipDuplicates: true,
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

export const checkIfHasMicrochip = async (microchipId: string) => {
  try {
    const microchip = await prisma.microchip.findUnique({
      where: {
        microchip: microchipId,
      },
    });

    if (!microchip) {
      return false;
    }
    return true;
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
    // console.log(microchip);
    return microchip;
  } catch (error) {
    throw new Error(
      "low-level: cannot find any microchip avaliable in database"
    );
  }
};

export const markMicrochipAsSold = async (microchip: string) => {
  try {
    const marked = await prisma.microchip.update({
      data: {
        sold: true,
      },
      where: {
        microchip,
      },
    });
    if (!marked) {
      throw new Error(`low-level: marked #${microchip} as sold failed`);
    }
    return marked;
  } catch (error) {
    throw new Error(`low-level: cannot mark #${microchip} as sold`);
  }
};

export const markMicrochipAsActive = async (microdhipId: string) => {
  try {
    const marked = await prisma.microchip.update({
      data: {
        active: true,
      },
      where: {
        microchip: microdhipId,
      },
    });
    if (!marked) {
      throw new Error(`low-level: marked #${microdhipId} as active failed`);
    }
    return marked;
  } catch (error) {
    throw new Error(`low-level: cannot mark #${microdhipId} as active`);
  }
};
