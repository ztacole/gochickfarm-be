import { AnimalResponse } from "../animal/animal.type";

export interface WebDashboardResponse {
    chicken_count: number;
    sold_chicken_count: number;
    goat_count: number;
    sold_goat_count: number;
    recent_animals: AnimalResponse[];
}

export interface DashboardTransactionResponse {
    id: number;
    description: string;
    type: "Pemasukan" | "Pengeluaran";
    total: number;
    date: string;
}

export interface DashboardGraphResponse {
    species: string;
    detail: {
        month: string;
        total_income: number;
    }[];
}