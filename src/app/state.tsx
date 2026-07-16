import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Event, Department, Expense, AuditLog, Notification, Settings } from "./types";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  departments: Department[];
  expenses: Expense[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  settings: Settings;
  
  // Auth
  login: (userIdOrEmail: string, password?: string) => Promise<User>;
  logout: () => void;
  
  // Admin & User Mgmt
  createUser: (userData: Omit<User, "created_at"> & { id?: string }) => void;
  updateUserStatus: (userId: string, status: "active" | "disabled") => void;
  updateUserRole: (userId: string, role: User["role"]) => void;
  
  // Event Mgmt
  createEvent: (eventData: Omit<Event, "id">) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  assignEventManager: (eventId: string, managerId: string) => void;
  
  // Department Mgmt
  createDepartment: (deptData: Omit<Department, "id">) => void;
  updateDepartment: (dept: Department) => void;
  deleteDepartment: (deptId: string) => void;
  assignDepartmentManager: (deptId: string, managerId: string) => void;
  
  // Expense Mgmt
  addExpense: (expenseData: Omit<Expense, "id" | "created_by">) => void;
  updateExpenseStatus: (expenseId: string, status: Expense["status"]) => void;
  deleteExpense: (expenseId: string) => void;
  
  // System
  logAudit: (action: string, details: string) => void;
  markNotificationRead: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const s = localStorage.getItem("ev_current_user");
    return s ? JSON.parse(s) : null;
  });

  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<Settings>({
    currency: "₹",
    language: "en",
    theme: "dark",
    approvalLimit: 10000
  });

  // Initial load from JSON server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes, deptsRes, expsRes, logsRes, notifsRes, settingsRes] = await Promise.all([
          fetch("http://localhost:3001/users"),
          fetch("http://localhost:3001/events"),
          fetch("http://localhost:3001/departments"),
          fetch("http://localhost:3001/expenses"),
          fetch("http://localhost:3001/audit_logs"),
          fetch("http://localhost:3001/notifications"),
          fetch("http://localhost:3001/settings")
        ]);
        
        if (usersRes.ok) setUsers(await usersRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (deptsRes.ok) setDepartments(await deptsRes.json());
        if (expsRes.ok) setExpenses(await expsRes.json());
        if (logsRes.ok) setAuditLogs(await logsRes.json());
        if (notifsRes.ok) setNotifications(await notifsRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
      } catch (err) {
        console.warn("DB fetch failed, relying on local state.");
      }
    };
    fetchData();
  }, []);

  // Validate current user role and session
  useEffect(() => {
    if (currentUser) {
      if (!["Admin", "Event Manager", "Department Manager"].includes(currentUser.role)) {
        setCurrentUser(null);
        localStorage.removeItem("ev_current_user");
      }
    }
  }, [currentUser]);

  // Sync current user to localstorage
  useEffect(() => {
    localStorage.setItem("ev_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const logAudit = (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `al-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      user_id: currentUser.id,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = async (userIdOrEmail: string, password?: string): Promise<User> => {
    const user = users.find(u => u.id === userIdOrEmail || u.email === userIdOrEmail);
    if (!user) throw new Error("User not found.");
    if (user.password !== password) throw new Error("Invalid password.");
    if (user.status === "disabled") throw new Error("Account is disabled. Contact Admin.");
    
    setCurrentUser(user);
    logAudit("User Login", `User ${user.name} logged in successfully.`);
    return user;
  };

  const logout = () => {
    if (currentUser) {
      logAudit("User Logout", `User ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
  };

  // User Management
  const createUser = (userData: Omit<User, "created_at"> & { id?: string }) => {
    const newUser: User = {
      ...userData,
      id: userData.id || `u-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString().split("T")[0]
    };
    setUsers(prev => [...prev, newUser]);
    
    // Attempt to persist if JSON server is running
    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    }).catch(() => {});
    
    logAudit("User Created", `Created user ${newUser.name} with role ${newUser.role}`);
  };

  const updateUserStatus = (userId: string, status: "active" | "disabled") => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    logAudit("User Status Changed", `Changed user ${userId} status to ${status}`);
  };

  const updateUserRole = (userId: string, role: User["role"]) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    logAudit("User Role Updated", `Changed user ${userId} role to ${role}`);
  };

  // Event Management
  const createEvent = (eventData: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...eventData,
      id: `e-${Math.random().toString(36).substr(2, 9)}`
    };
    setEvents(prev => [...prev, newEvent]);
    
    fetch("http://localhost:3001/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    }).catch(() => {});
    
    logAudit("Event Created", `Created event ${newEvent.title} with budget ${newEvent.budget}`);
  };

  const updateEvent = (updated: Event) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    logAudit("Event Updated", `Updated details for event ${updated.id}`);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    logAudit("Event Deleted", `Deleted event ${eventId}`);
  };

  const assignEventManager = (eventId: string, managerId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, event_manager_id: managerId } : e));
    logAudit("Event Manager Assigned", `Assigned user ${managerId} to event ${eventId}`);
    
    // Notify user
    const n: Notification = {
      id: `n-${Date.now()}`,
      user_id: managerId,
      message: "You have been assigned as Event Manager.",
      type: "info",
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [n, ...prev]);
  };

  // Department Management
  const createDepartment = (deptData: Omit<Department, "id">) => {
    const newDept: Department = {
      ...deptData,
      id: `d-${Math.random().toString(36).substr(2, 9)}`
    };
    setDepartments(prev => [...prev, newDept]);
    
    fetch("http://localhost:3001/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDept)
    }).catch(() => {});

    logAudit("Department Created", `Created department ${newDept.name} in event ${newDept.event_id}`);
  };

  const updateDepartment = (dept: Department) => {
    setDepartments(prev => prev.map(d => d.id === dept.id ? dept : d));
    logAudit("Department Updated", `Updated department ${dept.id} budget to ${dept.budget}`);
  };

  const deleteDepartment = (deptId: string) => {
    setDepartments(prev => prev.filter(d => d.id !== deptId));
    logAudit("Department Deleted", `Deleted department ${deptId}`);
  };

  const assignDepartmentManager = (deptId: string, managerId: string) => {
    setDepartments(prev => prev.map(d => d.id === deptId ? { ...d, manager_id: managerId } : d));
    logAudit("Department Manager Assigned", `Assigned user ${managerId} to dept ${deptId}`);
    
    // Notify user
    const n: Notification = {
      id: `n-${Date.now()}`,
      user_id: managerId,
      message: "You have been assigned as Department Manager.",
      type: "info",
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [n, ...prev]);
  };

  // Expense Management
  const addExpense = (expenseData: Omit<Expense, "id" | "created_by">) => {
    if (!currentUser) return;
    const newExpense: Expense = {
      ...expenseData,
      id: `ex-${Math.random().toString(36).substr(2, 9)}`,
      created_by: currentUser.id
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit("Expense Added", `Expense ${newExpense.id} created as ${newExpense.status}`);
  };

  const updateExpenseStatus = (expenseId: string, status: Expense["status"]) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, status } : e));
    logAudit("Expense Status Changed", `Expense ${expenseId} status changed to ${status}`);
    
    // Check if we need to notify dept manager
    const ex = expenses.find(e => e.id === expenseId);
    if (ex && status === "Approved") {
      const n: Notification = {
        id: `n-${Date.now()}`,
        user_id: ex.created_by,
        message: `Your expense "${ex.description}" was approved.`,
        type: "success",
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [n, ...prev]);
    }
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    logAudit("Expense Deleted", `Deleted expense ${expenseId}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateSettings = (s: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, events, departments, expenses, auditLogs, notifications, settings,
      login, logout,
      createUser, updateUserStatus, updateUserRole,
      createEvent, updateEvent, deleteEvent, assignEventManager,
      createDepartment, updateDepartment, deleteDepartment, assignDepartmentManager,
      addExpense, updateExpenseStatus, deleteExpense,
      logAudit, markNotificationRead, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
