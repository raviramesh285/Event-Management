export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "Admin" | "Event Manager" | "Department Manager";
  created_at: string;
  status: "active" | "disabled";
}

export interface Department {
  id: string;
  event_id: string;
  name: string;
  budget: number;
  manager_id?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  event_date: string;
  category: "Wedding" | "Corporate Event" | "Birthday" | "Trip" | "Festival" | "Custom";
  status: "active" | "archived";
  event_manager_id?: string;
}

export interface Expense {
  id: string;
  event_id: string;
  department_id: string;
  amount: number;
  category: string; // Dynamic now, e.g., Food Materials, Worker Salary, etc.
  description: string;
  date: string;
  receipt_url?: string;
  status: "Draft" | "Submitted" | "Pending Approval" | "Approved" | "Paid" | "Closed";
  created_by: string; // User ID
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user_id: string;
  details: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

export interface Settings {
  currency: string;
  language: string;
  theme: "dark" | "light";
  approvalLimit: number;
}
