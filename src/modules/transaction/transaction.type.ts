export interface TransactionResponse {
    id: number;
    description: string;
    type: "Pemasukan" | "Pengeluaran";
    total: number;
    date: string;
}

export interface TransactionRequest {
    type: "Pemasukan" | "Pengeluaran";
    description: string;
    total: number;
    date: string;
    animal_ids?: number[];
}