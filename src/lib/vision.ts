// src/lib/vision.ts
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// Ambil konfigurasi dari environment variables
const key = process.env.AZURE_COMPUTER_VISION_KEY?.trim();
const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT?.trim();

// Debug log
console.log('Vision Service Configuration:');
console.log('Key exists:', !!key);
console.log('Endpoint:', endpoint);

// Validasi konfigurasi
if (!key || !endpoint) {
  throw new Error('Azure Computer Vision configuration is missing. Please check your environment variables.');
}

// Pastikan endpoint dalam format yang benar (hapus trailing slash)
const sanitizedEndpoint = endpoint.replace(/\/+$/, '');

// Inisialisasi client dengan credentials yang benar
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ 
    inHeader: { 
      'Ocp-Apim-Subscription-Key': key 
    }
  }),
  sanitizedEndpoint
);

interface AnalysisResult {
  name: string;
  confidence: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeImage(base64Image: string): Promise<string[]> {
  try {
    console.log('Starting image analysis...');
    
    // Validasi input
    if (!base64Image) {
      throw new Error('No image data provided');
    }

    // Hapus prefix data URL jika ada dan konversi ke buffer
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    console.log('Image buffer prepared, size:', imageBuffer.length, 'bytes');
    
    // Implementasi retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      try {
        console.log(`Analysis attempt ${attempts + 1} of ${maxAttempts}...`);
        
        // Analisis gambar
        const result = await computerVisionClient.analyzeImageInStream(
          imageBuffer,
          { 
            visualFeatures: ['Tags', 'Objects', 'Description'],
            language: 'id' // Gunakan Bahasa Indonesia
          }
        );

        console.log('Raw API response received');

        if (!result) {
          throw new Error('No analysis results received from Azure');
        }

        // Kumpulkan semua tag yang relevan
        const allTags = new Set<string>();

        // Tambahkan dari tags
        if (result.tags) {
          result.tags
            .filter(tag => tag && typeof tag.confidence === 'number' && tag.confidence > 0.5)
            .forEach(tag => tag.name && allTags.add(tag.name.toLowerCase()));
        }

        // Tambahkan dari objects
        if (result.objects) {
          result.objects
            .filter(obj => obj && typeof obj.confidence === 'number' && obj.confidence > 0.5)
            .forEach(obj => obj.object && allTags.add(obj.object.toLowerCase()));
        }

        // Tambahkan dari description
        if (result.description?.captions) {
          result.description.captions
            .filter(caption => caption && typeof caption.confidence === 'number' && caption.confidence > 0.5)
            .forEach(caption => {
              if (caption.text) {
                caption.text.toLowerCase().split(' ').forEach(word => {
                  if (word.length > 3) {
                    allTags.add(word);
                  }
                });
              }
            });
        }

        // Filter tags yang relevan dengan makanan
        const foodRelatedTags = Array.from(allTags).filter(tag => {
          const tagLower = tag.toLowerCase();
          return (
            tagLower.includes('food') ||
            tagLower.includes('makanan') ||
            tagLower.includes('ingredient') ||
            tagLower.includes('bahan') ||
            tagLower.includes('vegetable') ||
            tagLower.includes('sayur') ||
            tagLower.includes('fruit') ||
            tagLower.includes('buah') ||
            tagLower.includes('meat') ||
            tagLower.includes('daging') ||
            tagLower.includes('spice') ||
            tagLower.includes('rempah') ||
            tagLower.includes('herb') ||
            tagLower.includes('bumbu')
          );
        });

        console.log('Analysis complete. Found tags:', foodRelatedTags);
        return foodRelatedTags;

      } catch (error) {
        lastError = error as Error;
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error);
        
        if (attempts < maxAttempts) {
          const waitTime = Math.pow(2, attempts) * 1000;
          console.log(`Waiting ${waitTime}ms before retry...`);
          await sleep(waitTime);
        }
      }
    }

    // Jika semua percobaan gagal
    console.error('All analysis attempts failed:', lastError);
    throw new Error(`Failed to analyze image after ${maxAttempts} attempts: ${lastError?.message}`);

  } catch (error) {
    console.error('Final error in analyzeImage:', error);
    throw error;
  }
}