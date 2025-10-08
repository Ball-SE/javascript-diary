import React from "react";
import { AuthContext } from "../context/authentication";

/**
 * Custom hook สำหรับใช้งาน AuthContext
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
