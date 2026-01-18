"use client";

import { useMemo } from "react";
import { FirebaseProvider, initializeFirebase } from "@/firebase";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseInstances = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider value={firebaseInstances}>{children}</FirebaseProvider>
  );
}
