/**
 * Client-side STL file parser utilities
 * These utilities help with parsing and validating STL files before upload
 */

/**
 * Interface for STL file information
 */
export interface STLInfo {
  vertexCount: number;
  faceCount: number;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Check if a File is a valid STL file
 * @param file The file to check
 * @returns Promise resolving with STL info
 */
export async function validateSTLFile(file: File): Promise<STLInfo> {
  // Check file extension
  if (!file.name.toLowerCase().endsWith(".stl")) {
    return {
      vertexCount: 0,
      faceCount: 0,
      isValid: false,
      errorMessage: "File must have .stl extension",
    };
  }

  // Check file size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    return {
      vertexCount: 0,
      faceCount: 0,
      isValid: false,
      errorMessage: "File is too large (max 100MB)",
    };
  }

  try {
    // Read a small portion of the file to check if it's a valid STL
    const arrayBuffer = await file.arrayBuffer();
    const isAscii = isAsciiSTL(arrayBuffer);
    
    // For ASCII files, we just check the header
    if (isAscii) {
      // Estimate face count (rough calculation)
      const text = new TextDecoder().decode(new Uint8Array(arrayBuffer, 0, Math.min(1000, arrayBuffer.byteLength)));
      const solidMatch = text.match(/solid\s+(.*)/);
      
      if (!solidMatch) {
        return {
          vertexCount: 0,
          faceCount: 0,
          isValid: false,
          errorMessage: "Invalid ASCII STL file format",
        };
      }
      
      // Very rough estimation for ASCII STL
      const faceCount = Math.floor((file.size / 400)); // Average ASCII facet is ~400 bytes
      const vertexCount = faceCount * 3; // Each face has 3 vertices
      
      return {
        vertexCount,
        faceCount,
        isValid: true,
      };
    } 
    
    // For binary STL, read the header to get the face count
    const view = new DataView(arrayBuffer);
    const faceCount = view.getUint32(80, true);
    const vertexCount = faceCount * 3; // Each face has 3 vertices
    
    // Verify file size matches expected size for binary STL
    const expectedSize = 84 + (faceCount * 50); // Header (84 bytes) + facets (50 bytes each)
    
    if (file.size < expectedSize) {
      return {
        vertexCount: 0,
        faceCount: 0,
        isValid: false,
        errorMessage: "Binary STL file is corrupted or incomplete",
      };
    }
    
    return {
      vertexCount,
      faceCount,
      isValid: true,
    };
  } catch (error) {
    return {
      vertexCount: 0,
      faceCount: 0,
      isValid: false,
      errorMessage: `Failed to parse STL file: ${error.message}`,
    };
  }
}

/**
 * Determine if an STL file is ASCII or binary
 * @param arrayBuffer The file buffer
 * @returns true if ASCII, false if binary
 */
function isAsciiSTL(arrayBuffer: ArrayBuffer): boolean {
  // Read first 6 bytes and check if they spell "solid"
  const header = new Uint8Array(arrayBuffer, 0, 6);
  const text = new TextDecoder().decode(header);
  return text.trim().toLowerCase() === "solid";
}

/**
 * Type definition for STL file upload parameters and callbacks
 */
export interface STLUploadParams {
  file: File;
  projectId: number;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Upload an STL file to the server
 * @param params Upload parameters and callbacks
 */
export async function uploadSTLFile({
  file,
  projectId,
  onProgress,
  onSuccess,
  onError,
}: STLUploadParams): Promise<void> {
  try {
    // Validate file before upload
    const validationResult = await validateSTLFile(file);
    
    if (!validationResult.isValid) {
      if (onError) onError(new Error(validationResult.errorMessage));
      return;
    }
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('stlFile', file);
    formData.append('projectId', projectId.toString());
    formData.append('name', file.name.replace('.stl', ''));
    
    // Upload the file
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        if (onSuccess) onSuccess(response);
      } else {
        let errorMsg = 'Upload failed';
        try {
          const response = JSON.parse(xhr.responseText);
          errorMsg = response.message || errorMsg;
        } catch (e) {
          // Use default error message if parsing fails
        }
        if (onError) onError(new Error(errorMsg));
      }
    });
    
    xhr.addEventListener('error', () => {
      if (onError) onError(new Error('Network error occurred during upload'));
    });
    
    xhr.addEventListener('abort', () => {
      if (onError) onError(new Error('Upload was aborted'));
    });
    
    xhr.open('POST', '/api/models/upload');
    xhr.send(formData);
  } catch (error) {
    if (onError) onError(error);
  }
}
