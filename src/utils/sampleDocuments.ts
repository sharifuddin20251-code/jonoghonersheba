import { DocumentRecord } from '../types';

/**
 * Creates a valid, standard raw PDF 1.4 binary string and encodes it as data:application/pdf;base64,...
 * This guarantees any browser `<object>` or `<iframe>` or `<embed>` can render it with standard PDF engines.
 */
function createRawPdfDataUrl(title: string, certId: string, issuedDate: string, bodyTextLines: string[]): string {
  // Format simple standard PDF 1.4 object stream
  const escapedTitle = title.replace(/[()\\]/g, '');
  const escapedCertId = certId.replace(/[()\\]/g, '');
  
  const textStreams = [
    'BT',
    '/F1 18 Tf',
    '50 740 Td',
    `(${escapedTitle}) Tj`,
    '/F1 10 Tf',
    '0 -24 Td',
    `(OFFICIAL CITIZEN VERIFICATION RECORD - JONOGONER SEBA) Tj`,
    '0 -16 Td',
    `(Reference ID: ${escapedCertId} | Issued: ${issuedDate}) Tj`,
    '0 -10 Td',
    '(------------------------------------------------------------------------------------------------------------------------) Tj',
    '0 -24 Td',
    '/F1 11 Tf',
  ];

  let currentY = -20;
  for (const line of bodyTextLines) {
    const escaped = line.replace(/[()\\]/g, '');
    textStreams.push(`0 ${currentY} Td`);
    textStreams.push(`(${escaped}) Tj`);
    currentY = -18;
  }

  textStreams.push('0 -36 Td');
  textStreams.push('/F1 9 Tf');
  textStreams.push('(Digital Verification Seal: VERIFIED AND AUTHENTIC RECORD - JONOGONER SEBA PORTAL) Tj');
  textStreams.push('0 -14 Td');
  textStreams.push('(Scan QR Code to verify this digital record online at any time.) Tj');
  textStreams.push('ET');

  const contentStream = textStreams.join('\n');
  const streamLength = contentStream.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000300 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
${400 + streamLength}
%%EOF`;

  // Encode to base64 safely
  const base64 = btoa(unescape(encodeURIComponent(pdfBody)));
  return `data:application/pdf;base64,${base64}`;
}

export const initialSampleDocuments: DocumentRecord[] = [
  {
    id: 'DOC-2026-91823',
    title: 'নাগরিকত্ব সনদপত্র (Citizenship Certificate)',
    fileName: 'citizenship_certificate_2026.pdf',
    fileSize: 48920,
    mimeType: 'application/pdf',
    dataUrl: createRawPdfDataUrl(
      'CITIZENSHIP VERIFICATION CERTIFICATE',
      'DOC-2026-91823',
      '2026-03-15',
      [
        'This is to certify that the applicant is a registered citizen.',
        'Citizen National ID / Tracking: JS-NID-88492019-2026',
        'Address: Ward No. 04, Central Division, Dhaka.',
        'Department: Civil Status & Municipal Records Registry',
        'Status: Verified & Validated under Digital Citizen Services Act.',
        'This document has been issued electronically with cryptographic tracking.'
      ]
    ),
    category: 'certificate',
    uploadedAt: '2026-03-15T09:30:00.000Z',
    viewCount: 42,
    trackingCode: 'JS-2026-91823',
    notes: 'পৌরসভা নাগরিক সেবা কেন্দ্র হতে অনুমোদিত ও প্রস্তুতকৃত।',
    isVerified: true,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'DOC-2026-74512',
    title: 'ট্রেড লাইসেন্স নবায়ন প্রত্যয়ন (Trade License Renewal)',
    fileName: 'trade_license_renewal_2026.pdf',
    fileSize: 62450,
    mimeType: 'application/pdf',
    dataUrl: createRawPdfDataUrl(
      'TRADE LICENSE RENEWAL NOTIFICATION',
      'DOC-2026-74512',
      '2026-03-22',
      [
        'Business Name: Apex Digital IT & Commercial Enterprises',
        'Registration No: TL-2026-COMM-004812',
        'Nature of Business: Software Development & Digital Civic Services',
        'Fiscal Year Validity: 2025-2026',
        'All municipal tax dues and clearance fees have been received in full.',
        'Issued by Municipal Business Licensing Directorate.'
      ]
    ),
    category: 'license',
    uploadedAt: '2026-03-22T14:15:00.000Z',
    viewCount: 19,
    trackingCode: 'JS-2026-74512',
    notes: 'বাণিজ্যিক কার্যক্রমের জন্য নির্ধারিত ফি পরিশোধিত ও লাইসেন্স বৈধ।',
    isVerified: true,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'DOC-2026-63209',
    title: 'ভূমি নামজারি ও কর প্রত্যয়ন (Land Mutation & Tax Clearance)',
    fileName: 'land_mutation_record_2026.pdf',
    fileSize: 71200,
    mimeType: 'application/pdf',
    dataUrl: createRawPdfDataUrl(
      'LAND MUTATION & RECORD OF RIGHTS',
      'DOC-2026-63209',
      '2026-03-28',
      [
        'Record of Rights (ROR) Mutation Case No: LM-2026-88192',
        'Mouza: Dhanmondi, Khatian No: 412, Plot/Dag No: 1809',
        'Land Classification: Residential, Area: 5.5 Decimals',
        'Ownership transferred and mutated according to legal registry decree.',
        'Holding Tax clearance verified up to current fiscal quarter.',
        'Official Land Records Directorate Archive.'
      ]
    ),
    category: 'land',
    uploadedAt: '2026-03-28T11:45:00.000Z',
    viewCount: 68,
    trackingCode: 'JS-2026-63209',
    notes: 'সহকারী কমিশনার (ভূমি) কার্যালয় নথি অনুমোদন রেকর্ড।',
    isVerified: true,
    sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
  },
];
