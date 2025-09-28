"use client";

import { useEffect, useState, useMemo } from "react";
import type { VFSState } from "@/lib/vfs";
import { PanelRightOpen } from "lucide-react";

interface LivePreviewProps {
  vfs: VFSState;
}

export default function LivePreview({ vfs }: LivePreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");

  const compiledCode = useMemo(() => {
    const htmlFile = Object.values(vfs).find(f => f.name === 'index.html' && f.type === 'file');
    const cssFile = Object.values(vfs).find(f => f.name === 'style.css' && f.type === 'file');
    const jsFile = Object.values(vfs).find(f => f.name === 'script.js' && f.type === 'file');

    if (!htmlFile || htmlFile.type !== 'file') {
      return '<div style="color: red; font-family: sans-serif;">index.html not found.</div>';
    }

    const htmlContent = htmlFile.content;
    const cssContent = cssFile && cssFile.type === 'file' ? cssFile.content : '';
    const jsContent = jsFile && jsFile.type === 'file' ? jsFile.content : '';
    
    // This is a simplified way to combine files. A real implementation
    // would need to handle relative paths in the HTML file itself.
    let processedHtml = htmlContent;

    if (processedHtml.includes('</head>')) {
        processedHtml = processedHtml.replace('</head>', `<style>${cssContent}</style></head>`);
    } else {
        processedHtml += `<style>${cssContent}</style>`;
    }
    
    if (processedHtml.includes('</body>')) {
        processedHtml = processedHtml.replace('</body>', `<script>${jsContent}</script></body>`);
    } else {
        processedHtml += `<script>${jsContent}</script>`;
    }

    return processedHtml;

  }, [vfs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(compiledCode);
    }, 250);
    return () => clearTimeout(timeout);
  }, [compiledCode]);

  return (
    <div className="flex flex-col h-full bg-card/50">
      <header className="flex items-center gap-2 p-2 border-b h-10 flex-shrink-0">
        <div className="text-muted-foreground"><PanelRightOpen /></div>
        <h2 className="text-sm font-medium">Live Preview</h2>
      </header>
      <div className="flex-grow">
        <iframe
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts allow-modals"
          className="w-full h-full bg-white"
        />
      </div>
    </div>
  );
}
