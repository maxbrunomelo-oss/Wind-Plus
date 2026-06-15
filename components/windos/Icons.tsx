import React from 'react';

interface IconProps { size?: number; className?: string; }
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const IconDashboard = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>);
export const IconStudents = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M21 21v-2a4 4 0 0 0-3-3.87" /></svg>);
export const IconGuardian = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="3" /><circle cx="5" cy="10" r="2" /><circle cx="19" cy="10" r="2" /></svg>);
export const IconTeacher = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" /></svg>);
export const IconClasses = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><rect x="2" y="4" width="20" height="14" rx="2" /><path d="M2 9h20M8 21h8M12 18v3" /></svg>);
export const IconEnroll = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 15l2 2 4-4" /></svg>);
export const IconFinance = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M2 10h2M20 10h2" /></svg>);
export const IconReport = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>);
export const IconLog = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></svg>);
export const IconAlert = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>);
export const IconAI = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><rect x="4" y="6" width="16" height="13" rx="2" /><path d="M12 2v4M9 13h.01M15 13h.01M9 16h6" /><path d="M2 11v3M22 11v3" /></svg>);
export const IconSettings = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2 2 2 0 1 1-2.8-2.8 1.7 1.7 0 0 0-1.2-2.9 2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9 2 2 0 1 1 2.8-2.8 1.7 1.7 0 0 0 2.9-1.2 2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2 2 2 0 1 1 2.8 2.8 1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.5 1z" /></svg>);
export const IconSearch = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
export const IconFilter = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></svg>);
export const IconPlus = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>);
export const IconEdit = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>);
export const IconEye = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>);
export const IconArchive = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><rect x="2" y="4" width="20" height="5" rx="1" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M10 13h4" /></svg>);
export const IconDownload = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>);
export const IconChevron = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="m9 18 6-6-6-6" /></svg>);
export const IconArrowLeft = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>);
export const IconLogout = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>);
export const IconX = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const IconMenu = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M3 12h18M3 6h18M3 18h18" /></svg>);
export const IconWhatsapp = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.3L3 21l2.3-5.4A8.4 8.4 0 1 1 21 11.5z" /></svg>);
export const IconMail = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>);
export const IconTrend = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M22 7l-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></svg>);
export const IconClock = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const IconDoc = ({ size = 18, className }: IconProps) => (<svg {...base(size)} className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>);
export const IconUsers = ({ size = 18, className }: IconProps) => IconStudents({ size, className });
