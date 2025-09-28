import { File, FileJson, FileCode, FileImage, FileType, type LucideProps } from "lucide-react";

export const FileIcon = ({ filename, ...props }: { filename: string } & LucideProps) => {
  const extension = filename.split('.').pop();
  
  switch (extension) {
    case 'html':
    case 'css':
      return <FileCode {...props} />;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return <FileType {...props} />;
    case 'json':
      return <FileJson {...props} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileImage {...props} />;
    default:
      return <File {...props} />;
  }
};
