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
