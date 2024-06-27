export interface SearchRoom {
    name: string;
    capacity: number | undefined;
    equipment: string;
    location: string;
}

export interface RoomResult {
    id: number;
    name: string;
    capacity: number;
    location: string;
    equipment: string;
    description: string;
    isBooked: boolean;
    createTime: Date;
    updateTime: Date;
}
