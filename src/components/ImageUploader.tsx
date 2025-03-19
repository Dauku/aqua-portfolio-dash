
import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { airtableService } from '@/utils/airtable';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
}

const ImageUploader = ({ currentImageUrl, onImageUploaded, className = '' }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (jpg, png, gif, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      
      // Upload the image (in a real app, this would upload to a cloud storage service)
      const imageUrl = await airtableService.uploadImage(file);
      
      onImageUploaded(imageUrl);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const imageStyles = previewUrl ? {
    backgroundImage: `url(${previewUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  return (
    <div className={`relative ${className}`}>
      <div 
        className="w-full h-48 border-2 border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        style={imageStyles}
        onClick={handleButtonClick}
      >
        {!previewUrl && (
          <div className="flex flex-col items-center p-4 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Click to upload an image</p>
            <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG, GIF up to 10MB</p>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="mt-2 flex items-center"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {previewUrl ? 'Change Image' : 'Upload Image'}
      </Button>
    </div>
  );
};

export default ImageUploader;
