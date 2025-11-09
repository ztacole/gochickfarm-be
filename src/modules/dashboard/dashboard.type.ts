import { AnimalResponse } from "../animal/animal.type";

export interface WebDashboardResponse {
    chicken_count: number;
    sold_chicken_count: number;
    goat_count: number;
    sold_goat_count: number;
    recent_animals: AnimalResponse[];
}

export interface DashboardGraphResponse {
    species: string;
    detail: {
        month: string;
        total_income: number;
    }[];
}

export interface MobileDashboardResponse {
    chicken_count: number;
    today_sold_chicken_count: number;
    goat_count: number;
    today_sold_goat_count: number;
    today_income: number;
}