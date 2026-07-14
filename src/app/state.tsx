import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Event, Participant, Expense, Vendor, Payment, SystemNotification, AppSettings, UserRole } from "./types";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  participants: Participant[];
  expenses: Expense[];
  vendors: Vendor[];
  payments: Payment[];
  notifications: SystemNotification[];
  settings: AppSettings;
  login: (email: string, password?: string, role?: UserRole) => Promise<User>;
  register: (name: string, email: string, password?: string, role?: UserRole) => Promise<User>;
  logout: () => void;
  createEvent: (eventData: Omit<Event, "id" | "organizer_id">) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  archiveEvent: (eventId: string) => void;
  addParticipantToEvent: (eventId: string, userId: string) => void;
  removeParticipantFromEvent: (eventId: string, userId: string) => void;
  addExpense: (expenseData: Omit<Expense, "id" | "created_by">) => void;
  deleteExpense: (expenseId: string) => void;
  editExpense: (expense: Expense) => void;
  addVendor: (vendorData: Omit<Vendor, "id">) => void;
  editVendor: (vendor: Vendor) => void;
  deleteVendor: (vendorId: string) => void;
  updateVendorPayment: (vendorId: string, status: "paid" | "pending") => void;
  markPaymentStatus: (paymentId: string, status: "paid" | "unpaid") => void;
  splitExpense: (expenseId: string, type: "equal" | "percentage" | "custom", splits: { [userId: string]: number }) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  clearNotifications: () => void;
  markNotificationRead: (id: string) => void;
  seedAISuggestedPlan: (title: string, budget: number, category: any, location: string, planData: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: "u-admin", name: "Ankit Kumar", email: "admin@expensevision.ai", role: "Admin", created_at: "2026-01-01" },
  { id: "u-org", name: "Devendra Patil", email: "organizer@expensevision.ai", role: "Event Organizer", created_at: "2026-01-05" },
  { id: "u-p1", name: "Rahul Sharma", email: "rahul@gmail.com", role: "Participant", created_at: "2026-02-10" },
  { id: "u-p2", name: "Sneha Reddy", email: "sneha@gmail.com", role: "Participant", created_at: "2026-02-12" },
  { id: "u-p3", name: "Priya Nair", email: "priya@gmail.com", role: "Participant", created_at: "2026-02-15" }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: "e-gala",
    title: "Annual Gala 2025",
    description: "The premium annual corporate celebration for employees and stakeholders.",
    budget: 485000,
    location: "Grand Ballroom, Marriott Hotels",
    event_date: "2026-08-15",
    category: "Corporate Event",
    status: "active",
    organizer_id: "u-org"
  },
  {
    id: "e-tech",
    title: "National TechFest '26",
    description: "Annual collegiate engineering symposium with hackathons and panel talks.",
    budget: 300000,
    location: "Campus Main Auditorium",
    event_date: "2026-09-20",
    category: "College Event",
    status: "active",
    organizer_id: "u-org"
  },
  {
    id: "e-wedding",
    title: "Meera's Dream Wedding",
    description: "Traditional destination wedding ceremony and reception banquet.",
    budget: 1500000,
    location: "Royal Palace Resorts, Udaipur",
    event_date: "2026-11-04",
    category: "Wedding",
    status: "active",
    organizer_id: "u-admin"
  }
];

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: "pt-1", event_id: "e-gala", user_id: "u-p1" },
  { id: "pt-2", event_id: "e-gala", user_id: "u-p2" },
  { id: "pt-3", event_id: "e-gala", user_id: "u-p3" },
  { id: "pt-4", event_id: "e-tech", user_id: "u-p1" },
  { id: "pt-5", event_id: "e-tech", user_id: "u-p2" }
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "ex-1",
    event_id: "e-gala",
    amount: 150000,
    category: "Venue",
    description: "Ballroom rental deposit and setup charges",
    receipt_url: "receipt_venue.png",
    created_by: "u-org",
    date: "2026-07-01"
  },
  {
    id: "ex-2",
    event_id: "e-gala",
    amount: 124000,
    category: "Food",
    description: "Premium catering buffet package (200 guests)",
    receipt_url: "receipt_catering.png",
    created_by: "u-org",
    date: "2026-07-05"
  },
  {
    id: "ex-3",
    event_id: "e-gala",
    amount: 70000,
    category: "Entertainment",
    description: "Live band performance and sound engineer cost",
    receipt_url: "receipt_band.png",
    created_by: "u-org",
    date: "2026-07-06"
  },
  {
    id: "ex-4",
    event_id: "e-gala",
    amount: 44500,
    category: "Decoration",
    description: "Floral stage backdrops and table glow lamps",
    receipt_url: "receipt_decor.png",
    created_by: "u-org",
    date: "2026-07-08"
  }
];

