"use client";

import { toast } from "sonner";

type ToastIntent = "success" | "error" | "info" | "warning";

type PendingToastPayload = {
  intent: ToastIntent;
  title: string;
  description?: string;
};

const PENDING_TOAST_KEY = "snaphanoi.pending.toast";

function resolveMessage(message: string | null | undefined, fallback: string) {
  if (!message || message.trim().length === 0) {
    return fallback;
  }

  if (message.trim().toLowerCase() === "request successful") {
    return fallback;
  }

  return message;
}

function showToast({ intent, title, description }: PendingToastPayload) {
  if (intent === "success") {
    toast.success(title, { description });
    return;
  }

  if (intent === "error") {
    toast.error(title, { description });
    return;
  }

  if (intent === "warning") {
    toast.warning(title, { description });
    return;
  }

  toast.info(title, { description });
}

export function notifySuccess(message: string | null | undefined, fallback: string, description?: string) {
  showToast({
    intent: "success",
    title: resolveMessage(message, fallback),
    description,
  });
}

export function notifyError(message: string | null | undefined, fallback = "Something went wrong. Please try again.") {
  showToast({
    intent: "error",
    title: resolveMessage(message, fallback),
  });
}

export function notifyInfo(message: string, description?: string) {
  showToast({
    intent: "info",
    title: message,
    description,
  });
}

export function queueNavigationToast(payload: PendingToastPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(payload));
}

export function consumeNavigationToast() {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.sessionStorage.getItem(PENDING_TOAST_KEY);

  if (!raw) {
    return;
  }

  window.sessionStorage.removeItem(PENDING_TOAST_KEY);

  try {
    const payload = JSON.parse(raw) as PendingToastPayload;
    showToast(payload);
  } catch {
    // Ignore malformed persisted toast payload.
  }
}
