'use client';

import React, { createContext, useContext, useState } from 'react';

interface ImageContextType {
  selectedImage: File | null;
  previewUrl: string | null;
  showResults: boolean;
  hasGenerated: boolean;
  setSelectedImage: (image: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
  setShowResults: (show: boolean) => void;
  setHasGenerated: (generated: boolean) => void;
  resetState: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const resetState = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowResults(false);
    setHasGenerated(false);
  };

  return (
    <ImageContext.Provider
      value={{
        selectedImage,
        previewUrl,
        showResults,
        hasGenerated,
        setSelectedImage,
        setPreviewUrl,
        setShowResults,
        setHasGenerated,
        resetState
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImage() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
} 