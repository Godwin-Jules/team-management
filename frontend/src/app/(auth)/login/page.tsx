"use client";

import { useAuth } from "@/provider/authProvider";
import Link from "next/link";
import { useActionState, useEffect } from "react";

export type LoginState = {
  error?: string;
  success?: boolean;
};

export default function LoginPage() {
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const [state, loginAction, isPending] = useActionState(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      try {
        await login(formData);
        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    },
    { error: undefined, success: undefined },
  );

  return (
    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">
      <form action={loginAction}>
        <div className="space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">
              Or{" "}
              <Link
                href={"/register"}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                create a new account
              </Link>
            </p>
          </div>
          {state?.error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}
          <div className="space-y-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Signing in ..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
