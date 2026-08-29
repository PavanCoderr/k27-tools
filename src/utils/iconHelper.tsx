import React from 'react';
import {
  Braces,
  CheckCheck,
  FileSpreadsheet,
  FileImage,
  Scaling,
  ImagePlus,
  ImageMinus,
  Sparkle,
  FileText,
  WholeWord,
  Type,
  AlignLeft,
  Binary,
  Link,
  Fingerprint,
  ShieldAlert,
  Key,
  Files,
  Split,
  FileArchive,
  QrCode,
  Image,
  Code2,
  FileCheck2,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
  [key: string]: unknown;
}

export function getToolIcon(name: string, props?: IconProps): React.ReactElement {
  const iconProps = { className: 'w-5 h-5', ...props };

  switch (name) {
    case 'Braces':
      return <Braces {...iconProps} />;
    case 'CheckCheck':
      return <CheckCheck {...iconProps} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...iconProps} />;
    case 'FileImage':
      return <FileImage {...iconProps} />;
    case 'Scaling':
      return <Scaling {...iconProps} />;
    case 'ImagePlus':
      return <ImagePlus {...iconProps} />;
    case 'ImageMinus':
      return <ImageMinus {...iconProps} />;
    case 'Sparkle':
      return <Sparkle {...iconProps} />;
    case 'FileText':
      return <FileText {...iconProps} />;
    case 'WholeWord':
      return <WholeWord {...iconProps} />;
    case 'Type':
      return <Type {...iconProps} />;
    case 'AlignLeft':
      return <AlignLeft {...iconProps} />;
    case 'Binary':
      return <Binary {...iconProps} />;
    case 'Link':
      return <Link {...iconProps} />;
    case 'Fingerprint':
      return <Fingerprint {...iconProps} />;
    case 'ShieldAlert':
      return <ShieldAlert {...iconProps} />;
    case 'Key':
      return <Key {...iconProps} />;
    case 'Files':
      return <Files {...iconProps} />;
    case 'Split':
      return <Split {...iconProps} />;
    case 'FileArchive':
      return <FileArchive {...iconProps} />;
    case 'QrCode':
      return <QrCode {...iconProps} />;
    case 'Image':
      return <Image {...iconProps} />;
    case 'Code2':
      return <Code2 {...iconProps} />;
    case 'FileCheck2':
      return <FileCheck2 {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
}
