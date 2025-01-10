'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ImageContextType {
  selectedImage: File | null;
  previewUrl: string | null;
  showResults: boolean;
  analysisResults: {
    labels: string[];
    recipes: any[];
    timestamp: string;
  } | null;
  setSelectedImage: (image: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
  setShowResults: (show: boolean) => void;
  setAnalysisResults: (results: { labels: string[]; recipes: any[]; timestamp: string; } | null) => void;
  clearAnalysis: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    labels: string[];
    recipes: any[];
    timestamp: string;
  } | null>(null);

  // Load saved analysis from localStorage on mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('analysisResults');
    if (savedAnalysis) {
      setAnalysisResults(JSON.parse(savedAnalysis));
      setShowResults(true);
    }
  }, []);

  // Save analysis to localStorage when it changes
  useEffect(() => {
    if (analysisResults) {
      localStorage.setItem('analysisResults', JSON.stringify(analysisResults));
    }
  }, [analysisResults]);

  const clearAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowResults(false);
    setAnalysisResults(null);
    localStorage.removeItem('analysisResults');
  };

  return (
    <ImageContext.Provider
      value={{
        selectedImage,
        previewUrl,
        showResults,
        analysisResults,
        setSelectedImage,
        setPreviewUrl,
        setShowResults,
        setAnalysisResults,
        clearAnalysis,
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