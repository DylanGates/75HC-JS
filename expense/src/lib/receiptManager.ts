import { Expense } from '@/lib/types';

export interface ReceiptFile {
  id: string;
  expenseId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  uploaded: boolean;
  data?: ArrayBuffer;
}

export class ReceiptManager {
  private maxFileSize: number = 5 * 1024 * 1024; // 5MB
  private allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.maxFileSize) {
      return { 
        valid: false, 
        error: 'File size exceeds 5MB limit' 
      };
    }

    if (!this.allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed' 
      };
    }

    return { valid: true };
  }

  async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result instanceof ArrayBuffer) {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  async compressImage(file: File, maxWidth: number = 1024, maxHeight: number = 1024, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          let { width, height } = img;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, file.type, quality);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  generateReceiptId(expenseId: string): string {
    return `receipt_${expenseId}_${Date.now()}`;
  }

  async processReceipt(file: File, expenseId: string): Promise<ReceiptFile> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    let processedFile = file;
    
    // Compress images
    if (file.type.startsWith('image/')) {
      try {
        processedFile = await this.compressImage(file);
      } catch (error) {
        console.warn('Image compression failed, using original file:', error);
      }
    }

    const arrayBuffer = await this.readFileAsArrayBuffer(processedFile);
    
    return {
      id: this.generateReceiptId(expenseId),
      expenseId,
      fileName: processedFile.name,
      fileSize: processedFile.size,
      fileType: processedFile.type,
      uploadDate: new Date().toISOString(),
      uploaded: false,
      data: arrayBuffer
    };
  }

  async uploadReceipt(receipt: ReceiptFile): Promise<string> {
    // Simulate upload to cloud storage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real implementation, this would upload to AWS S3, Google Cloud Storage, etc.
        const fakeUrl = `https://storage.example.com/receipts/${receipt.id}`;
        resolve(fakeUrl);
      }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
    });
  }

  getReceiptIcon(fileType: string): string {
    if (fileType === 'application/pdf') {
      return '📄';
    } else if (fileType.startsWith('image/')) {
      return '🖼️';
    } else {
      return '📎';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const receiptManager = new ReceiptManager();