const INITIAL_VENDORS: Vendor[] = [
  {
    id: "v-catering",
    event_id: "e-gala",
    vendor_name: "Gourmet Banquet Catering",
    contact: "9876543210",
    email: "events@gourmet banquet.com",
    amount: 150000,
    service_type: "Catering",
    status: "pending",
    notes: "Requires final count update 5 days before event"
  },
  {
    id: "v-venue",
    event_id: "e-gala",
    vendor_name: "Marriott Grand Banquets",
    contact: "8765432109",
    email: "bookings@marriott.com",
    amount: 250000,
    service_type: "Venue Provider",
    status: "paid",
    notes: "Deposit paid. Remainder due on check-in."
  },
  {
    id: "v-photog",
    event_id: "e-gala",
    vendor_name: "Infinity Photo & Cinema",
    contact: "7654321098",
    email: "contact@infinityphoto.com",
    amount: 60000,
    service_type: "Photography",
    status: "pending",
    notes: "Includes 2 photographers and cinematic drone setup"
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  { id: "pay-1", event_id: "e-gala", participant_id: "u-p1", amount: 15000, status: "paid" },
  { id: "pay-2", event_id: "e-gala", participant_id: "u-p2", amount: 15000, status: "unpaid" },
  { id: "pay-3", event_id: "e-gala", participant_id: "u-p3", amount: 15000, status: "unpaid" }
];

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  { id: "n-1", title: "Catering budget exceeded by ₹12,500", message: "Catering cost exceeds allocated regional cap. Renegotiate or review vendors.", type: "warning", created_at: "2026-07-13", read: false },
  { id: "n-2", title: "Budget utilization alert", message: "Annual Gala 2025 spend has reached 83% of allocated budget limit.", type: "warning", created_at: "2026-07-14", read: false },
  { id: "n-3", title: "Welcome to ExpenseVision AI", message: "Create a new event, invite participants, and let AI scan your receipts.", type: "success", created_at: "2026-07-14", read: false }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const s = localStorage.getItem("ev_current_user");
    return s ? JSON.parse(s) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const s = localStorage.getItem("ev_users");
    return s ? JSON.parse(s) : INITIAL_USERS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const s = localStorage.getItem("ev_events");
    return s ? JSON.parse(s) : INITIAL_EVENTS;
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    const s = localStorage.getItem("ev_participants");
    return s ? JSON.parse(s) : INITIAL_PARTICIPANTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const s = localStorage.getItem("ev_expenses");
    return s ? JSON.parse(s) : INITIAL_EXPENSES;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const s = localStorage.getItem("ev_vendors");
    return s ? JSON.parse(s) : INITIAL_VENDORS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const s = localStorage.getItem("ev_payments");
    return s ? JSON.parse(s) : INITIAL_PAYMENTS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const s = localStorage.getItem("ev_notifications");
    return s ? JSON.parse(s) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = localStorage.getItem("ev_settings");
    return s ? JSON.parse(s) : { currency: "₹", warningThreshold: 0.8, theme: "dark" };
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("ev_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ev_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("ev_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("ev_participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem("ev_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("ev_vendors", JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem("ev_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("ev_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("ev_settings", JSON.stringify(settings));
    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  // Auth Operations
  const login = async (email: string, password?: string, role?: UserRole): Promise<User> => {
    try {
      // Direct demo login fallback if just providing role without password
      if (!password && role) {
         const res = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}`);
         const data = await res.json();
         if (data.length > 0) {
            setCurrentUser(data[0]);
            return data[0];
         }
         // Auto-register demo user if not found
         const newUser = {
            id: `u-${Math.random().toString(36).substr(2, 9)}`,
            name: email.split("@")[0].toUpperCase(),
            email,
            password: "demo",
            role,
            created_at: new Date().toISOString().split("T")[0]
         };
         const createRes = await fetch("http://localhost:3001/users", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(newUser)
         });
         const createdUser = await createRes.json();
         setCurrentUser(createdUser);
         setUsers(prev => [...prev, createdUser]);
         return createdUser;
      }

      // Real login with password
      const res = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data.length === 0) {
        throw new Error("User not found. Use registration or Demo login first.");
      }
      
      const user = data[0];
      
      // Simple plain-text check for our mock environment
      if (user.password !== password && password !== undefined) {
        throw new Error("Invalid password.");
      }

      setCurrentUser(user);
      return user;
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (name: string, email: string, password?: string, role?: UserRole): Promise<User> => {
    try {
      const res = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data.length > 0) {
        throw new Error("Email already registered. Please login.");
      }

      const newUser = {
        id: `u-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        password: password || "default",
        role: role || "Participant",
        created_at: new Date().toISOString().split("T")[0]
      };

      const createRes = await fetch("http://localhost:3001/users", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newUser)
      });
      const createdUser = await createRes.json();
      setCurrentUser(createdUser);
      setUsers(prev => [...prev, createdUser]);
      return createdUser;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Check Budget Warnings
  const checkBudgetThresholds = (eventId: string, addAmount: number, currentExpenses: Expense[], currentEvents: Event[]) => {
    const targetEvent = currentEvents.find(e => e.id === eventId);
    if (!targetEvent) return;

    const totalSpent = currentExpenses
      .filter(ex => ex.event_id === eventId)
      .reduce((sum, ex) => sum + ex.amount, 0) + addAmount;

    const usagePct = totalSpent / targetEvent.budget;
    
    if (usagePct >= 1.0) {
      const newNotif: SystemNotification = {
        id: `n-warning-${Date.now()}`,
        title: `CRITICAL: Budget Exceeded for ${targetEvent.title}`,
        message: `Total spent (${settings.currency}${totalSpent.toLocaleString("en-IN")}) has exceeded the allocated budget of ${settings.currency}${targetEvent.budget.toLocaleString("en-IN")}.`,
        type: "warning",
        created_at: new Date().toISOString().split("T")[0],
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    } else if (usagePct >= settings.warningThreshold) {
      const newNotif: SystemNotification = {
        id: `n-warning-${Date.now()}`,
        title: `Warning: Budget utilization is high for ${targetEvent.title}`,
        message: `Total spent is ${settings.currency}${totalSpent.toLocaleString("en-IN")} (${Math.round(usagePct * 100)}% of budget limit).`,
        type: "warning",
        created_at: new Date().toISOString().split("T")[0],
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Event Operations
  const createEvent = (eventData: Omit<Event, "id" | "organizer_id">) => {
    if (!currentUser) return;
    const newEvent: Event = {
      ...eventData,
      id: `e-${Math.random().toString(36).substr(2, 9)}`,
      organizer_id: currentUser.id
    };
    setEvents(prev => [newEvent, ...prev]);
    
    // Auto add notification
    const newNotif: SystemNotification = {
      id: `n-${Date.now()}`,
      title: `New event created: ${newEvent.title}`,
      message: `Event initialized with a budget of ${settings.currency}${newEvent.budget.toLocaleString("en-IN")}.`,
      type: "success",
      created_at: new Date().toISOString().split("T")[0],
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateEvent = (updated: Event) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setExpenses(prev => prev.filter(ex => ex.event_id !== eventId));
    setParticipants(prev => prev.filter(p => p.event_id !== eventId));
    setVendors(prev => prev.filter(v => v.event_id !== eventId));
    setPayments(prev => prev.filter(p => p.event_id !== eventId));
  };

  const archiveEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: "archived" as const } : e));
  };

  // Participants Operations
  const addParticipantToEvent = (eventId: string, userId: string) => {
    const exist = participants.find(p => p.event_id === eventId && p.user_id === userId);
    if (exist) return;
    const newPart: Participant = {
      id: `pt-${Math.random().toString(36).substr(2, 9)}`,
      event_id: eventId,
      user_id: userId
    };
    setParticipants(prev => [...prev, newPart]);
  };

  const removeParticipantFromEvent = (eventId: string, userId: string) => {
    setParticipants(prev => prev.filter(p => !(p.event_id === eventId && p.user_id === userId)));
    setPayments(prev => prev.filter(p => !(p.event_id === eventId && p.participant_id === userId)));
  };

  // Expense Operations
  const addExpense = (expenseData: Omit<Expense, "id" | "created_by">) => {
    if (!currentUser) return;
    const newExpense: Expense = {
      ...expenseData,
      id: `ex-${Math.random().toString(36).substr(2, 9)}`,
      created_by: currentUser.id
    };
    
    checkBudgetThresholds(expenseData.event_id, expenseData.amount, expenses, events);
    setExpenses(prev => [newExpense, ...prev]);
  };

  const editExpense = (updated: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    setPayments(prev => prev.filter(p => p.expense_id !== expenseId));
  };

  // Vendor Operations
  const addVendor = (vendorData: Omit<Vendor, "id">) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `v-${Math.random().toString(36).substr(2, 9)}`
    };
    setVendors(prev => [newVendor, ...prev]);
  };

  const editVendor = (updated: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
  };

  const deleteVendor = (vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
  };

  const updateVendorPayment = (vendorId: string, status: "paid" | "pending") => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status } : v));
  };

  // Payments / Cost Split Operations
  const markPaymentStatus = (paymentId: string, status: "paid" | "unpaid") => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p));
  };

  const splitExpense = (expenseId: string, type: "equal" | "percentage" | "custom", splits: { [userId: string]: number }) => {
    const expense = expenses.find(ex => ex.id === expenseId);
    if (!expense) return;

    // Remove older splits associated with this expense
    setPayments(prev => prev.filter(p => p.expense_id !== expenseId));

    const newPayments: Payment[] = Object.keys(splits).map(userId => {
      let shareAmount = 0;
      if (type === "equal") {
        shareAmount = expense.amount / Object.keys(splits).length;
      } else if (type === "percentage") {
        shareAmount = (expense.amount * splits[userId]) / 100;
      } else {
        shareAmount = splits[userId];
      }

      return {
        id: `pay-${Math.random().toString(36).substr(2, 9)}`,
        event_id: expense.event_id,
        participant_id: userId,
        expense_id: expenseId,
        amount: shareAmount,
        status: "unpaid"
      };
    });

    setPayments(prev => [...prev, ...newPayments]);
    
    // Add Alert notification
    const count = Object.keys(splits).length;
    const alertNotif: SystemNotification = {
      id: `n-split-${Date.now()}`,
      title: `Split split configured for ${expense.description}`,
      message: `Calculated shares for ${count} participants. Total split: ${settings.currency}${expense.amount.toLocaleString("en-IN")}.`,
      type: "info",
      created_at: new Date().toISOString().split("T")[0],
      read: false
    };
    setNotifications(prev => [alertNotif, ...prev]);
  };

  // Settings
  const updateSettings = (updated: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  // Notifications helpers
  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // AI assistant seeding
  const seedAISuggestedPlan = (title: string, budget: number, category: any, location: string, planData: any) => {
    if (!currentUser) return;
    
    const eventId = `e-${Math.random().toString(36).substr(2, 9)}`;
    const newEvent: Event = {
      id: eventId,
      title,
      description: `AI-Generated plan: ${title}. Created with automatic category caps.`,
      budget,
      location,
      event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 60 days from now
      category,
      status: "active",
      organizer_id: currentUser.id
    };

    // Add event
    setEvents(prev => [newEvent, ...prev]);

    // Create expenses from categories
    const newExpenses: Expense[] = [];
    const newVendors: Vendor[] = [];

    // Map AI recommendations into actual transactions
    planData.categories.forEach((c: any) => {
      const expenseId = `ex-${Math.random().toString(36).substr(2, 9)}`;
      newExpenses.push({
        id: expenseId,
        event_id: eventId,
        amount: c.amount,
        category: c.name,
        description: `Allocated budget share for ${c.name}`,
        created_by: currentUser.id,
        date: new Date().toISOString().split("T")[0]
      });

      // Create a mock vendor for that category
      newVendors.push({
        id: `v-${Math.random().toString(36).substr(2, 9)}`,
        event_id: eventId,
        vendor_name: `${c.name} Solutions Group`,
        contact: "9999888877",
        email: `info@${c.name.toLowerCase()}-vendors.com`,
        amount: c.amount,
        service_type: c.name === "Food" ? "Catering" : c.name === "Venue" ? "Venue Provider" : c.name === "Decoration" ? "Decoration" : "Photography",
        status: "pending",
        notes: `AI suggested placeholder vendor. Spend target: ${settings.currency}${c.amount}`
      });
    });

    setExpenses(prev => [...newExpenses, ...prev]);
    setVendors(prev => [...newVendors, ...prev]);

    // Auto notification
    const successNotif: SystemNotification = {
      id: `n-${Date.now()}`,
      title: `Plan applied successfully!`,
      message: `Created event "${title}" and seeded ${newExpenses.length} category allocations with corresponding vendor outlines.`,
      type: "success",
      created_at: new Date().toISOString().split("T")[0],
      read: false
    };
    setNotifications(prev => [successNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        events,
        participants,
        expenses,
        vendors,
        payments,
        notifications,
        settings,
        login,
        register,
        logout,
        createEvent,
        updateEvent,
        deleteEvent,
        archiveEvent,
        addParticipantToEvent,
        removeParticipantFromEvent,
        addExpense,
        deleteExpense,
        editExpense,
        addVendor,
        editVendor,
        deleteVendor,
        updateVendorPayment,
        markPaymentStatus,
        splitExpense,
        updateSettings,
        clearNotifications,
        markNotificationRead,
        seedAISuggestedPlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
