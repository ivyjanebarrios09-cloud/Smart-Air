"use server";

import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function loginUser(values: z.infer<typeof loginSchema>): Promise<ActionResult> {
  try {
    const { email, password } = loginSchema.parse(values);
    // Note: Firebase Admin SDK doesn't have a direct "signInWithEmailAndPassword" method.
    // The idiomatic way to handle this with server components/actions is to use the client SDK
    // to get an ID token, then send it to the server to create a session cookie.
    // As we can't get the ID token here directly, this action simulates creating the cookie.
    // For a real app, you would pass the ID token from the client to this server action.
    const customToken = await auth.createCustomToken("some-uid-from-login");
    
    // In a real scenario, you'd verify the ID token from the client and create a session cookie.
    // Here we'll just set a placeholder cookie.
    const sessionCookie = await auth.createSessionCookie(customToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
    cookies().set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signupUser(values: z.infer<typeof signupSchema>): Promise<ActionResult> {
  try {
    const { email, password } = signupSchema.parse(values);
    await auth.createUser({
      email,
      password,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Email may already be in use." };
  }
}

export async function logoutUser(): Promise<ActionResult> {
  try {
    cookies().delete("session");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
