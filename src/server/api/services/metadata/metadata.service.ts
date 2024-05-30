// import { MappedMetadata, ParsedMetadata } from "~/interfaces/Metadata";
import { MetadataApprover } from "~/interfaces/Metadata";
import { CreatePedigreeRequest } from "~/interfaces/Pedigree";
import { prisma } from "~/server/db";
import { supabase } from "~/server/supabase";

export const saveRequestForPed = async (data: CreatePedigreeRequest) => {
  await prisma.certificate.create({
    data: {
      microchip: data.buffaloId,
      wallet: data.wallet,
      ownerName: data.ownerName,
      bornAt: data.bornAt,
      momId: data.momId,
      dadId: data.dadId,
      mGrandMomId: data.mGrandmaId,
      mGrandDadId: data.mGrandpaId,
      fGrandMomId: data.dGrandpaId,
      fGranDadId: data.dGrandpaId,
      isActive: false,
      slipUrl: supabase.storage
        .from("slipstorage/ped-slip")
        .getPublicUrl(data.slipUrl.split("\n")[0] as string).data.publicUrl,
    },
  });
};

export const getWaitForApprovementRequests = async (
  approver: string,
  approverPosition: number
) => {
  const requests = await prisma.certificate.findMany({
    where: {
      isActive: false,
      AND: [
        {
          NOT: {
            approvers: {
              some: {
                wallet: approver,
              },
            },
          },
        },
        {
          NOT: {
            approvers: {
              some: {
                position: approverPosition,
              },
            },
          },
        },
      ],
    },
  });

  return requests;
};

export const getCertificationOf = async (microchip: string) => {
  const cert = await prisma.certificate.findFirst({
    where: {
      microchip,
    },
    include: {
      approvers: {
        include: { user: true },
      },
    },
  });

  if (!cert) return;

  return cert;
};

export const isApprover = async (wallet: string) => {
  const approver = await prisma.certificateApprover.findFirst({
    where: { wallet },
    include: {
      user: true,
    },
  });

  if (!approver) return;

  return {
    wallet: approver?.wallet,
    name: approver?.user.name,
    job: approver.job,
    position: approver.position,
    signatureUrl: approver.signatureUrl,
  } as MetadataApprover;
};

export const approve = async (
  approverWallet: string,
  approverPosition: number,
  microchip: string
) => {
  const target = await prisma.certificate.findFirst({
    where: { microchip },
    include: {
      approvers: true,
    },
  });

  //check if this wallet has been approved
  const found = target?.approvers.find((t) => t.wallet == approverWallet);

  if (found) return;

  //check if the position is occupied
  const occupied = target?.approvers.find(
    (t) => t.position == approverPosition
  );

  if (occupied) return;

  //approve
  const result = await prisma.certificate.update({
    data: { approvers: { connect: { wallet: approverWallet } } },
    where: { microchip },
    include: {
      approvers: true,
    },
  });

  if (!result) return;

  if (result.approvers.length >= 3) {
    await prisma.certificate.update({
      data: {
        isActive: true,
      },
      where: {
        microchip,
      },
    });
  }

  return result;
};

export const isApproved = async (microchip: string) => {
  const found = await prisma.certificate.findFirst({ where: { microchip } });

  if (found != undefined) {
    return true;
  } else {
    return false;
  }
};
// export const getCertificationInfoOf = async (metadata: ParsedMetadata) => {
//   const certificateData = await prisma.certificate.findUnique({
//     where: { microchip: metadata.microchip },
//     include: {
//       approvers: true,
//     },
//   });

//   return {
//     microchip: metadata.microchip,
//     name: metadata.name,
//     approvers: certificateData?.approvers ?? [],
//     isActive: certificateData?.isActive ?? false,
//     hasApprovementData:
//       certificateData?.bornAt == undefined ||
//       certificateData.wallet == undefined,
//   };
// };

// export const getCertificationInfo = async (metadatas: ParsedMetadata[]) => {
//   const mappedMetadata = await Promise.all(
//     metadatas.map(async (metadata) => await getCertificationInfoOf(metadata))
//   );

//   return mappedMetadata;
// };

// export const filterCertificateByApprover = (
//   approver: string,
//   metadatas: MappedMetadata[]
// ) => {
//   return metadatas.filter(
//     (metadata) => !metadata.approvers?.find((data) => data.wallet === approver)
//   );
// };

// export const isApprover = async (wallet: string) => {
//   const found = await prisma.certificateApprover.findUnique({
//     where: {
//       wallet: wallet,
//     },
//   });

//   if (!found) {
//     return false;
//   } else {
//     return true;
//   }
// };

// // export const isApproved = async (
// //   approver: string,
// //   metadata: MappedMetadata
// // ) => {
// //   const found = metadata.approvers?.find((data) => data.wallet === approver);

// //   return found ? true : false;
// // };

// export const isApproved = async (approver: string, microchip: string) => {
//   const metadata = await prisma.certificate.findUnique({
//     where: { microchip },
//     include: {
//       approvers: true,
//     },
//   });

//   const found = metadata?.approvers.find((data) => data.wallet === approver);
//   return found ? true : false;
// };

// export const canApprove = async (approver: string, microchip: string) => {
//   const permanentAddress = "0x27ea0d98E5876b70377d6d921DAE987BE48A7A2c";
//   const metadata = await prisma.certificate.findUnique({
//     where: { microchip },
//     include: {
//       approvers: true,
//     },
//   });

//   if (metadata == null) return true;

//   const hasPermanent =
//     metadata.approvers.filter((a) => a.wallet == permanentAddress).length > 0;

//   if (metadata.approvers === undefined) return false;

//   if (hasPermanent && metadata.approvers.length <= 3) {
//     return true;
//   } else if (!hasPermanent && metadata.approvers.length < 2) {
//     return true;
//   } else if (!hasPermanent && metadata.approvers.length == 2) {
//     return approver == permanentAddress ? true : false;
//   }
// };

// export const approveWithoutData = async (
//   approver: string,
//   microchip: string
// ) => {
//   const approveValid = await canApprove(approver, microchip);
//   const approvedValid = await isApproved(approver, microchip);
//   if (!approveValid || approvedValid) return;

//   const approved = await prisma.certificate.update({
//     where: {
//       microchip,
//     },
//     data: {
//       approvers: {
//         connect: {
//           wallet: approver,
//         },
//       },
//     },
//     include: {
//       approvers: true,
//     },
//   });

//   if (approved.approvers.length == 3) {
//     await prisma.certificate.update({
//       where: { microchip },
//       data: {
//         isActive: true,
//       },
//     });
//   }

//   return approved;
// };

// export const approve = async (
//   approver: string,
//   microchip: string,
//   owner: string,
//   bornAt: string
// ) => {
//   try {
//     const approveValid = await canApprove(approver, microchip);
//     const approvedValid = await isApproved(approver, microchip);
//     if (!approveValid || approvedValid) return;
//     const approved = await prisma.certificate.upsert({
//       where: {
//         microchip,
//       },
//       create: {
//         microchip,
//         bornAt,
//         wallet: owner,
//         approvers: {
//           connect: {
//             wallet: approver,
//           },
//         },
//       },
//       update: {
//         approvers: {
//           connect: {
//             wallet: approver,
//           },
//         },
//       },
//       include: {
//         approvers: true,
//       },
//     });

//     if (approved.approvers.length == 3) {
//       await prisma.certificate.update({
//         where: { microchip },
//         data: {
//           isActive: true,
//         },
//       });
//     }

//     return approved;
//   } catch (error) {
//     console.log(error);
//   }
// };
