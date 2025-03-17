"use client";
import { createContext } from "react";
import { createContextualCan } from "@casl/react";
import { AnyAbility, createMongoAbility } from "@casl/ability";
import { resolveAction, testAbility } from "@/constants/casl";

export const AbilityContext = createContext(
  createMongoAbility(testAbility || [], {
    resolveAction: resolveAction,
  }) as AnyAbility,
);
export const Can = createContextualCan(AbilityContext.Consumer);

export default function AbilityProvider({
  children,
  rules,
}: Readonly<{ children: React.ReactNode; rules: any }>) {
  const ability = createMongoAbility(rules || [], {
    resolveAction: resolveAction,
  });
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
