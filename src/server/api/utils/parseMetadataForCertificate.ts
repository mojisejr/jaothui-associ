import { Metadata } from "~/interfaces/Metadata";

export function parseMetadataForCertificate(metadatas: Metadata[]) {
  if (metadatas.length <= 0) return [];
  return metadatas.map((metadata) => ({
    microchip: metadata.certify.microchip,
    name: metadata.name,
  }));
}
