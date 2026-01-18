import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, FileUp, Download, Merge, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tool = 'pdf-to-word' | 'word-to-pdf' | 'merge-pdf';

interface ToolConfig {
  id: Tool;
  title: string;
  description: string;
  icon: typeof FileText;
  accept: string;
  multiple?: boolean;
}

const tools: ToolConfig[] = [
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files',
    icon: FileText,
    accept: '.pdf',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    icon: FileText,
    accept: '.doc,.docx',
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into one document',
    icon: Merge,
    accept: '.pdf',
    multiple: true,
  },
];

interface FileInfo {
  name: string;
  size: number;
}

export default function PdfConverter() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');

  const currentTool = tools.find(t => t.id === selectedTool);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const fileInfos = newFiles.map(f => ({ name: f.name, size: f.size }));
    if (currentTool?.multiple) {
      setFiles(prev => [...prev, ...fileInfos]);
    } else {
      setFiles(fileInfos.slice(0, 1));
    }
    setStatus('idle');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleConvert = () => {
    setStatus('processing');
    // Simulate processing
    setTimeout(() => {
      setStatus('done');
    }, 2000);
  };

  const handleReset = () => {
    setFiles([]);
    setStatus('idle');
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Converter</h1>
            <p className="text-muted-foreground">Convert and merge PDF documents with ease</p>
          </div>

          {!selectedTool ? (
            /* Tool Selection */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-glow transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <tool.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </button>
              ))}
            </div>
          ) : (
            /* Converter Interface */
            <div className="space-y-6">
              {/* Back Button & Title */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => { setSelectedTool(null); handleReset(); }}>
                  ← Back
                </Button>
                <div>
                  <h2 className="text-2xl font-semibold">{currentTool?.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentTool?.description}</p>
                </div>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  status === 'done' && "border-success bg-success/5"
                )}
              >
                {status === 'idle' && files.length === 0 && (
                  <>
                    <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Drop your files here</h3>
                    <p className="text-muted-foreground mb-4">
                      or click to browse ({currentTool?.accept})
                    </p>
                    <input
                      type="file"
                      accept={currentTool?.accept}
                      multiple={currentTool?.multiple}
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}

                {files.length > 0 && status !== 'done' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">{file.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {currentTool?.multiple && (
                      <div className="relative">
                        <Button variant="outline" className="w-full">
                          + Add more files
                        </Button>
                        <input
                          type="file"
                          accept={currentTool?.accept}
                          multiple
                          onChange={handleFileSelect}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    )}

                    <Button
                      onClick={handleConvert}
                      disabled={status === 'processing'}
                      className="w-full gradient-primary text-primary-foreground"
                    >
                      {status === 'processing' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Convert Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {status === 'done' && (
                  <div className="space-y-4">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-success" />
                    <h3 className="text-lg font-semibold text-success">Conversion Complete!</h3>
                    <p className="text-muted-foreground">
                      Your file is ready for download
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button className="gradient-primary text-primary-foreground">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        Convert Another
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Notice */}
              <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Demo Mode</p>
                  <p>
                    This is a UI demonstration. To enable actual file conversion, backend 
                    functionality would need to be added using serverless functions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
