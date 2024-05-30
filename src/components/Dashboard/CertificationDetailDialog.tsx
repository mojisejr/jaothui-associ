import React from "react";
import Modal from "../Shared/Modal";
import {
  MetadataApprover,
  MetadataRequestForApprovement,
} from "~/interfaces/Metadata";
import CertificateMobile from "./Certificate";

interface CertificationDetailProps {
  request: MetadataRequestForApprovement;
  approver: MetadataApprover;
}

const CertificationDetailDialog = ({ request }: CertificationDetailProps) => {
  return (
    <Modal id="certificate_approve_dialog">
      <div className="grid grid-cols-1 place-items-center gap-2">
        <CertificateMobile
          microchip={request.microchip}
          bornAt={request.bornAt!}
          no={request.no}
          owner={request.ownerName}
          year={request.updatedAt.getFullYear()}
        />
      </div>
    </Modal>
  );
};

export default CertificationDetailDialog;
