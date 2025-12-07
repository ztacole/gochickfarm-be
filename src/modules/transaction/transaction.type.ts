export interface TransactionResponse {
    id: number;
    description: string;
    type: "Pemasukan" | "Pengeluaran";
    total: number;
    date: string;
}

export interface TransactionDetailResponse {
    id: number;
    description: string;
    type: "Pemasukan" | "Pengeluaran";
    total: number;
    date: string;
    animals: AnimalInfo[];
}

interface AnimalInfo {
    id: number;
    tag: string;
    species: string;
    status: "Hidup" | "Mati" | "Terjual";
}

export interface TransactionRequest {
    type: "Pemasukan" | "Pengeluaran";
    description: string;
    total: number;
    date: string;
    animal_ids?: number[];
}