export interface UserSummary {
    id: number;
    firstName: string;
    lastName: string;
    
    email: string;
    
}

export interface User extends UserSummary {
    department: { id: number; name: string } 
    leaveBalance: number;
    role: { id: number; name: string } 
}
