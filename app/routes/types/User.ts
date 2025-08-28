export interface User {
    id: number;
    firstName: string;
    lastName: string;
    department: { id: number; name: string } 
    email: string;
    leaveBalance: number;
    role: { id: number; name: string } 
}