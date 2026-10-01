import { Language, DocumentCategory } from '../types';

export const translations = {
  bn: {
    // Portal Brand & Common
    portalName: 'জনগণের সেবা',
    portalSubname: 'Jonogoner Seba',
    portalTagline: 'নিরাপদ ডিজিটাল নাগরিক নথি ও কিউআর যাচাইকরণ পোর্টাল',
    portalMission: 'গণপ্রজাতন্ত্রী নাগরিক সেবা ও প্রাতিষ্ঠানিক নথি যাচাইয়ের নির্ভরযোগ্য প্ল্যাটফর্ম',
    langName: 'বাংলা',
    otherLang: 'English',
    home: 'হোম',
    uploadNav: 'নথি আপলোড',
    verifyNav: 'নথি অনুসন্ধান ও যাচাই',
    adminNav: 'প্রশাসনিক পোর্টাল',
    helpdesk: 'সহায়তা হটলাইন: ৩৩৩ / ১৬১২৩',
    verifiedBadge: 'যাচাইকৃত নথি',
    officialSeal: 'অনুমোদিত ডিজিটাল নাগরিক সেবা',
    
    // Hero Banner
    heroTitle: 'ডিজিটাল নাগরিক নথি আপলোড ও কিউআর সেবা',
    heroSubtitle: 'আপনার প্রাতিষ্ঠানিক বা নাগরিক পিডিএফ নথি আপলোড করুন, তাৎক্ষণিক সুরক্ষিত কিউআর কোড তৈরি করুন এবং যে কাউকে সরাসরি যাচাইযোগ্য ভিউয়ার লিংক প্রদান করুন।',
    uploadActionBtn: 'নতুন নথি আপলোড করুন',
    verifyActionBtn: 'নথি যাচাই বা ট্র্যাক করুন',
    
    // Stats Banner
    statTotalDocs: 'মোট সংরক্ষিত নথি',
    statTotalViews: 'মোট কিউআর স্ক্যান ও পরিদর্শন',
    statStorageUsed: 'ব্যবহৃত স্টোরেজ',
    statSecureSystem: 'সুরক্ষা স্ট্যান্ডার্ড',
    statSecureVal: '২৫৬-বিট এনক্রিপ্টেড',

    // Upload Section
    uploadSectionTitle: 'পিডিএফ নথি আপলোড ও কিউআর জেনারেশন',
    uploadSectionDesc: 'অনুগ্রহ করে শুধুমাত্র বৈধ পিডিএফ (.pdf) ফাইল নির্বাচন করুন। সর্বোচ্চ ফাইল আকার: ১০ মেগাবাইট (10MB)।',
    dragDropText: 'পিডিএফ ফাইলটি এখানে টেনে এনে ছেড়ে দিন',
    orBrowseText: 'অথবা আপনার কম্পিউটার বা মোবাইল থেকে নির্বাচন করুন',
    selectFileBtn: 'পিডিএফ ফাইল নির্বাচন করুন',
    supportedFormats: 'অনুমোদিত ফরম্যাট: কেবল স্ট্যান্ডার্ড পিডিএফ (.pdf), সর্বোচ্চ ১০ এমবি',
    fileSelected: 'নির্বাচিত ফাইল',
    changeFile: 'পরিবর্তন করুন',
    
    // Metadata Form
    docTitleLabel: 'নথির শিরোনাম / বিষয়',
    docTitlePlaceholder: 'যেমন: নাগরিকত্ব সনদপত্র, হোল্ডিং ট্যাক্স রসিদ, জন্ম নিবন্ধন প্রত্যয়ন',
    docCategoryLabel: 'নথির বিভাগ / ধরণ',
    docTrackingLabel: 'ট্র্যাকিং / রেফারেন্স আইডি',
    docTrackingAuto: 'স্বয়ংক্রিয়ভাবে তৈরি করা হবে',
    docNotesLabel: 'সংক্ষিপ্ত বিবরণ বা নির্দেশিকা (ঐচ্ছিক)',
    docNotesPlaceholder: 'প্রয়োজনে নথির প্রাসঙ্গিক নোট বা রেফারেন্স উল্লেখ করুন...',
    
    // Categories
    catGeneral: 'সাধারণ নাগরিক সেবা',
    catCertificate: 'সনদপত্র ও প্রত্যয়ন',
    catNotice: 'সরকারি / প্রাতিষ্ঠানিক নোটিশ',
    catApplication: 'নাগরিক আবেদনপত্র',
    catLand: 'ভূমি ও সম্পত্তি দলিল',
    catLicense: 'ট্রেড লাইসেন্স ও অনুমতিপত্র',
    catUtility: 'ইউটিলিটি ও কর রসিদ',
    
    // Upload Processing & Validation
    uploadingTitle: 'নথি আপলোড ও প্রক্রিয়াকরণ হচ্ছে...',
    uploadingDesc: 'পিডিএফ যাচাইকরণ, ডিজিটাল ফিঙ্গারপ্রিন্ট হ্যাশ তৈরি ও কিউআর কোড প্রস্তুত হচ্ছে...',
    uploadSuccessTitle: 'নথি সফলভাবে আপলোড ও নিবন্ধিত হয়েছে!',
    uploadSuccessDesc: 'আপনার নথির জন্য একটি অনন্য এবং সরাসরি স্ক্যানযোগ্য কিউআর কোড প্রস্তুত করা হয়েছে।',
    invalidFileType: 'অবৈধ ফাইল ফরম্যাট! অনুগ্রহ করে শুধুমাত্র বৈধ পিডিএফ (.pdf) ফাইল নির্বাচন করুন।',
    fileSizeExceeded: 'ফাইলের আকার ১০ মেগাবাইটের বেশি! অনুগ্রহ করে ছোট আকারের পিডিএফ নির্বাচন করুন।',
    titleRequired: 'অনুগ্রহ করে নথির একটি শিরোনাম প্রদান করুন।',
    
    // QR Code Result Box
    qrGeneratedHeading: 'ডিজিটাল কিউআর কোড ও শেয়ারিং লিংক',
    qrCodeSub: 'যেকোনো স্মার্টফোন ক্যামেরা দিয়ে স্ক্যান করলে সরাসরি ডেডিকেটেড সুরক্ষিত পিডিএফ রিডারে নথিটি প্রদর্শিত হবে।',
    downloadPngBtn: 'কিউআর ডাউনলোড (PNG)',
    downloadSvgBtn: 'কিউআর ডাউনলোড (SVG)',
    copyLinkBtn: 'ভিউয়ার লিংক কপি করুন',
    copiedLinkMsg: 'লিংক কপি করা হয়েছে!',
    openViewerBtn: 'এখনই ভিউয়ারে নথি দেখুন',
    printSlipBtn: 'অফিসিয়াল স্লিপ প্রিন্ট করুন',
    docRefId: 'রেফারেন্স আইডি',
    docUploadDate: 'আপলোডের তারিখ',
    docSize: 'ফাইলের আকার',
    newUploadBtn: 'আরেকটি নথি আপলোড করুন',
    
    // Verification Section
    verifySectionTitle: 'ডিজিটাল নথি অনুসন্ধান ও সত্যতা যাচাই',
    verifySectionDesc: 'যে কোনো সময় আপনার নথির ট্র্যাকিং কোড বা রেফারেন্স নম্বর প্রবেশ করিয়ে সত্যতা ও মূল কপি যাচাই করুন।',
    verifyInputPlaceholder: 'নথির রেফারেন্স আইডি লিখুন (যেমন: DOC-2026-...)',
    verifySearchBtn: 'যাচাই করুন',
    docFoundTitle: 'নথি পাওয়া গেছে ও সংরক্ষিত আছে',
    docNotFoundTitle: 'দুঃখিত, এই রেফারেন্সের কোনো নথি পাওয়া যায়নি',
    docNotFoundDesc: 'রেফারেন্স নম্বরটি পুনরায় যাচাই করুন অথবা সঠিক নথি কোড লিখুন।',
    
    // Strict PDF Viewer
    strictViewerTitle: 'জনগণের সেবা · সংরক্ষিত নথি প্রদর্শন ব্যবস্থা',
    strictViewerBadge: 'অফিসিয়াল ভেরিফাইড কপি',
    strictViewerDocId: 'নথি আইডি',
    strictViewerDate: 'নিবন্ধন',
    strictViewerZoomIn: 'বড় করুন (+)',
    strictViewerZoomOut: 'ছোট করুন (-)',
    strictViewerResetZoom: 'রিসেট',
    strictViewerRotate: 'ঘুরান (৯০°)',
    strictViewerDownload: 'ডাউনলোড পিডিএফ',
    strictViewerPrint: 'প্রিন্ট করুন',
    strictViewerFullscreen: 'ফুলস্ক্রিন',
    strictViewerExit: 'মূল পোর্টালে ফিরুন',
    strictViewerWarning: 'নিরাপত্তা বিজ্ঞপ্তি: এই ভিউয়ারটি শুধুমাত্র মূল নিবন্ধিত নথি প্রদর্শনের জন্য সংরক্ষিত। কোনো বাণিজ্যিক বা অপ্রাসঙ্গিক উপাদান এখানে অনুমোদিত নয়।',
    strictViewerLoading: 'সুরক্ষিত ভিউয়ারে পিডিএফ লোড হচ্ছে...',
    strictViewerError: 'নথিটি প্রদর্শনে সমস্যা হচ্ছে। অনুগ্রহ করে নিচের ডাউনলোড বোতাম ব্যবহার করে নথিটি ডাউনলোড করে দেখুন।',

    // Admin Portal
    adminLoginTitle: 'প্রশাসনিক লগইন',
    adminLoginSub: 'জনগণের সেবা পোর্টালের সংরক্ষিত নথি ব্যবস্থাপনা প্যানেল',
    adminUsernameLabel: 'ইউজারনেম / আইডি',
    adminPasswordLabel: 'পাসওয়ার্ড',
    adminLoginBtn: 'প্রবেশ করুন',
    adminInvalidCreds: 'ভুল ইউজারনেম বা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।',
    adminLogout: 'লগআউট',
    adminDashboardTitle: 'নথি ব্যবস্থাপনা ড্যাশবোর্ড',
    adminDashboardSub: 'আপলোডকৃত সকল নথিপত্র পর্যালোচনা, অনুসন্ধান, কিউআর কোড এবং পরিচালনা ব্যবস্থা',
    adminSearchPlaceholder: 'শিরোনাম, রেফারেন্স বা ফাইলের নাম দিয়ে খুঁজুন...',
    adminFilterCategory: 'সকল বিভাগ',
    adminFilterDate: 'সকল সময়কাল',
    adminDateToday: 'আজকের আপলোড',
    adminDateWeek: 'গত ৭ দিন',
    adminDateMonth: 'চলতি মাস',
    adminBatchDelete: 'নির্বাচিত নথি মুছে ফেলুন',
    adminExportCsv: 'সিএসভি (CSV) এক্সপোর্ট',
    adminExportJson: 'জেসন (JSON) ব্যাকআপ',
    adminTableHeaderRef: 'রেফারেন্স / কিউআর',
    adminTableHeaderTitle: 'নথির শিরোনাম ও ফাইল',
    adminTableHeaderCat: 'বিভাগ',
    adminTableHeaderSize: 'সাইজ',
    adminTableHeaderDate: 'তারিখ ও সময়',
    adminTableHeaderViews: 'পরিদর্শন',
    adminTableHeaderActions: 'কার্যক্রম',
    adminActionView: 'ভিউয়ার',
    adminActionPreview: 'প্রিভিউ',
    adminActionQr: 'কিউআর',
    adminActionDelete: 'মুছুন',
    adminConfirmDeleteTitle: 'নথি মুছে ফেলার নিশ্চিতকরণ',
    adminConfirmDeleteMsg: 'আপনি কি নিশ্চিত যে এই নথিটি মুছে ফেলতে চান? এই প্রক্রিয়াটি অপরিবর্তনীয়।',
    adminDeleteSuccess: 'নথিটি সফলভাবে মুছে ফেলা হয়েছে।',
    adminNoRecordsFound: 'কোনো নথি পাওয়া যায়নি।',
    adminPreviewModalTitle: 'নথির সরাসরি প্রিভিউ',
    adminCloseBtn: 'বন্ধ করুন',

    // Admin Full Control & Security Tabs
    adminTabRegistry: 'নথি রেজিস্ট্রি ও ট্র্যাকিং',
    adminTabSettings: 'ওয়েবসাইট সেটিংস ও নিয়ন্ত্রণ',
    adminTabSecurity: 'নিরাপত্তা ও পাসওয়ার্ড পরিবর্তন',

    // Password Change
    adminChangePassTitle: 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন',
    adminChangePassSub: 'অননুমোদিত প্রবেশ রোধে নিয়মিত আপনার প্রশাসনিক পাসওয়ার্ড পরিবর্তন করুন',
    adminCurrentPass: 'বর্তমান পাসওয়ার্ড',
    adminNewPass: 'নতুন পাসওয়ার্ড',
    adminConfirmNewPass: 'নতুন পাসওয়ার্ড পুনরায় লিখুন',
    adminUpdatePassBtn: 'পাসওয়ার্ড পরিবর্তন নিশ্চিত করুন',
    adminPassMismatch: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!',
    adminPassUpdatedSuccess: 'অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!',

    // Website Full Control Settings
    adminSiteSettingsTitle: 'ওয়েবসাইট কনফিগারেশন ও নিয়ন্ত্রণ প্যানেল',
    adminSiteSettingsSub: 'পোর্টালের নাম, ট্যাগলাইন, হটলাইন, জরুরি নোটিশ ও আপলোড নীতিমালা নিয়ন্ত্রণ',
    adminPortalTitleBn: 'পোর্টালের নাম (বাংলা)',
    adminPortalTitleEn: 'পোর্টালের নাম (English)',
    adminPortalTaglineBn: 'ট্যাগলাইন (বাংলা)',
    adminPortalTaglineEn: 'ট্যাগলাইন (English)',
    adminHelplineBn: 'সহায়তা হটলাইন টেক্সট',
    adminNoticeBanner: 'জরুরি নাগরিক ঘোষণা / নোটিশ ব্যানার',
    adminEnableNotice: 'হোমপেজে নোটিশ ব্যানার প্রদর্শন করুন',
    adminNoticeTextBn: 'নোটিশের বিবরণ (বাংলা)',
    adminNoticeTextEn: 'নোটিশের বিবরণ (English)',
    adminMaxFileSize: 'সর্বোচ্চ ফাইল সাইজ সীমা (মেগাবাইট)',
    adminAllowDownload: 'নাগরিকদের জন্য পিডিএফ ডাউনলোড সুবিধা চালু রাখুন',
    adminAllowPrint: 'নাগরিকদের জন্য পিডিএফ প্রিন্ট সুবিধা চালু রাখুন',
    adminSaveSettingsBtn: 'সেটিংস সংরক্ষণ করুন',
    adminSettingsSaved: 'ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!',
    adminResetDefaults: 'ডিফল্ট সেটিংসে ফিরুন',
    adminActionEdit: 'সম্পাদনা',
    adminEditDocTitle: 'নথির তথ্য সম্পাদনা',
    adminDocVerifiedToggle: 'যাচাইকৃত নথি হিসেবে চিহ্নিত রাখুন',
    
    // Print Slip
    printSlipTitle: 'ডিজিটাল নথি নিবন্ধন ও কিউআর প্রত্যয়ন স্লিপ',
    printSlipSub: 'জনগণের সেবা · নাগরিক ডকুমেন্ট ট্র্যাকিং সিস্টেম',
    printSlipIssuedTo: 'অনলাইন নাগরিক পোর্টাল',
    printSlipInstruction: 'এই কিউআর কোডটি স্ক্যান করে যেকোনো সময় উক্ত নথির সত্যতা সরাসরি ডিজিটাল ভিউয়ারে যাচাই করা যাবে।',
    printSlipPrintBtn: 'এখনই প্রিন্ট করুন',
    
    // Footer
    footerGovNote: 'জনগণের সেবা — সাধারণ নাগরিক ও প্রাতিষ্ঠানিক ডিজিটাল নথি ব্যবস্থাপনা সিস্টেম।',
    footerPrivacy: 'গোপনীয়তা ও নিরাপত্তা নির্দেশিকা',
    footerTerms: 'ব্যবহারের নীতিমালা',
    footerCopyright: '© ২০২৬ জনগণের সেবা পোর্টাল। সর্বস্বত্ব সংরক্ষিত।',
  },
  en: {
    // Portal Brand & Common
    portalName: 'Jonogoner Seba',
    portalSubname: "People's Service",
    portalTagline: 'Secure Digital Citizen Document & QR Verification Portal',
    portalMission: 'Trustworthy civic platform for official document hosting and instant QR verification',
    langName: 'English',
    otherLang: 'বাংলা',
    home: 'Home',
    uploadNav: 'Upload Document',
    verifyNav: 'Search & Verify',
    adminNav: 'Admin Portal',
    helpdesk: 'Helpline: 333 / 16123',
    verifiedBadge: 'Verified Document',
    officialSeal: 'Authorized Digital Citizen Service',
    
    // Hero Banner
    heroTitle: 'Digital Citizen Document Upload & QR Verification',
    heroSubtitle: 'Upload your institutional or citizen PDF documents, generate instant high-resolution scannable QR codes, and share a direct distraction-free viewer link.',
    uploadActionBtn: 'Upload New Document',
    verifyActionBtn: 'Verify or Track Document',
    
    // Stats Banner
    statTotalDocs: 'Total Stored Documents',
    statTotalViews: 'Total QR Scans & Views',
    statStorageUsed: 'Storage Consumed',
    statSecureSystem: 'Security Standard',
    statSecureVal: '256-Bit Encrypted',

    // Upload Section
    uploadSectionTitle: 'PDF Document Upload & QR Generation',
    uploadSectionDesc: 'Please select a valid PDF (.pdf) file only. Maximum file size allowed: 10 Megabytes (10MB).',
    dragDropText: 'Drag and drop your PDF file here',
    orBrowseText: 'or browse from your computer / phone',
    selectFileBtn: 'Select PDF File',
    supportedFormats: 'Accepted Format: Standard PDF (.pdf) only, max 10MB',
    fileSelected: 'Selected File',
    changeFile: 'Change File',
    
    // Metadata Form
    docTitleLabel: 'Document Title / Subject',
    docTitlePlaceholder: 'e.g. Citizenship Certificate, Holding Tax Receipt, Birth Registration Proof',
    docCategoryLabel: 'Department / Category',
    docTrackingLabel: 'Tracking / Reference ID',
    docTrackingAuto: 'Generated automatically',
    docNotesLabel: 'Notes or Instructions (Optional)',
    docNotesPlaceholder: 'Mention any relevant institutional reference or notes...',
    
    // Categories
    catGeneral: 'General Citizen Service',
    catCertificate: 'Certificates & Attestations',
    catNotice: 'Institutional / Civic Notices',
    catApplication: 'Citizen Applications',
    catLand: 'Land & Property Records',
    catLicense: 'Trade Licenses & Permits',
    catUtility: 'Utility & Tax Receipts',
    
    // Upload Processing & Validation
    uploadingTitle: 'Uploading & Processing Document...',
    uploadingDesc: 'Validating PDF, computing cryptographic fingerprint, and generating QR code...',
    uploadSuccessTitle: 'Document Uploaded & Registered Successfully!',
    uploadSuccessDesc: 'A unique scannable QR code and dedicated viewer link have been generated.',
    invalidFileType: 'Invalid file format! Please upload a valid PDF (.pdf) document only.',
    fileSizeExceeded: 'File size exceeds 10MB! Please choose a smaller PDF file.',
    titleRequired: 'Please provide a document title.',
    
    // QR Code Result Box
    qrGeneratedHeading: 'Digital QR Code & Sharing Link',
    qrCodeSub: 'Scanning this code with any smartphone camera instantly opens the dedicated, secure PDF reader without clutter.',
    downloadPngBtn: 'Download QR (PNG)',
    downloadSvgBtn: 'Download QR (SVG)',
    copyLinkBtn: 'Copy Viewer Link',
    copiedLinkMsg: 'Link copied to clipboard!',
    openViewerBtn: 'Open in Document Viewer',
    printSlipBtn: 'Print Official Verification Slip',
    docRefId: 'Reference ID',
    docUploadDate: 'Upload Date',
    docSize: 'File Size',
    newUploadBtn: 'Upload Another Document',
    
    // Verification Section
    verifySectionTitle: 'Digital Document Lookup & Verification',
    verifySectionDesc: 'Enter any document reference code or tracking ID to verify its authenticity and inspect the original registered PDF.',
    verifyInputPlaceholder: 'Enter Reference ID (e.g. DOC-2026-...)',
    verifySearchBtn: 'Verify Now',
    docFoundTitle: 'Document Verified & Registered',
    docNotFoundTitle: 'No Document Found with this Reference',
    docNotFoundDesc: 'Please double-check the tracking ID or inspect the QR code again.',
    
    // Strict PDF Viewer
    strictViewerTitle: "Jonogoner Seba · Secure Document Viewer",
    strictViewerBadge: 'Official Verified Copy',
    strictViewerDocId: 'Document ID',
    strictViewerDate: 'Registered',
    strictViewerZoomIn: 'Zoom In (+)',
    strictViewerZoomOut: 'Zoom Out (-)',
    strictViewerResetZoom: 'Reset',
    strictViewerRotate: 'Rotate (90°)',
    strictViewerDownload: 'Download PDF',
    strictViewerPrint: 'Print',
    strictViewerFullscreen: 'Fullscreen',
    strictViewerExit: 'Back to Portal',
    strictViewerWarning: 'Security Notice: This viewer is strictly dedicated to rendering the authentic registered document without distractions or external links.',
    strictViewerLoading: 'Loading PDF document into secure viewer...',
    strictViewerError: 'Could not render inline preview. Please use the Download button below to open the PDF directly.',

    // Admin Portal
    adminLoginTitle: 'Administrative Login',
    adminLoginSub: "Jonogoner Seba Portal Management & Document Registry",
    adminUsernameLabel: 'Username / Officer ID',
    adminPasswordLabel: 'Password',
    adminLoginBtn: 'Sign In to Dashboard',
    adminInvalidCreds: 'Invalid username or password! Please try again.',
    adminLogout: 'Sign Out',
    adminDashboardTitle: 'Document Registry Dashboard',
    adminDashboardSub: 'Review, search, preview, inspect QR codes, and manage all uploaded citizen documents',
    adminSearchPlaceholder: 'Search by title, reference ID, or filename...',
    adminFilterCategory: 'All Categories',
    adminFilterDate: 'All Time',
    adminDateToday: 'Uploaded Today',
    adminDateWeek: 'Last 7 Days',
    adminDateMonth: 'This Month',
    adminBatchDelete: 'Delete Selected',
    adminExportCsv: 'Export CSV',
    adminExportJson: 'JSON Backup',
    adminTableHeaderRef: 'Reference / QR',
    adminTableHeaderTitle: 'Document Title & File',
    adminTableHeaderCat: 'Category',
    adminTableHeaderSize: 'Size',
    adminTableHeaderDate: 'Date & Time',
    adminTableHeaderViews: 'Views',
    adminTableHeaderActions: 'Actions',
    adminActionView: 'Viewer',
    adminActionPreview: 'Preview',
    adminActionQr: 'QR Code',
    adminActionDelete: 'Delete',
    adminConfirmDeleteTitle: 'Confirm Document Deletion',
    adminConfirmDeleteMsg: 'Are you sure you want to delete this document record? This action cannot be undone.',
    adminDeleteSuccess: 'Document has been deleted from registry.',
    adminNoRecordsFound: 'No matching documents found.',
    adminPreviewModalTitle: 'Document Quick Preview',
    adminCloseBtn: 'Close',

    // Admin Full Control & Security Tabs
    adminTabRegistry: 'Document Registry & Tracking',
    adminTabSettings: 'Website Settings & Controls',
    adminTabSecurity: 'Security & Change Password',

    // Password Change
    adminChangePassTitle: 'Change Admin Password',
    adminChangePassSub: 'Ensure administrative security by updating your master password regularly',
    adminCurrentPass: 'Current Password',
    adminNewPass: 'New Password',
    adminConfirmNewPass: 'Confirm New Password',
    adminUpdatePassBtn: 'Update Password',
    adminPassMismatch: 'New password and confirm password do not match!',
    adminPassUpdatedSuccess: 'Admin password updated successfully!',

    // Website Full Control Settings
    adminSiteSettingsTitle: 'Website Configuration & Master Control Panel',
    adminSiteSettingsSub: 'Customize portal title, tagline, helpline, announcements, and upload policies',
    adminPortalTitleBn: 'Portal Name (Bengali)',
    adminPortalTitleEn: 'Portal Name (English)',
    adminPortalTaglineBn: 'Tagline (Bengali)',
    adminPortalTaglineEn: 'Tagline (English)',
    adminHelplineBn: 'Helpline Text',
    adminNoticeBanner: 'Urgent Citizen Announcement Banner',
    adminEnableNotice: 'Show announcement banner on homepage',
    adminNoticeTextBn: 'Announcement Text (Bengali)',
    adminNoticeTextEn: 'Announcement Text (English)',
    adminMaxFileSize: 'Max File Size Limit (MB)',
    adminAllowDownload: 'Allow Public PDF Download',
    adminAllowPrint: 'Allow Public PDF Print',
    adminSaveSettingsBtn: 'Save Website Settings',
    adminSettingsSaved: 'Website settings updated successfully!',
    adminResetDefaults: 'Restore Default Settings',
    adminActionEdit: 'Edit',
    adminEditDocTitle: 'Edit Document Record',
    adminDocVerifiedToggle: 'Mark as Verified Document',
    
    // Print Slip
    printSlipTitle: 'Digital Document Registration & QR Attestation Slip',
    printSlipSub: "Jonogoner Seba · Citizen Document Tracking System",
    printSlipIssuedTo: 'Digital Citizen Portal',
    printSlipInstruction: 'Scanning this QR code at any time verifies the authenticity of this document directly in the digital viewer.',
    printSlipPrintBtn: 'Print Slip',
    
    // Footer
    footerGovNote: "Jonogoner Seba — Digital civic document management and instant verification portal for citizens and institutions.",
    footerPrivacy: 'Privacy & Security Directives',
    footerTerms: 'Terms of Use',
    footerCopyright: '© 2026 Jonogoner Seba Portal. All rights reserved.',
  },
};

