"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "farmer" | "agronomist" | "admin";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userId: string | null;
  fullName: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  smsNotificationsEnabled: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ 
  children,
  initialRole = "farmer",
  userId = null,
  initialFullName = "User",
  initialAvatarUrl = null,
  initialPhoneNumber = null,
  initialSmsEnabled = true
}: { 
  children: React.ReactNode;
  initialRole?: UserRole;
  userId?: string | null;
  initialFullName?: string;
  initialAvatarUrl?: string | null;
  initialPhoneNumber?: string | null;
  initialSmsEnabled?: boolean;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState<string>(initialFullName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(initialPhoneNumber);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState<boolean>(initialSmsEnabled);

  useEffect(() => {
    setRole(initialRole);
    setFullName(initialFullName);
    setAvatarUrl(initialAvatarUrl);
    setPhoneNumber(initialPhoneNumber);
    setSmsNotificationsEnabled(initialSmsEnabled);
  }, [initialRole, initialFullName, initialAvatarUrl, initialPhoneNumber, initialSmsEnabled]);

  return (
    <RoleContext.Provider value={{ 
      role, setRole, userId, fullName, avatarUrl, 
      phoneNumber, smsNotificationsEnabled 
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
