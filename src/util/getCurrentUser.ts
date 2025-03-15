import { resolveAction, testAbility } from "@/constants/casl";
import { auth } from "@/server/auth";
import { createMongoAbility, Subject } from "@casl/ability";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user.id;
});

export const getAbility = async () => {
  const session = await auth();
  const rules = (session?.user.rules as never) || [];
  return createMongoAbility(testAbility, {
    resolveAction: resolveAction,
  });
};

export const can = async (
  action: string,
  subject: Subject,
  field?: string | undefined,
) => {
  const ability = await getAbility();
  return ability.can(action, subject, field);
};
