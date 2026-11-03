"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-line bg-shell p-6"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await loginAction(formData);
          if (result?.error) {
            setError(result.error);
          } else if (result?.redirect) {
            router.push(result.redirect);
            router.refresh();
          }
        });
      }}
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">Admin sign in</h1>
        <p className="mt-1 text-sm text-stone">
          Sign in with the Supabase auth account linked to an admin user.
        </p>
      </div>

      <label className="block text-sm font-semibold text-navy">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      <label className="block text-sm font-semibold text-navy">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
