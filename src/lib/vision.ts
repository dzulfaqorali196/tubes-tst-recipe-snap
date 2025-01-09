// src/lib/vision.ts
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// Ambil konfigurasi dari environment variables
const key = process.env.AZURE_COMPUTER_VISION_KEY?.trim();
const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT?.trim();

// Debug log
console.log('Loading vision config...');
console.log('Key length:', key?.length);
console.log('Key preview:', key?.substring(0, 10) + '...');
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

export async function analyzeImage(base64Image: string): Promise<AnalysisResult[]> {
  try {
    // Validasi input
    if (!base64Image) {
      throw new Error('No image data provided');
    }

    // Hapus prefix data URL jika ada dan konversi ke buffer
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    // Debug log untuk memastikan request yang dikirim
    console.log('Preparing request to Azure Computer Vision...');
    console.log('Using endpoint:', sanitizedEndpoint);
    console.log('Image buffer size:', imageBuffer.length, 'bytes');
    
    // Implementasi retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} of ${maxAttempts}...`);
        
        // Analisis gambar dengan method yang benar
        const result = await computerVisionClient.analyzeImageInStream(
          imageBuffer,
          { 
            visualFeatures: ['Tags']
          }
        );

        console.log('Raw API response:', JSON.stringify(result, null, 2));

        // Jika berhasil, proses hasilnya
        if (!result?.tags) {
          throw new Error('No analysis results received from Azure');
        }

        // Proses tags dengan tipe data yang benar
        const tags = result.tags
          .filter((tag): tag is { name: string; confidence: number } => 
            typeof tag.name === 'string' && 
            typeof tag.confidence === 'number' && 
            tag.confidence > 0.5
          )
          .map(tag => ({
            name: tag.name,
            confidence: tag.confidence
          }));

        // Filter tags yang relevan dengan makanan
        const foodTags = tags.filter(tag => {
          const name = tag.name.toLowerCase();
          return (
            name.includes('food') ||
            name.includes('ingredient') ||
            name.includes('vegetable') ||
            name.includes('fruit') ||
            name.includes('meat') ||
            name.includes('spice') ||
            name.includes('herb') ||
            name.includes('dish') ||
            name.includes('meal') ||
            name.includes('cuisine') ||
            name.includes('cooking') ||
            name.includes('kitchen') ||
            name.includes('recipe')
          );
        });

        console.log('Processed food tags:', foodTags);

        if (foodTags.length === 0) {
          console.warn('No food-related tags found in the image');
        }

        return foodTags;

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
    console.error('All attempts failed:', lastError);
    throw new Error(`Azure Vision API Error after ${maxAttempts} attempts: ${lastError?.message}`);

  } catch (error) {
    console.error('Final error:', error);
    if (error instanceof Error) {
      throw new Error(`Azure Vision API Error: ${error.message}`);
    }
    throw new Error('Failed to analyze image');
  }
}