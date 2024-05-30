export interface MetadataApprover {
  wallet: string;
  name: string;
  job: string;
  position: number;
  signatureUrl: string;
}

export interface MetadataRequestForApprovement {
  microchip: string;
  no: number;
  isActive: boolean;
  ownerName: string;
  bornAt: string | null;
  momId: string | null;
  dadId: string | null;
  mGrandMomId: string | null;
  mGrandDadId: string | null;
  fGrandMomId: string | null;
  fGranDadId: string | null;
  updatedAt: Date;
  wallet: string;
  slipUrl: string;
}
export interface MetadataForPedRequest {
  name: string;
  imageUri: string;
  microchip: string;
}
export interface Metadata {
  name: string;
  origin: string;
  color: string;
  imageUri: string;
  detail: string;
  sex: string;
  birthdate: bigint;
  height: bigint;
  certify: {
    microchip: string;
    certNo: string;
    rarity: string;
    dna: string;
    issuedAt: bigint;
  };
  relation: { motherTokenId: string; fatherTokenId: string };
  createdAt: bigint;
  updatedAt: bigint;
  message: string;
  isApproved: boolean;
}

export interface ParsedMetadata {
  microchip: string;
  name: string;
}

export interface MappedMetadata {
  microchip: string;
  name: string;
  approvers?: { wallet: string; signatureUrl: string | null }[];
  isActive: boolean;
  hasApprovementData: boolean;
}
