export interface WebTransactionResponse {
    id: number;
    description: string;
    type: "Pemasukan" | "Pengeluaran";
    total: number;
    date: string;
}