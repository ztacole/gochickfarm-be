export interface FeedResponse {
    id: number;
    name: string,
    quantity: number,
    price_per_unit: number
}

export interface FeedResponseWithoutPagination {
    id: number;
    name: string,
    quantity: number,
}

export interface FeedRequest {
    name: string,
    quantity: number,
    price_per_unit: number
}