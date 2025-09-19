export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface User extends UserSummary {
  department: { id: number; name: string };
  leaveBalance: number;
  role: { id: number; name: string };
}

export interface AuthUser {
  token: {
    firstName: string;
    lastName: string;
    email: string;
    id: number;
    role: {
      id: number;
      name: string;
    };
    department?: {
      id: number;
      name: string;
    };
    leaveBalance?: number;
  };
  iat?: number;
  exp?: number;
}
