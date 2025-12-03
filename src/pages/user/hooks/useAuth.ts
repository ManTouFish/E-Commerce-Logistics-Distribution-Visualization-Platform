// src/pages/CustomerPortal/hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface User {
  email?: string;
}

type ToastCallback = (type: "success" | "error" | "info" | "warning", content: string) => void;

export const useAuth = (toastMessage?: ToastCallback) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const showMessage = useCallback(
    (type: "success" | "error" | "info" | "warning", content: string) => {
      if (toastMessage) {
        toastMessage(type, content);
      } else {
        console.log(`[${type}] ${content}`);
      }
    },
    [toastMessage]
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.clear();
      sessionStorage.clear();
      showMessage("success", "已安全退出");
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "退出失败";
      showMessage("error", `退出失败: ${errorMessage}`);
    }
  }, [navigate, showMessage]);

  return { user, handleLogout };
};