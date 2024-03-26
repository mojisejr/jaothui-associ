import { MappedMetadata, ParsedMetadata } from "~/interfaces/Metadata";
import { prisma } from "~/server/db";

export const getCertificationInfoOf = async (metadata: ParsedMetadata) => {
  const certificateData = await prisma.certificate.findUnique({
    where: { microchip: metadata.microchip },
    include: {
      approvers: true,
    },
  });

  return {
    microchip: metadata.microchip,
    name: metadata.name,
    approvers: certificateData?.approvers ?? [],
    isActive: certificateData?.isActive ?? false,
  };
};

export const getCertificationInfo = async (metadatas: ParsedMetadata[]) => {
  const mappedMetadata = await Promise.all(
    metadatas.map(async (metadata) => await getCertificationInfoOf(metadata))
  );

  return mappedMetadata;
};

export const filterCertificateByApprover = (
  approver: string,
  metadatas: MappedMetadata[]
) => {
  return metadatas.filter(
    (metadata) => !metadata.approvers?.find((data) => data.wallet === approver)
  );
};

export const isApprover = async (wallet: string) => {
  const found = await prisma.certificateApprover.findUnique({
    where: {
      wallet: wallet,
    },
  });

  if (!found) {
    return false;
  } else {
    return true;
  }
};

// export const isApproved = async (
//   approver: string,
//   metadata: MappedMetadata
// ) => {
//   const found = metadata.approvers?.find((data) => data.wallet === approver);

//   return found ? true : false;
// };

export const isApproved = async (approver: string, microchip: string) => {
  const metadata = await prisma.certificate.findUnique({
    where: { microchip },
    include: {
      approvers: true,
    },
  });

  const found = metadata?.approvers.find((data) => data.wallet === approver);
  return found ? true : false;
};

export const canApprove = async (approver: string, microchip: string) => {
  const permanentAddress = "0x27ea0d98E5876b70377d6d921DAE987BE48A7A2c";
  const metadata = await prisma.certificate.findUnique({
    where: { microchip },
    include: {
      approvers: true,
    },
  });

  if (metadata == null) return true;

  const hasPermanent =
    metadata?.approvers.filter((a) => a.wallet == permanentAddress).length! > 0;

  if (metadata?.approvers === undefined) return false;

  if (hasPermanent && metadata.approvers.length <= 3) {
    return true;
  } else if (!hasPermanent && metadata.approvers.length < 2) {
    return true;
  } else if (!hasPermanent && metadata.approvers.length == 2) {
    return approver == permanentAddress ? true : false;
  }
};

export const approve = async (approver: string, microchip: string) => {
  try {
    const approveValid = await canApprove(approver, microchip);
    const approvedValid = await isApproved(approver, microchip);
    if (!approveValid || approvedValid) return;
    const approved = await prisma.certificate.upsert({
      where: {
        microchip,
      },
      create: {
        microchip,
        approvers: {
          connect: {
            wallet: approver,
          },
        },
      },
      update: {
        approvers: {
          connect: {
            wallet: approver,
          },
        },
      },
      include: {
        approvers: true,
      },
    });

    if (approved.approvers.length == 3) {
      await prisma.certificate.update({
        where: { microchip },
        data: {
          isActive: true,
        },
      });
    }

    return approved;
  } catch (error) {
    console.log(error);
  }
};
