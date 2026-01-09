import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, FileText, AlertCircle, Download, X } from 'lucide-react';
import { parseCSV } from '@/utils/csv';
import type { ParsedCSV } from '@/types/payment';

interface CSVUploadProps {
  onParsed: (data: ParsedCSV) => void;
  onClear: () => void;
  hasData: boolean;
}

export function CSVUpload({ onParsed, onClear, hasData }: CSVUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset file input when component unmounts
  useEffect(() => {
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      onParsed({
        recipients: [],
        errors: ['Please upload a CSV file'],
        isValid: false,
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);
    
    const result = await parseCSV(file);
    onParsed(result);
    setIsLoading(false);
  }, [onParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const handleDropzoneClick = useCallback(() => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isLoading]);

  const downloadSample = () => {
    const sampleCSV = `0x742d35Cc6634C0532925a3b844Bc9e7595f1Ab21,Alice Johnson,0.5
0x8ba1f109551bD432803012645Hac136c22C5e28,Bob Smith,0.25
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,Charlie Brown,0.1`;
    
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batchpay-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="upload" className="py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Upload Recipients
            </h2>
            <p className="text-muted-foreground">
              Upload a CSV file with recipient addresses, names, and amounts
            </p>
          </div>

          <div className="card-base">
            {hasData && fileName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{fileName}</p>
                    <p className="text-sm text-muted-foreground">File uploaded successfully</p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleDropzoneClick}
                  className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-foreground">Parsing CSV...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <p className="mb-2 text-lg font-medium text-foreground">
                        Drop your CSV file here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-xl bg-accent p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">CSV Format</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Each row: <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">address,name,amount</code>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Amount in ETH (e.g., 0.5 for half an ETH). Max 200 recipients.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={downloadSample}
                  className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Download className="h-4 w-4" />
                  Download sample CSV
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
