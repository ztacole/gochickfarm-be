export interface AnimalHarvestReportResponse {
    id: number;
    tag: string;
    species: string;
    age: string,
    sex: "Jantan" | "Betina";
    weight: number;
    birthdate: string;
    status: 'Siap Dijual';
}

export interface AnimalSickReportResponse {
    id: number;
    tag: string;
    species: string;
    age: string,
    sex: "Jantan" | "Betina";
    weight: number;
    birthdate: string;
    status: 'Sakit' | 'Mati';
    health_notes: string;
}