import { Response } from '@/axios';

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

export interface SearchMeetingRoom {
    name: string;
    capacity: number | undefined;
    equipment: string;
}

export interface Page { 
    pageNo: number; pageSize: number; 
}

export interface MeetingRoomRequest extends SearchMeetingRoom, Page {}

export interface MeetingRoomResponse {
    meetingRooms: MeetingRoomSearchResult[];
    totalCount: number
}

export interface FormMeetingRoom {
    name: string;
    capacity: number;
    equipment: string;
    location: string;
    description: string;
}

export interface MeetingRoomFormResponse  {
    room: MeetingRoomSearchResult
}
