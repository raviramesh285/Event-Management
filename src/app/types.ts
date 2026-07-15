export type UserRole = "Admin" | "Event Organizer" | "Participant";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  event_date: string;
  category: "Wedding" | "Birthday" | "College Event" | "Corporate Event" | "Trip" | "Festival" | "Custom";
  status: "active" | "archived";
  organizer_id: string;
}

export interface SubEvent {
  id: string;
  event_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: "pending" | "completed";
}

export interface Participant {
  id: string;
  event_id: string;
  user_id: string;
}

export interface Expense {
  id: string;
  event_id: string;
  amount: number;
  category: "Food" | "Travel" | "Decoration" | "Venue" | "Photography" | "Entertainment" | "Miscellaneous";
  description: string;
  receipt_url?: string;
  created_by: string;
  date: string;
}

export interface Vendor {
  id: string;
  event_id: string;
  vendor_name: string;
  contact: string;
  email?: string;
  amount: number;
  service_type: "Catering" | "Decoration" | "Photography" | "Sound System" | "Transportation" | "Venue Provider";
  status: "paid" | "pending";
  notes?: string;
}

export interface Payment {
  id: string;
  event_id: string;
  participant_id: string;
  expense_id?: string;
  amount: number;
  status: "paid" | "unpaid";
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success";
  created_at: string;
  read: boolean;
}

export interface AppSettings {
  currency: string;
  warningThreshold: number;
  theme: "light" | "dark";
}

export interface SplitConfig {
  expenseId: string;
  type: "equal" | "percentage" | "custom";
  shares: { [userId: string]: number };
}
