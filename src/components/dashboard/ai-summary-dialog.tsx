"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { generateAirQualitySummary } from "@/ai/flows/air-quality-summary";
import type { AirQualitySummaryInput } from "@/ai/flows/air-quality-summary";

export function AiSummaryDialog(props: AirQualitySummaryInput) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError("");
    setSummary("");
    try {
      const result = await generateAirQualitySummary(props);
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => !isOpen && handleGenerateSummary()}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate AI Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Daily Air Quality Summary</DialogTitle>
          <DialogDescription>
            An AI-generated analysis of today's sensor data.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[200px] py-4">
          {isLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing data...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {summary && (
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap">{summary}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
