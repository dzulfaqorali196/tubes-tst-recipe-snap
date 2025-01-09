export interface Recipe {
    id: string; // ID unik untuk resep
    title: string; // Judul resep
    ingredients: string[]; // Daftar bahan yang digunakan
    instructions: string[]; // Langkah-langkah untuk membuat resep
    image?: string; // URL gambar resep (opsional)
    usedIngredientCount: number; // Jumlah bahan yang digunakan dari yang tersedia
    missedIngredientCount: number; // Jumlah bahan yang tidak tersedia
} 