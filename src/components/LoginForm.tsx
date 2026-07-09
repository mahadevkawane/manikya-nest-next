"use client";
import { useState } from "react";
import { sessionFromSupabaseUser, setSession, syncSession, type Session } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function LoginForm({ onSuccess }: { onSuccess: (session: Session) => void }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (!cleanPhone || cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const virtualEmail = `phone-${cleanPhone}@findway.temp`;
      const res = await supabase.auth.signInWithPassword({ email: virtualEmail, password });

      if (res.error) {
        setError(res.error.message);
        return;
      }

      if (res.data.user) {
        const session = sessionFromSupabaseUser(res.data.user, { phone: cleanPhone });
        setSession(session);
        // Sync with backend immediately to get the latest database fields (avatarUrl, city, roles)
        try {
          const synced = await syncSession();
          if (synced) {
            onSuccess(synced);
            return;
          }
        } catch (syncErr) {
          console.error("Error syncing session on login:", syncErr);
        }
        onSuccess(session);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[13px] text-muted block mb-1.5 font-medium">
          Mobile number
        </label>
        <div className="flex items-center border border-hairline rounded-[10px] h-14 px-3.5 transition-colors focus-within:border-ink focus-within:border-2">
          <span className="flex items-center gap-1 text-[15px] text-ink pr-2.5 border-r border-hairline shrink-0">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="flex-1 min-w-0 text-base text-ink placeholder-muted outline-none bg-transparent pl-2.5"
          />
        </div>
      </div>

      <div>
        <label className="text-[13px] text-muted block mb-1.5 font-medium">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border border-hairline rounded-[10px] h-14 px-3.5 text-base text-ink placeholder-muted outline-none focus:border-ink focus:border-2 transition-colors"
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full h-12 mt-2 bg-rausch text-white text-base font-medium rounded-[10px] hover:bg-rausch-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-[10px] border border-error/30 bg-error/5 px-3.5 py-3 text-[13px] text-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <p className="leading-snug">{error}</p>
        </div>
      )}
    </div>
  );
}
