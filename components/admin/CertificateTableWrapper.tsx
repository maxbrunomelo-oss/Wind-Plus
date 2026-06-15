"use client";

import { useState } from "react";
import { Certificate } from "@/lib/certificates/types";
import CertificateForm from "./CertificateForm";
import CertificateTable from "./CertificateTable";

interface Props {
  initialCertificates: Certificate[];
}

export default function CertificateTableWrapper({ initialCertificates }: Props) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);

  const handleCreated = (cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  return (
    <>
      <CertificateForm onCreated={handleCreated} />
      <CertificateTable initialCertificates={certificates} />
    </>
  );
}
