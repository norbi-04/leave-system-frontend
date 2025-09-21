import type { User } from "./UserType";

export interface LeaveRequest {
    id: number;
    user: User;
    manager: User | null;
    startDate: string;  
    endDate: string;     
    days: number;
    status: "Pending" | "Approved" | "Rejected" | "Cancelled";
    reason: string | null;
    createdAt: string;  
}