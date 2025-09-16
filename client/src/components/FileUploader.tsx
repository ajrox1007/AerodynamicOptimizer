import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onModelUploaded: (modelId: number) => void;
  projectId: number | null;
}

export default function FileUploader({ onModelUploaded, projectId }: FileUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 200);

      try {
        const response = await fetch('/api/models/upload', {
          method: 'POST',
          body: formData,
        });
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }
        
        return await response.json();
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    onSuccess: (data) => {
      setUploadStatus("success");
      onModelUploaded(data.id);
    },
    onError: (error) => {
      setUploadStatus("error");
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    if (!selectedFile.name.toLowerCase().endsWith('.stl')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an STL file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (100MB limit)
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 100MB",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    handleUpload(selectedFile);
  };

  const handleUpload = (selectedFile: File) => {
    if (!projectId) {
      toast({
        title: "Missing project",
        description: "Please select a project first",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('stlFile', selectedFile);
    formData.append('projectId', projectId.toString());
    formData.append('name', selectedFile.name.replace('.stl', ''));

    setUploadStatus("uploading");
    setUploadProgress(0);
    uploadMutation.mutate(formData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400">MODEL INPUT</h3>
      
      {uploadStatus === "idle" || uploadStatus === "error" ? (
        <div 
          className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-dark-border'} rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-6 w-6 text-gray-500 mb-2" />
          <p className="text-sm text-gray-300">Drop STL file here or</p>
          <button className="mt-2 text-primary text-sm font-medium">Browse Files</button>
          <p className="mt-2 text-xs text-gray-500">Max file size: 100MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".stl"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{file?.name}</span>
            <span className={uploadStatus === "success" ? "text-green-400" : "text-blue-400"}>
              {uploadStatus === "success" ? "Valid" : `${uploadProgress}%`}
            </span>
          </div>
          <Progress 
            value={uploadProgress} 
            className={`h-1 mt-1 ${uploadStatus === "success" ? "bg-green-400" : ""}`} 
          />
        </div>
      )}
    </div>
  );
}
