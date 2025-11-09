export interface FeedingLogByAnimalResponse {
    id: number;
    date: string;
    time: string;
    feed: string;
    amount: number;
    new_weight: number;
    health_notes: string;
}

export interface FeedingLogCreateRequest {
    animal_id: number;
    feed_id: number;
    quantity: number;
    new_weight: number;
    health_notes: string;
}