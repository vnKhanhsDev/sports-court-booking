import { privateClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";

interface MediaUploadResponse {
    url: string;
}

/**
 * Uploads an image file to the server
 * @param file - The image file to upload
 * @param folder - Optional folder name for organizing uploads (defaults to "media")
 * @returns Promise that resolves to the uploaded image URL
 * @throws Error if the upload fails
 */
export async function uploadImage(file: File, folder?: string): Promise<string> {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('file', file);
        
        // Add folder parameter if provided
        if (folder) {
            formData.append('folder', folder);
        }

        // Make POST request using the configured privateClient
        // Note: Don't set Content-Type header manually for FormData - let axios set it with boundary
        const response = await privateClient.post<ApiResponse<MediaUploadResponse>>(
            ENDPOINTS.MEDIA.UPLOAD,
            formData,
            {
                timeout: 30000, // 30 seconds timeout for file uploads
            }
        );

        // Extract and return the URL from the ApiResponse structure
        if (!response.data?.success || !response.data?.data?.url) {
            throw new Error(response.data?.message || 'Invalid response: URL not found');
        }

        return response.data.data.url;
    } catch (error: any) {
        // Handle axios errors
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || 'Upload failed';
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error: Unable to connect to server');
        } else {
            // Something else happened
            throw error instanceof Error ? error : new Error('Upload failed');
        }
    }
}