// Converts digits to Bengali numerals if language is 'bn'
export function formatNumber(num: number | string, lang: Language): string {
  const str = String(num);
  if (lang !== 'bn') return str;
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

// Format bytes into readable KB/MB with language numeral support
export function formatBytes(bytes: number, lang: Language): string {
  if (bytes === 0) return lang === 'bn' ? '০ বাইট' : '0 Bytes';
  const k = 1024;
  const sizes = lang === 'bn' ? ['বাইট', 'কেবি', 'এমবি', 'জিবি'] : ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${formatNumber(val, lang)} ${sizes[i]}`;
}

// Format date into human-readable date
export function formatDate(isoString: string, lang: Language): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    if (lang === 'bn') {
      const bnMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const day = formatNumber(date.getDate(), 'bn');
      const month = bnMonths[date.getMonth()];
      const year = formatNumber(date.getFullYear(), 'bn');
      const hours = formatNumber(date.getHours().toString().padStart(2, '0'), 'bn');
      const mins = formatNumber(date.getMinutes().toString().padStart(2, '0'), 'bn');
      return `${day} ${month} ${year}, ${hours}:${mins}`;
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getCategoryLabel(category: DocumentCategory, lang: Language): string {
  const dict = translations[lang];
  switch (category) {
    case 'certificate':
      return dict.catCertificate;
    case 'notice':
      return dict.catNotice;
    case 'application':
      return dict.catApplication;
    case 'land':
      return dict.catLand;
    case 'license':
      return dict.catLicense;
    case 'utility':
      return dict.catUtility;
    case 'general':
    default:
      return dict.catGeneral;
  }
}
