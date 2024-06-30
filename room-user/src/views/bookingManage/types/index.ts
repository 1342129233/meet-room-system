export interface SearchBooking {
	username: string;
	meetingRoomName: string;
	meetingRoomPosition: string;
	rangeStartDate: Date;
	rangeStartTime: Date;
	rangeEndDate: Date;
	rangeEndTime: Date;
}

export interface BookingListResult {
    bookings: BookingSearchResult[];
    totalCount: number;
}

export interface BookingSearchResult {
    createTime: string;
    endTime: string;
    id: number;
    note: string;
    room: RoomType;
    startTime: string;
    status: number;
    updateTime: string;
    user: UserType;
}

export interface RoomType {
    capacity: number;
    createTime: string;
    description: string;
    equipment: string;
    id: number;
    isBooked: boolean;
    location: string;
    name: string;
    updateTime: string;
}

export interface UserType {
    createTime: string;
    email: string;
    headPic: string;
    id: number;
    isAdmin: boolean;
    isFrozen: boolean;
    nickName: string;
    phoneNumber: string;
    updateTime: string;
    username: string;
}
