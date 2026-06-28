export type Role = "admin" | "manager" | "user";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  credits: number;
  creditsUsed: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResource {
  _id: string;
  uid: string;
  label?: string;
  owner: string | IUser;
  status: "active" | "expired" | "revoked" | "suspended";
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
  createdBy: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: string;
  action: string;
  actor: string | IUser;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
