"use client";
import { createContext } from "react";
import { createContextualCan } from "@casl/react";
import { AnyAbility, createMongoAbility } from "@casl/ability";

export const AbilityContext = createContext({} as AnyAbility);
export const Can = createContextualCan(AbilityContext.Consumer);

export default function AbilityProvider({
  children,
  rules,
}: Readonly<{ children: React.ReactNode; rules: any }>) {
  const ability = createMongoAbility(rules || []);
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
