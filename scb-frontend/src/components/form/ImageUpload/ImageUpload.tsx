import { useRef, useState } from "react";
import styles from "./ImageUpload.module.css";
import { Delete } from "@/components/ui/icons";

interface ImageUploadProps {
    multiple?: boolean;
    value: string[] | string;
    onChange: (newValue: string[] | string) => void;
    onUpload: (file: File) => Promise<string>;
    className?: string;
}

export default function ImageUpload({
    multiple = false,
    value,
    onChange,
    onUpload,
    className = ""
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const images: string[] = multiple 
        ? (Array.isArray(value) ? value : [])
        : (typeof value === 'string' && value ? [value] : []);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const maxFiles = multiple ? fileArray.length : 1;
        const filesToUpload = fileArray.slice(0, maxFiles);

        // Validate file types
        const invalidFiles = filesToUpload.filter(file => !file.type.startsWith('image/'));
        if (invalidFiles.length > 0) {
            console.error('File must be an image');
            return;
        }

        setIsUploading(true);

        try {
            const uploadPromises = filesToUpload.map(file => onUpload(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            if (multiple) {
                onChange([...images, ...uploadedUrls] as string[]);
            } else {
                onChange((uploadedUrls[0] || '') as string);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemove = (index: number) => {
        if (multiple) {
            const newImages = [...images];
            newImages.splice(index, 1);
            onChange(newImages as string[]);
        } else {
            onChange('' as string);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div 
            className={`${styles.container} ${className}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileInputChange}
                className={styles.hiddenInput}
            />

            {multiple ? (
                <div className={styles.multipleContainer}>
                    {images.map((image, index) => (
                        <div key={index} className={styles.previewWrapper}>
                            <img 
                                src={image} 
                                alt={`Upload ${index + 1}`}
                                className={styles.preview}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className={styles.removeButton}
                                aria-label="Remove image"
                                disabled={isUploading}
                            >
                                <Delete />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleClick}
                        className={`${styles.uploadButton} ${isDragging ? styles.dragging : ''}`}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <span>Đang tải lên...</span>
                        ) : (
                            <>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 5V19M5 12H19"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Thêm ảnh</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className={styles.singleContainer}>
                    {images.length > 0 ? (
                        <div className={styles.previewWrapper}>
                            <img 
                                src={images[0]} 
                                alt="Upload preview"
                                className={styles.preview}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(0)}
                                className={styles.removeButton}
                                aria-label="Remove image"
                                disabled={isUploading}
                            >
                                <Delete />
                            </button>
                            <button
                                type="button"
                                onClick={handleClick}
                                className={styles.replaceButton}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Đang tải lên...' : 'Thay đổi'}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleClick}
                            className={`${styles.uploadButton} ${styles.singleUpload} ${isDragging ? styles.dragging : ''}`}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <span>Đang tải lên...</span>
                            ) : (
                                <>
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 5V19M5 12H19"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>Thêm ảnh</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

