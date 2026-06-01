"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CookOverview from "@/components/cook/CookOverview";
import PrepChecklist from "@/components/cook/PrepChecklist";
import CookStepRunner from "@/components/cook/CookStepRunner";
import CookDone from "@/components/cook/CookDone";
import type { RecipeWithDetails } from "@/lib/types";
import { fetchRecipeById } from "@/lib/fuel-actions";

type CookStage =
  | "loading"
  | "error"
  | "no-steps"
  | "overview"
  | "prep"
  | "cooking"
  | "done";

export default function CookPage() {
  const params = useParams();
  const recipeId = params.recipeId as string;

  const [recipe, setRecipe] = useState<RecipeWithDetails | null>(null);
  const [stage, setStage] = useState<CookStage>("loading");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRecipeById(recipeId);
        if (!data) {
          setStage("error");
          return;
        }
        setRecipe(data);
        if (data.recipe_steps.length === 0) {
          setStage("no-steps");
          return;
        }
        setStage("overview");
      } catch {
        setStage("error");
      }
    })();
  }, [recipeId]);

  const restart = () => {
    setStepIndex(0);
    setStage("overview");
  };

  if (stage === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
      </div>
    );
  }

  if (stage === "error" || !recipe) {
    return (
      <div className="min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          <PageHeader
            title="Cook Recipe"
            section="fuel"
            showBack
            backHref="/fuel"
            backLabel="Back to Fuel"
          />
          <div className="nisu-card p-10 text-center">
            <p className="font-bold text-gray-900 mb-2">Recipe not found</p>
            <Link href="/fuel" className="inline-block mt-3 nisu-cta-bold text-sm px-6 py-2.5">
              Back to Fuel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "no-steps") {
    return (
      <div className="min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          <PageHeader title={recipe.name} section="fuel" showBack backHref="/fuel" backLabel="Back to Fuel" />
          <div className="nisu-card p-10 text-center">
            <p className="font-bold text-gray-900 mb-1">No steps yet</p>
            <p className="text-sm nisu-text-muted mb-4">Add cooking steps before you start.</p>
            <Link href="/fuel" className="text-sm font-bold text-[var(--nisu-coral)]">
              Back to Fuel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-6">
        <PageHeader
          title={recipe.name}
          section="fuel"
          subtitle={
            stage === "cooking"
              ? `Step ${stepIndex + 1} of ${recipe.recipe_steps.length}`
              : stage === "done"
              ? "Complete"
              : undefined
          }
          showBack
          backHref="/fuel"
          backLabel="Back to Fuel"
        />

        {stage === "overview" && (
          <CookOverview recipe={recipe} onStart={() => setStage("prep")} />
        )}

        {stage === "prep" && (
          <PrepChecklist
            recipe={recipe}
            onBack={() => setStage("overview")}
            onContinue={() => {
              setStepIndex(0);
              setStage("cooking");
            }}
          />
        )}

        {stage === "cooking" && (
          <CookStepRunner
            steps={recipe.recipe_steps}
            currentIndex={stepIndex}
            onBack={() => setStepIndex((i) => Math.max(0, i - 1))}
            onNext={() => {
              if (stepIndex < recipe.recipe_steps.length - 1) {
                setStepIndex((i) => i + 1);
              } else {
                setStage("done");
              }
            }}
          />
        )}

        {stage === "done" && (
          <CookDone recipe={recipe} onCookAgain={restart} />
        )}
      </div>
    </div>
  );
}
