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
export interface Page { 
    pageNo: number; pageSize: number; 
}

export interface MeetingRoomRequest extends SearchRoom, Page {}

export interface MeetingRoomSearchResult {
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

export interface createBooking {
    meetingRoomId: number;
    rangeStartDate: Date;
    rangeStartTime: Date;
    rangeEndDate: Date;
    rangeEndTime: Date;
    note: string;
    userId: number;
}
