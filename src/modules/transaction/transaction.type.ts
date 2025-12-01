export interface TransactionResponse {
    id: number;
    description: string;
    type: "Pemasukan" | "Pengeluaran";
    total: number;
    date: string;
}