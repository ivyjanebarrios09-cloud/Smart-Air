"use client";

import { useState, useEffect, useMemo } from "react";
import {
  onSnapshot,
  collection,
  query,
  type Query,
  type DocumentData,
  type CollectionReference,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";

export function useCollection<T extends DocumentData>(
  ref: CollectionReference<T> | Query<T> | string | null
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const collectionQuery = useMemo(() => {
    if (!firestore) return null;
    if (!ref) return null;
    return typeof ref === "string" ? collection(firestore, ref) : ref;
  }, [firestore, ref]);

  useEffect(() => {
    if (!collectionQuery) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      collectionQuery as Query<T>,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ ...(doc.data() as T), id: doc.id });
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionQuery]);

  return { data, loading, error };
}
