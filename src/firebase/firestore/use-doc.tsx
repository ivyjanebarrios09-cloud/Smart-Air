"use client";

import { useState, useEffect, useMemo } from "react";
import {
  onSnapshot,
  doc,
  type DocumentReference,
  type DocumentData,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";

export function useDoc<T extends DocumentData>(
  ref: DocumentReference<T> | string
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const docRef = useMemo(() => {
    if (!firestore) return null;
    return typeof ref === "string" ? doc(firestore, ref) : ref;
  }, [firestore, ref]);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      docRef as DocumentReference<T>,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
