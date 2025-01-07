import { z } from "zod";
import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput =
  | Prisma.JsonValue
  | null
  | "JsonNull"
  | "DbNull"
  | Prisma.NullTypes.DbNull
  | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === "DbNull") return Prisma.DbNull;
  if (v === "JsonNull") return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ]),
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal("DbNull"), z.literal("JsonNull")])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(
  () =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
      z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
      z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    ]),
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
});

export const DECIMAL_STRING_REGEX =
  /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput = (
  v?: null | string | number | Prisma.DecimalJsLike,
): v is string | number | Prisma.DecimalJsLike => {
  if (v === undefined || v === null) return false;
  return (
    (typeof v === "object" &&
      "d" in v &&
      "e" in v &&
      "s" in v &&
      "toFixed" in v) ||
    (typeof v === "string" && DECIMAL_STRING_REGEX.test(v)) ||
    typeof v === "number"
  );
};

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
]);

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "email",
  "emailVerified",
  "image",
  "hashPassword",
  "createdAt",
  "updatedAt",
]);

export const AccountScalarFieldEnumSchema = z.enum([
  "userId",
  "type",
  "provider",
  "providerAccountId",
  "refresh_token",
  "access_token",
  "expires_at",
  "token_type",
  "scope",
  "id_token",
  "session_state",
  "createdAt",
  "updatedAt",
]);

export const SessionScalarFieldEnumSchema = z.enum([
  "sessionToken",
  "userId",
  "expires",
  "createdAt",
  "updatedAt",
]);

export const VerificationTokenScalarFieldEnumSchema = z.enum([
  "identifier",
  "token",
  "expires",
]);

export const AuthenticatorScalarFieldEnumSchema = z.enum([
  "credentialID",
  "userId",
  "providerAccountId",
  "credentialPublicKey",
  "counter",
  "credentialDeviceType",
  "credentialBackedUp",
  "transports",
]);

export const LanguageScalarFieldEnumSchema = z.enum([
  "languageId",
  "languageName",
  "version",
  "sourceFileExt",
  "binaryFileExt",
  "compileCommand",
  "runCommand",
  "isActive",
  "canDelete",
  "monacoCodeLanguage",
  "templateCode",
]);

export const ProblemScalarFieldEnumSchema = z.enum([
  "problemId",
  "title",
  "description",
  "problemStatement",
  "difficultyLevel",
  "timeLimit",
  "memoryLimit",
  "isPublic",
  "totalSubmissions",
  "acceptedSubmissions",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "createdBy",
  "updatedBy",
  "deletedBy",
]);

export const ProblemLanguageScalarFieldEnumSchema = z.enum([
  "problemId",
  "languageId",
  "templateCode",
  "timeLimit",
  "memoryLimit",
]);

export const ProblemTagScalarFieldEnumSchema = z.enum(["problemId", "tagId"]);

export const SubmissionScalarFieldEnumSchema = z.enum([
  "submissionId",
  "userId",
  "problemId",
  "languageId",
  "code",
  "status",
  "timeExecution",
  "memoryUsage",
  "submissionTime",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "createdBy",
  "updatedBy",
  "deletedBy",
]);

export const SubmissionTestcaseScalarFieldEnumSchema = z.enum([
  "submissionId",
  "testcaseId",
  "status",
  "stdout",
  "problemId",
  "runtime",
  "memoryUsed",
]);

export const TagScalarFieldEnumSchema = z.enum([
  "tagId",
  "tagName",
  "description",
  "createdAt",
  "createdBy",
]);

export const TestcaseScalarFieldEnumSchema = z.enum([
  "testCaseId",
  "problemId",
  "inputData",
  "expectedOutput",
  "isSample",
  "points",
  "label",
  "explanation",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "createdBy",
  "updatedBy",
  "deletedBy",
]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const NullableJsonNullValueInputSchema = z
  .enum(["DbNull", "JsonNull"])
  .transform((value) =>
    value === "JsonNull"
      ? Prisma.JsonNull
      : value === "DbNull"
        ? Prisma.DbNull
        : value,
  );

export const JsonNullValueInputSchema = z
  .enum(["JsonNull"])
  .transform((value) => (value === "JsonNull" ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export const NullsOrderSchema = z.enum(["first", "last"]);

export const JsonNullValueFilterSchema = z
  .enum(["DbNull", "JsonNull", "AnyNull"])
  .transform((value) =>
    value === "JsonNull"
      ? Prisma.JsonNull
      : value === "DbNull"
        ? Prisma.JsonNull
        : value === "AnyNull"
          ? Prisma.AnyNull
          : value,
  );
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  hashPassword: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Account = z.infer<typeof AccountSchema>;

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
});

export type VerificationToken = z.infer<typeof VerificationTokenSchema>;

/////////////////////////////////////////
// AUTHENTICATOR SCHEMA
/////////////////////////////////////////

export const AuthenticatorSchema = z.object({
  credentialID: z.string(),
  userId: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().nullable(),
});

export type Authenticator = z.infer<typeof AuthenticatorSchema>;

/////////////////////////////////////////
// LANGUAGE SCHEMA
/////////////////////////////////////////

export const LanguageSchema = z.object({
  languageId: z.number().int(),
  languageName: z.string(),
  version: z.string(),
  sourceFileExt: z.string(),
  binaryFileExt: z.string().nullable(),
  compileCommand: z.string().nullable(),
  runCommand: z.string(),
  isActive: z.boolean(),
  canDelete: z.boolean(),
  monacoCodeLanguage: z.string().nullable(),
  templateCode: z.string(),
});

export type Language = z.infer<typeof LanguageSchema>;

/////////////////////////////////////////
// PROBLEM SCHEMA
/////////////////////////////////////////

export const ProblemSchema = z.object({
  problemId: z.string(),
  title: z.string(),
  description: JsonValueSchema.nullable(),
  problemStatement: JsonValueSchema,
  difficultyLevel: z.number().int(),
  timeLimit: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'timeLimit' must be a Decimal. Location: ['Models', 'Problem']",
  }),
  memoryLimit: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'memoryLimit' must be a Decimal. Location: ['Models', 'Problem']",
  }),
  isPublic: z.boolean(),
  totalSubmissions: z.number().int(),
  acceptedSubmissions: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export type Problem = z.infer<typeof ProblemSchema>;

/////////////////////////////////////////
// PROBLEM LANGUAGE SCHEMA
/////////////////////////////////////////

export const ProblemLanguageSchema = z.object({
  problemId: z.string(),
  languageId: z.number().int(),
  templateCode: z.string().nullable(),
  timeLimit: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'timeLimit' must be a Decimal. Location: ['Models', 'ProblemLanguage']",
  }),
  memoryLimit: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'memoryLimit' must be a Decimal. Location: ['Models', 'ProblemLanguage']",
  }),
});

export type ProblemLanguage = z.infer<typeof ProblemLanguageSchema>;

/////////////////////////////////////////
// PROBLEM TAG SCHEMA
/////////////////////////////////////////

export const ProblemTagSchema = z.object({
  problemId: z.string(),
  tagId: z.string(),
});

export type ProblemTag = z.infer<typeof ProblemTagSchema>;

/////////////////////////////////////////
// SUBMISSION SCHEMA
/////////////////////////////////////////

export const SubmissionSchema = z.object({
  submissionId: z.string(),
  userId: z.string(),
  problemId: z.string(),
  languageId: z.number().int(),
  code: z.string(),
  status: z.string(),
  timeExecution: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'timeExecution' must be a Decimal. Location: ['Models', 'Submission']",
  }),
  memoryUsage: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'memoryUsage' must be a Decimal. Location: ['Models', 'Submission']",
  }),
  submissionTime: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

/////////////////////////////////////////
// SUBMISSION TESTCASE SCHEMA
/////////////////////////////////////////

export const SubmissionTestcaseSchema = z.object({
  submissionId: z.string(),
  testcaseId: z.string(),
  status: z.string(),
  stdout: z.string().nullable(),
  problemId: z.string(),
  runtime: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'runtime' must be a Decimal. Location: ['Models', 'SubmissionTestcase']",
  }),
  memoryUsed: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'memoryUsed' must be a Decimal. Location: ['Models', 'SubmissionTestcase']",
  }),
});

export type SubmissionTestcase = z.infer<typeof SubmissionTestcaseSchema>;

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  tagId: z.string(),
  tagName: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  createdBy: z.string().nullable(),
});

export type Tag = z.infer<typeof TagSchema>;

/////////////////////////////////////////
// TESTCASE SCHEMA
/////////////////////////////////////////

export const TestcaseSchema = z.object({
  testCaseId: z.string(),
  problemId: z.string(),
  inputData: z.string(),
  expectedOutput: z.string(),
  isSample: z.boolean(),
  points: z.number().int(),
  label: z.string().nullable(),
  explanation: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export type Testcase = z.infer<typeof TestcaseSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z
  .object({
    accounts: z
      .union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)])
      .optional(),
    sessions: z
      .union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)])
      .optional(),
    Authenticator: z
      .union([z.boolean(), z.lazy(() => AuthenticatorFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z
  .object({
    select: z.lazy(() => UserSelectSchema).optional(),
    include: z.lazy(() => UserIncludeSchema).optional(),
  })
  .strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> =
  z
    .object({
      accounts: z.boolean().optional(),
      sessions: z.boolean().optional(),
      Authenticator: z.boolean().optional(),
    })
    .strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    image: z.boolean().optional(),
    hashPassword: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    accounts: z
      .union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)])
      .optional(),
    sessions: z
      .union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)])
      .optional(),
    Authenticator: z
      .union([z.boolean(), z.lazy(() => AuthenticatorFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z
  .object({
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict();

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z
  .object({
    select: z.lazy(() => AccountSelectSchema).optional(),
    include: z.lazy(() => AccountIncludeSchema).optional(),
  })
  .strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z
  .object({
    userId: z.boolean().optional(),
    type: z.boolean().optional(),
    provider: z.boolean().optional(),
    providerAccountId: z.boolean().optional(),
    refresh_token: z.boolean().optional(),
    access_token: z.boolean().optional(),
    expires_at: z.boolean().optional(),
    token_type: z.boolean().optional(),
    scope: z.boolean().optional(),
    id_token: z.boolean().optional(),
    session_state: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict();

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z
  .object({
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict();

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z
  .object({
    select: z.lazy(() => SessionSelectSchema).optional(),
    include: z.lazy(() => SessionIncludeSchema).optional(),
  })
  .strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z
  .object({
    sessionToken: z.boolean().optional(),
    userId: z.boolean().optional(),
    expires: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict();

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> =
  z
    .object({
      identifier: z.boolean().optional(),
      token: z.boolean().optional(),
      expires: z.boolean().optional(),
    })
    .strict();

// AUTHENTICATOR
//------------------------------------------------------

export const AuthenticatorIncludeSchema: z.ZodType<Prisma.AuthenticatorInclude> =
  z
    .object({
      user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    })
    .strict();

export const AuthenticatorArgsSchema: z.ZodType<Prisma.AuthenticatorDefaultArgs> =
  z
    .object({
      select: z.lazy(() => AuthenticatorSelectSchema).optional(),
      include: z.lazy(() => AuthenticatorIncludeSchema).optional(),
    })
    .strict();

export const AuthenticatorSelectSchema: z.ZodType<Prisma.AuthenticatorSelect> =
  z
    .object({
      credentialID: z.boolean().optional(),
      userId: z.boolean().optional(),
      providerAccountId: z.boolean().optional(),
      credentialPublicKey: z.boolean().optional(),
      counter: z.boolean().optional(),
      credentialDeviceType: z.boolean().optional(),
      credentialBackedUp: z.boolean().optional(),
      transports: z.boolean().optional(),
      user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    })
    .strict();

// LANGUAGE
//------------------------------------------------------

export const LanguageIncludeSchema: z.ZodType<Prisma.LanguageInclude> = z
  .object({
    problemLanguages: z
      .union([z.boolean(), z.lazy(() => ProblemLanguageFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => LanguageCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const LanguageArgsSchema: z.ZodType<Prisma.LanguageDefaultArgs> = z
  .object({
    select: z.lazy(() => LanguageSelectSchema).optional(),
    include: z.lazy(() => LanguageIncludeSchema).optional(),
  })
  .strict();

export const LanguageCountOutputTypeArgsSchema: z.ZodType<Prisma.LanguageCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => LanguageCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const LanguageCountOutputTypeSelectSchema: z.ZodType<Prisma.LanguageCountOutputTypeSelect> =
  z
    .object({
      problemLanguages: z.boolean().optional(),
    })
    .strict();

export const LanguageSelectSchema: z.ZodType<Prisma.LanguageSelect> = z
  .object({
    languageId: z.boolean().optional(),
    languageName: z.boolean().optional(),
    version: z.boolean().optional(),
    sourceFileExt: z.boolean().optional(),
    binaryFileExt: z.boolean().optional(),
    compileCommand: z.boolean().optional(),
    runCommand: z.boolean().optional(),
    isActive: z.boolean().optional(),
    canDelete: z.boolean().optional(),
    monacoCodeLanguage: z.boolean().optional(),
    templateCode: z.boolean().optional(),
    problemLanguages: z
      .union([z.boolean(), z.lazy(() => ProblemLanguageFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => LanguageCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// PROBLEM
//------------------------------------------------------

export const ProblemIncludeSchema: z.ZodType<Prisma.ProblemInclude> = z
  .object({
    problemLanguages: z
      .union([z.boolean(), z.lazy(() => ProblemLanguageFindManyArgsSchema)])
      .optional(),
    problemTags: z
      .union([z.boolean(), z.lazy(() => ProblemTagFindManyArgsSchema)])
      .optional(),
    submissions: z
      .union([z.boolean(), z.lazy(() => SubmissionFindManyArgsSchema)])
      .optional(),
    submissionTestcases: z
      .union([z.boolean(), z.lazy(() => SubmissionTestcaseFindManyArgsSchema)])
      .optional(),
    testcases: z
      .union([z.boolean(), z.lazy(() => TestcaseFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => ProblemCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const ProblemArgsSchema: z.ZodType<Prisma.ProblemDefaultArgs> = z
  .object({
    select: z.lazy(() => ProblemSelectSchema).optional(),
    include: z.lazy(() => ProblemIncludeSchema).optional(),
  })
  .strict();

export const ProblemCountOutputTypeArgsSchema: z.ZodType<Prisma.ProblemCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => ProblemCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const ProblemCountOutputTypeSelectSchema: z.ZodType<Prisma.ProblemCountOutputTypeSelect> =
  z
    .object({
      problemLanguages: z.boolean().optional(),
      problemTags: z.boolean().optional(),
      submissions: z.boolean().optional(),
      submissionTestcases: z.boolean().optional(),
      testcases: z.boolean().optional(),
    })
    .strict();

export const ProblemSelectSchema: z.ZodType<Prisma.ProblemSelect> = z
  .object({
    problemId: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    problemStatement: z.boolean().optional(),
    difficultyLevel: z.boolean().optional(),
    timeLimit: z.boolean().optional(),
    memoryLimit: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    totalSubmissions: z.boolean().optional(),
    acceptedSubmissions: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    deletedAt: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    updatedBy: z.boolean().optional(),
    deletedBy: z.boolean().optional(),
    problemLanguages: z
      .union([z.boolean(), z.lazy(() => ProblemLanguageFindManyArgsSchema)])
      .optional(),
    problemTags: z
      .union([z.boolean(), z.lazy(() => ProblemTagFindManyArgsSchema)])
      .optional(),
    submissions: z
      .union([z.boolean(), z.lazy(() => SubmissionFindManyArgsSchema)])
      .optional(),
    submissionTestcases: z
      .union([z.boolean(), z.lazy(() => SubmissionTestcaseFindManyArgsSchema)])
      .optional(),
    testcases: z
      .union([z.boolean(), z.lazy(() => TestcaseFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => ProblemCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// PROBLEM LANGUAGE
//------------------------------------------------------

export const ProblemLanguageIncludeSchema: z.ZodType<Prisma.ProblemLanguageInclude> =
  z
    .object({
      language: z
        .union([z.boolean(), z.lazy(() => LanguageArgsSchema)])
        .optional(),
      problem: z
        .union([z.boolean(), z.lazy(() => ProblemArgsSchema)])
        .optional(),
    })
    .strict();

export const ProblemLanguageArgsSchema: z.ZodType<Prisma.ProblemLanguageDefaultArgs> =
  z
    .object({
      select: z.lazy(() => ProblemLanguageSelectSchema).optional(),
      include: z.lazy(() => ProblemLanguageIncludeSchema).optional(),
    })
    .strict();

export const ProblemLanguageSelectSchema: z.ZodType<Prisma.ProblemLanguageSelect> =
  z
    .object({
      problemId: z.boolean().optional(),
      languageId: z.boolean().optional(),
      templateCode: z.boolean().optional(),
      timeLimit: z.boolean().optional(),
      memoryLimit: z.boolean().optional(),
      language: z
        .union([z.boolean(), z.lazy(() => LanguageArgsSchema)])
        .optional(),
      problem: z
        .union([z.boolean(), z.lazy(() => ProblemArgsSchema)])
        .optional(),
    })
    .strict();

// PROBLEM TAG
//------------------------------------------------------

export const ProblemTagIncludeSchema: z.ZodType<Prisma.ProblemTagInclude> = z
  .object({
    problem: z.union([z.boolean(), z.lazy(() => ProblemArgsSchema)]).optional(),
    tag: z.union([z.boolean(), z.lazy(() => TagArgsSchema)]).optional(),
  })
  .strict();

export const ProblemTagArgsSchema: z.ZodType<Prisma.ProblemTagDefaultArgs> = z
  .object({
    select: z.lazy(() => ProblemTagSelectSchema).optional(),
    include: z.lazy(() => ProblemTagIncludeSchema).optional(),
  })
  .strict();

export const ProblemTagSelectSchema: z.ZodType<Prisma.ProblemTagSelect> = z
  .object({
    problemId: z.boolean().optional(),
    tagId: z.boolean().optional(),
    problem: z.union([z.boolean(), z.lazy(() => ProblemArgsSchema)]).optional(),
    tag: z.union([z.boolean(), z.lazy(() => TagArgsSchema)]).optional(),
  })
  .strict();

// SUBMISSION
//------------------------------------------------------

export const SubmissionIncludeSchema: z.ZodType<Prisma.SubmissionInclude> = z
  .object({
    problem: z.union([z.boolean(), z.lazy(() => ProblemArgsSchema)]).optional(),
    submissionTestcases: z
      .union([z.boolean(), z.lazy(() => SubmissionTestcaseFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => SubmissionCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const SubmissionArgsSchema: z.ZodType<Prisma.SubmissionDefaultArgs> = z
  .object({
    select: z.lazy(() => SubmissionSelectSchema).optional(),
    include: z.lazy(() => SubmissionIncludeSchema).optional(),
  })
  .strict();

export const SubmissionCountOutputTypeArgsSchema: z.ZodType<Prisma.SubmissionCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => SubmissionCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const SubmissionCountOutputTypeSelectSchema: z.ZodType<Prisma.SubmissionCountOutputTypeSelect> =
  z
    .object({
      submissionTestcases: z.boolean().optional(),
    })
    .strict();

export const SubmissionSelectSchema: z.ZodType<Prisma.SubmissionSelect> = z
  .object({
    submissionId: z.boolean().optional(),
    userId: z.boolean().optional(),
    problemId: z.boolean().optional(),
    languageId: z.boolean().optional(),
    code: z.boolean().optional(),
    status: z.boolean().optional(),
    timeExecution: z.boolean().optional(),
    memoryUsage: z.boolean().optional(),
    submissionTime: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    deletedAt: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    updatedBy: z.boolean().optional(),
    deletedBy: z.boolean().optional(),
    problem: z.union([z.boolean(), z.lazy(() => ProblemArgsSchema)]).optional(),
    submissionTestcases: z
      .union([z.boolean(), z.lazy(() => SubmissionTestcaseFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => SubmissionCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// SUBMISSION TESTCASE
//------------------------------------------------------

export const SubmissionTestcaseIncludeSchema: z.ZodType<Prisma.SubmissionTestcaseInclude> =
  z
    .object({
      problem: z
        .union([z.boolean(), z.lazy(() => ProblemArgsSchema)])
        .optional(),
      submission: z
        .union([z.boolean(), z.lazy(() => SubmissionArgsSchema)])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseArgsSchema: z.ZodType<Prisma.SubmissionTestcaseDefaultArgs> =
  z
    .object({
      select: z.lazy(() => SubmissionTestcaseSelectSchema).optional(),
      include: z.lazy(() => SubmissionTestcaseIncludeSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseSelectSchema: z.ZodType<Prisma.SubmissionTestcaseSelect> =
  z
    .object({
      submissionId: z.boolean().optional(),
      testcaseId: z.boolean().optional(),
      status: z.boolean().optional(),
      stdout: z.boolean().optional(),
      problemId: z.boolean().optional(),
      runtime: z.boolean().optional(),
      memoryUsed: z.boolean().optional(),
      problem: z
        .union([z.boolean(), z.lazy(() => ProblemArgsSchema)])
        .optional(),
      submission: z
        .union([z.boolean(), z.lazy(() => SubmissionArgsSchema)])
        .optional(),
    })
    .strict();

// TAG
//------------------------------------------------------

export const TagIncludeSchema: z.ZodType<Prisma.TagInclude> = z
  .object({
    problemTags: z
      .union([z.boolean(), z.lazy(() => ProblemTagFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => TagCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const TagArgsSchema: z.ZodType<Prisma.TagDefaultArgs> = z
  .object({
    select: z.lazy(() => TagSelectSchema).optional(),
    include: z.lazy(() => TagIncludeSchema).optional(),
  })
  .strict();

export const TagCountOutputTypeArgsSchema: z.ZodType<Prisma.TagCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => TagCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const TagCountOutputTypeSelectSchema: z.ZodType<Prisma.TagCountOutputTypeSelect> =
  z
    .object({
      problemTags: z.boolean().optional(),
    })
    .strict();

export const TagSelectSchema: z.ZodType<Prisma.TagSelect> = z
  .object({
    tagId: z.boolean().optional(),
    tagName: z.boolean().optional(),
    description: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    problemTags: z
      .union([z.boolean(), z.lazy(() => ProblemTagFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => TagCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// TESTCASE
//------------------------------------------------------

export const TestcaseIncludeSchema: z.ZodType<Prisma.TestcaseInclude> = z
  .object({
    problem: z.union([z.boolean(), z.lazy(() => ProblemArgsSchema)]).optional(),
  })
  .strict();

export const TestcaseArgsSchema: z.ZodType<Prisma.TestcaseDefaultArgs> = z
  .object({
    select: z.lazy(() => TestcaseSelectSchema).optional(),
    include: z.lazy(() => TestcaseIncludeSchema).optional(),
  })
  .strict();

export const TestcaseSelectSchema: z.ZodType<Prisma.TestcaseSelect> = z
  .object({
    testCaseId: z.boolean().optional(),
    problemId: z.boolean().optional(),
    inputData: z.boolean().optional(),
    expectedOutput: z.boolean().optional(),
    isSample: z.boolean().optional(),
    points: z.boolean().optional(),
    label: z.boolean().optional(),
    explanation: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    deletedAt: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    updatedBy: z.boolean().optional(),
    deletedBy: z.boolean().optional(),
    problem: z.union([z.boolean(), z.lazy(() => ProblemArgsSchema)]).optional(),
  })
  .strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => UserWhereInputSchema),
        z.lazy(() => UserWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => UserWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => UserWhereInputSchema),
        z.lazy(() => UserWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    email: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    emailVerified: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    image: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    hashPassword: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
    sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
    Authenticator: z
      .lazy(() => AuthenticatorListRelationFilterSchema)
      .optional(),
  })
  .strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      emailVerified: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      image: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      hashPassword: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      accounts: z
        .lazy(() => AccountOrderByRelationAggregateInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionOrderByRelationAggregateInputSchema)
        .optional(),
      Authenticator: z
        .lazy(() => AuthenticatorOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> =
  z
    .union([
      z.object({
        id: z.string().cuid(),
        email: z.string(),
      }),
      z.object({
        id: z.string().cuid(),
      }),
      z.object({
        email: z.string(),
      }),
    ])
    .and(
      z
        .object({
          id: z.string().cuid().optional(),
          email: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => UserWhereInputSchema),
              z.lazy(() => UserWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => UserWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => UserWhereInputSchema),
              z.lazy(() => UserWhereInputSchema).array(),
            ])
            .optional(),
          name: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          emailVerified: z
            .union([
              z.lazy(() => DateTimeNullableFilterSchema),
              z.coerce.date(),
            ])
            .optional()
            .nullable(),
          image: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          hashPassword: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
          sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
          Authenticator: z
            .lazy(() => AuthenticatorListRelationFilterSchema)
            .optional(),
        })
        .strict(),
    );

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      emailVerified: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      image: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      hashPassword: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => UserScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      name: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      email: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      emailVerified: z
        .union([
          z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => AccountWhereInputSchema),
        z.lazy(() => AccountWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => AccountWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => AccountWhereInputSchema),
        z.lazy(() => AccountWhereInputSchema).array(),
      ])
      .optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    provider: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    providerAccountId: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    refresh_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    access_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    expires_at: z
      .union([z.lazy(() => IntNullableFilterSchema), z.number()])
      .optional()
      .nullable(),
    token_type: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    scope: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    id_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    session_state: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    user: z
      .union([
        z.lazy(() => UserScalarRelationFilterSchema),
        z.lazy(() => UserWhereInputSchema),
      ])
      .optional(),
  })
  .strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> =
  z
    .object({
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      access_token: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      expires_at: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      token_type: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      scope: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      id_token: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      session_state: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    })
    .strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> =
  z
    .object({
      provider_providerAccountId: z.lazy(
        () => AccountProviderProviderAccountIdCompoundUniqueInputSchema,
      ),
    })
    .and(
      z
        .object({
          provider_providerAccountId: z
            .lazy(
              () => AccountProviderProviderAccountIdCompoundUniqueInputSchema,
            )
            .optional(),
          AND: z
            .union([
              z.lazy(() => AccountWhereInputSchema),
              z.lazy(() => AccountWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => AccountWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => AccountWhereInputSchema),
              z.lazy(() => AccountWhereInputSchema).array(),
            ])
            .optional(),
          userId: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          type: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          provider: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          providerAccountId: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          refresh_token: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          access_token: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          expires_at: z
            .union([z.lazy(() => IntNullableFilterSchema), z.number().int()])
            .optional()
            .nullable(),
          token_type: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          scope: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          id_token: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          session_state: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          user: z
            .union([
              z.lazy(() => UserScalarRelationFilterSchema),
              z.lazy(() => UserWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> =
  z
    .object({
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      access_token: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      expires_at: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      token_type: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      scope: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      id_token: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      session_state: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AccountScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      userId: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      type: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      provider: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      providerAccountId: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      refresh_token: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.lazy(() => IntNullableWithAggregatesFilterSchema),
          z.number(),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => SessionWhereInputSchema),
        z.lazy(() => SessionWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => SessionWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => SessionWhereInputSchema),
        z.lazy(() => SessionWhereInputSchema).array(),
      ])
      .optional(),
    sessionToken: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    expires: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    user: z
      .union([
        z.lazy(() => UserScalarRelationFilterSchema),
        z.lazy(() => UserWhereInputSchema),
      ])
      .optional(),
  })
  .strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> =
  z
    .object({
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    })
    .strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> =
  z
    .object({
      sessionToken: z.string(),
    })
    .and(
      z
        .object({
          sessionToken: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => SessionWhereInputSchema),
              z.lazy(() => SessionWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => SessionWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => SessionWhereInputSchema),
              z.lazy(() => SessionWhereInputSchema).array(),
            ])
            .optional(),
          userId: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          expires: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          user: z
            .union([
              z.lazy(() => UserScalarRelationFilterSchema),
              z.lazy(() => UserWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> =
  z
    .object({
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SessionScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      sessionToken: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      userId: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      expires: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => VerificationTokenWhereInputSchema),
          z.lazy(() => VerificationTokenWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => VerificationTokenWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => VerificationTokenWhereInputSchema),
          z.lazy(() => VerificationTokenWhereInputSchema).array(),
        ])
        .optional(),
      identifier: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      expires: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> =
  z
    .object({
      identifier_token: z.lazy(
        () => VerificationTokenIdentifierTokenCompoundUniqueInputSchema,
      ),
    })
    .and(
      z
        .object({
          identifier_token: z
            .lazy(
              () => VerificationTokenIdentifierTokenCompoundUniqueInputSchema,
            )
            .optional(),
          AND: z
            .union([
              z.lazy(() => VerificationTokenWhereInputSchema),
              z.lazy(() => VerificationTokenWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => VerificationTokenWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => VerificationTokenWhereInputSchema),
              z.lazy(() => VerificationTokenWhereInputSchema).array(),
            ])
            .optional(),
          identifier: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          token: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          expires: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
        })
        .strict(),
    );

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => VerificationTokenCountOrderByAggregateInputSchema)
        .optional(),
      _max: z
        .lazy(() => VerificationTokenMaxOrderByAggregateInputSchema)
        .optional(),
      _min: z
        .lazy(() => VerificationTokenMinOrderByAggregateInputSchema)
        .optional(),
    })
    .strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      identifier: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      token: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      expires: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorWhereInputSchema: z.ZodType<Prisma.AuthenticatorWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AuthenticatorWhereInputSchema),
          z.lazy(() => AuthenticatorWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AuthenticatorWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AuthenticatorWhereInputSchema),
          z.lazy(() => AuthenticatorWhereInputSchema).array(),
        ])
        .optional(),
      credentialID: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      userId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      providerAccountId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      credentialPublicKey: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      counter: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      credentialDeviceType: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      credentialBackedUp: z
        .union([z.lazy(() => BoolFilterSchema), z.boolean()])
        .optional(),
      transports: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      user: z
        .union([
          z.lazy(() => UserScalarRelationFilterSchema),
          z.lazy(() => UserWhereInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorOrderByWithRelationInputSchema: z.ZodType<Prisma.AuthenticatorOrderByWithRelationInput> =
  z
    .object({
      credentialID: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
      counter: z.lazy(() => SortOrderSchema).optional(),
      credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
      credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
      transports: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    })
    .strict();

export const AuthenticatorWhereUniqueInputSchema: z.ZodType<Prisma.AuthenticatorWhereUniqueInput> =
  z
    .union([
      z.object({
        userId_credentialID: z.lazy(
          () => AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema,
        ),
        credentialID: z.string(),
      }),
      z.object({
        userId_credentialID: z.lazy(
          () => AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema,
        ),
      }),
      z.object({
        credentialID: z.string(),
      }),
    ])
    .and(
      z
        .object({
          credentialID: z.string().optional(),
          userId_credentialID: z
            .lazy(
              () => AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema,
            )
            .optional(),
          AND: z
            .union([
              z.lazy(() => AuthenticatorWhereInputSchema),
              z.lazy(() => AuthenticatorWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => AuthenticatorWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => AuthenticatorWhereInputSchema),
              z.lazy(() => AuthenticatorWhereInputSchema).array(),
            ])
            .optional(),
          userId: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          providerAccountId: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          credentialPublicKey: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          counter: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          credentialDeviceType: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          credentialBackedUp: z
            .union([z.lazy(() => BoolFilterSchema), z.boolean()])
            .optional(),
          transports: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          user: z
            .union([
              z.lazy(() => UserScalarRelationFilterSchema),
              z.lazy(() => UserWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const AuthenticatorOrderByWithAggregationInputSchema: z.ZodType<Prisma.AuthenticatorOrderByWithAggregationInput> =
  z
    .object({
      credentialID: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
      counter: z.lazy(() => SortOrderSchema).optional(),
      credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
      credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
      transports: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      _count: z
        .lazy(() => AuthenticatorCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z
        .lazy(() => AuthenticatorAvgOrderByAggregateInputSchema)
        .optional(),
      _max: z
        .lazy(() => AuthenticatorMaxOrderByAggregateInputSchema)
        .optional(),
      _min: z
        .lazy(() => AuthenticatorMinOrderByAggregateInputSchema)
        .optional(),
      _sum: z
        .lazy(() => AuthenticatorSumOrderByAggregateInputSchema)
        .optional(),
    })
    .strict();

export const AuthenticatorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AuthenticatorScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      credentialID: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      userId: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      providerAccountId: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      credentialPublicKey: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      counter: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      credentialDeviceType: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      credentialBackedUp: z
        .union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
        .optional(),
      transports: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const LanguageWhereInputSchema: z.ZodType<Prisma.LanguageWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => LanguageWhereInputSchema),
        z.lazy(() => LanguageWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => LanguageWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => LanguageWhereInputSchema),
        z.lazy(() => LanguageWhereInputSchema).array(),
      ])
      .optional(),
    languageId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    languageName: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    version: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    sourceFileExt: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    binaryFileExt: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    compileCommand: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    runCommand: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    isActive: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    canDelete: z
      .union([z.lazy(() => BoolFilterSchema), z.boolean()])
      .optional(),
    monacoCodeLanguage: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    templateCode: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    problemLanguages: z
      .lazy(() => ProblemLanguageListRelationFilterSchema)
      .optional(),
  })
  .strict();

export const LanguageOrderByWithRelationInputSchema: z.ZodType<Prisma.LanguageOrderByWithRelationInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      languageName: z.lazy(() => SortOrderSchema).optional(),
      version: z.lazy(() => SortOrderSchema).optional(),
      sourceFileExt: z.lazy(() => SortOrderSchema).optional(),
      binaryFileExt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      compileCommand: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      runCommand: z.lazy(() => SortOrderSchema).optional(),
      isActive: z.lazy(() => SortOrderSchema).optional(),
      canDelete: z.lazy(() => SortOrderSchema).optional(),
      monacoCodeLanguage: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
      problemLanguages: z
        .lazy(() => ProblemLanguageOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const LanguageWhereUniqueInputSchema: z.ZodType<Prisma.LanguageWhereUniqueInput> =
  z
    .union([
      z.object({
        languageId: z.number().int(),
        languageName: z.string(),
      }),
      z.object({
        languageId: z.number().int(),
      }),
      z.object({
        languageName: z.string(),
      }),
    ])
    .and(
      z
        .object({
          languageId: z.number().int().optional(),
          languageName: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => LanguageWhereInputSchema),
              z.lazy(() => LanguageWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => LanguageWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => LanguageWhereInputSchema),
              z.lazy(() => LanguageWhereInputSchema).array(),
            ])
            .optional(),
          version: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          sourceFileExt: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          binaryFileExt: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          compileCommand: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          runCommand: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          isActive: z
            .union([z.lazy(() => BoolFilterSchema), z.boolean()])
            .optional(),
          canDelete: z
            .union([z.lazy(() => BoolFilterSchema), z.boolean()])
            .optional(),
          monacoCodeLanguage: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          templateCode: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          problemLanguages: z
            .lazy(() => ProblemLanguageListRelationFilterSchema)
            .optional(),
        })
        .strict(),
    );

export const LanguageOrderByWithAggregationInputSchema: z.ZodType<Prisma.LanguageOrderByWithAggregationInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      languageName: z.lazy(() => SortOrderSchema).optional(),
      version: z.lazy(() => SortOrderSchema).optional(),
      sourceFileExt: z.lazy(() => SortOrderSchema).optional(),
      binaryFileExt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      compileCommand: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      runCommand: z.lazy(() => SortOrderSchema).optional(),
      isActive: z.lazy(() => SortOrderSchema).optional(),
      canDelete: z.lazy(() => SortOrderSchema).optional(),
      monacoCodeLanguage: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => LanguageCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => LanguageAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => LanguageMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => LanguageMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => LanguageSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const LanguageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LanguageScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema),
          z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => LanguageScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema),
          z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      languageName: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      version: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      sourceFileExt: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      binaryFileExt: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      isActive: z
        .union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
        .optional(),
      canDelete: z
        .union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
    })
    .strict();

export const ProblemWhereInputSchema: z.ZodType<Prisma.ProblemWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ProblemWhereInputSchema),
        z.lazy(() => ProblemWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ProblemWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ProblemWhereInputSchema),
        z.lazy(() => ProblemWhereInputSchema).array(),
      ])
      .optional(),
    problemId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
    title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    description: z.lazy(() => JsonNullableFilterSchema).optional(),
    problemStatement: z.lazy(() => JsonFilterSchema).optional(),
    difficultyLevel: z
      .union([z.lazy(() => IntFilterSchema), z.number()])
      .optional(),
    timeLimit: z
      .union([
        z.lazy(() => DecimalFilterSchema),
        z
          .union([
            z.number(),
            z.string(),
            z.instanceof(Decimal),
            z.instanceof(Prisma.Decimal),
            DecimalJsLikeSchema,
          ])
          .refine((v) => isValidDecimalInput(v), {
            message: "Must be a Decimal",
          }),
      ])
      .optional(),
    memoryLimit: z
      .union([
        z.lazy(() => DecimalFilterSchema),
        z
          .union([
            z.number(),
            z.string(),
            z.instanceof(Decimal),
            z.instanceof(Prisma.Decimal),
            DecimalJsLikeSchema,
          ])
          .refine((v) => isValidDecimalInput(v), {
            message: "Must be a Decimal",
          }),
      ])
      .optional(),
    isPublic: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    totalSubmissions: z
      .union([z.lazy(() => IntFilterSchema), z.number()])
      .optional(),
    acceptedSubmissions: z
      .union([z.lazy(() => IntFilterSchema), z.number()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    deletedAt: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    createdBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    updatedBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    deletedBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    problemLanguages: z
      .lazy(() => ProblemLanguageListRelationFilterSchema)
      .optional(),
    problemTags: z.lazy(() => ProblemTagListRelationFilterSchema).optional(),
    submissions: z.lazy(() => SubmissionListRelationFilterSchema).optional(),
    submissionTestcases: z
      .lazy(() => SubmissionTestcaseListRelationFilterSchema)
      .optional(),
    testcases: z.lazy(() => TestcaseListRelationFilterSchema).optional(),
  })
  .strict();

export const ProblemOrderByWithRelationInputSchema: z.ZodType<Prisma.ProblemOrderByWithRelationInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problemStatement: z.lazy(() => SortOrderSchema).optional(),
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      isPublic: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      updatedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      deletedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problemLanguages: z
        .lazy(() => ProblemLanguageOrderByRelationAggregateInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagOrderByRelationAggregateInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionOrderByRelationAggregateInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseOrderByRelationAggregateInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const ProblemWhereUniqueInputSchema: z.ZodType<Prisma.ProblemWhereUniqueInput> =
  z
    .object({
      problemId: z.string(),
    })
    .and(
      z
        .object({
          problemId: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => ProblemWhereInputSchema),
              z.lazy(() => ProblemWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => ProblemWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => ProblemWhereInputSchema),
              z.lazy(() => ProblemWhereInputSchema).array(),
            ])
            .optional(),
          title: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          description: z.lazy(() => JsonNullableFilterSchema).optional(),
          problemStatement: z.lazy(() => JsonFilterSchema).optional(),
          difficultyLevel: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          timeLimit: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          memoryLimit: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          isPublic: z
            .union([z.lazy(() => BoolFilterSchema), z.boolean()])
            .optional(),
          totalSubmissions: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          acceptedSubmissions: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          deletedAt: z
            .union([
              z.lazy(() => DateTimeNullableFilterSchema),
              z.coerce.date(),
            ])
            .optional()
            .nullable(),
          createdBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          updatedBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          deletedBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          problemLanguages: z
            .lazy(() => ProblemLanguageListRelationFilterSchema)
            .optional(),
          problemTags: z
            .lazy(() => ProblemTagListRelationFilterSchema)
            .optional(),
          submissions: z
            .lazy(() => SubmissionListRelationFilterSchema)
            .optional(),
          submissionTestcases: z
            .lazy(() => SubmissionTestcaseListRelationFilterSchema)
            .optional(),
          testcases: z.lazy(() => TestcaseListRelationFilterSchema).optional(),
        })
        .strict(),
    );

export const ProblemOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProblemOrderByWithAggregationInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problemStatement: z.lazy(() => SortOrderSchema).optional(),
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      isPublic: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      updatedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      deletedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      _count: z.lazy(() => ProblemCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => ProblemAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => ProblemMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => ProblemMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => ProblemSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const ProblemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProblemScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema),
          z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema),
          z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      title: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      description: z
        .lazy(() => JsonNullableWithAggregatesFilterSchema)
        .optional(),
      problemStatement: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
      difficultyLevel: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      timeLimit: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      isPublic: z
        .union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
        .optional(),
      totalSubmissions: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      acceptedSubmissions: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const ProblemLanguageWhereInputSchema: z.ZodType<Prisma.ProblemLanguageWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemLanguageWhereInputSchema),
          z.lazy(() => ProblemLanguageWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemLanguageWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemLanguageWhereInputSchema),
          z.lazy(() => ProblemLanguageWhereInputSchema).array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
      templateCode: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      language: z
        .union([
          z.lazy(() => LanguageScalarRelationFilterSchema),
          z.lazy(() => LanguageWhereInputSchema),
        ])
        .optional(),
      problem: z
        .union([
          z.lazy(() => ProblemScalarRelationFilterSchema),
          z.lazy(() => ProblemWhereInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageOrderByWithRelationInputSchema: z.ZodType<Prisma.ProblemLanguageOrderByWithRelationInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      language: z.lazy(() => LanguageOrderByWithRelationInputSchema).optional(),
      problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional(),
    })
    .strict();

export const ProblemLanguageWhereUniqueInputSchema: z.ZodType<Prisma.ProblemLanguageWhereUniqueInput> =
  z
    .object({
      problemId_languageId: z.lazy(
        () => ProblemLanguageProblemIdLanguageIdCompoundUniqueInputSchema,
      ),
    })
    .and(
      z
        .object({
          problemId_languageId: z
            .lazy(
              () => ProblemLanguageProblemIdLanguageIdCompoundUniqueInputSchema,
            )
            .optional(),
          AND: z
            .union([
              z.lazy(() => ProblemLanguageWhereInputSchema),
              z.lazy(() => ProblemLanguageWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => ProblemLanguageWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => ProblemLanguageWhereInputSchema),
              z.lazy(() => ProblemLanguageWhereInputSchema).array(),
            ])
            .optional(),
          problemId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          languageId: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          templateCode: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          timeLimit: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          memoryLimit: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          language: z
            .union([
              z.lazy(() => LanguageScalarRelationFilterSchema),
              z.lazy(() => LanguageWhereInputSchema),
            ])
            .optional(),
          problem: z
            .union([
              z.lazy(() => ProblemScalarRelationFilterSchema),
              z.lazy(() => ProblemWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const ProblemLanguageOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProblemLanguageOrderByWithAggregationInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => ProblemLanguageCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z
        .lazy(() => ProblemLanguageAvgOrderByAggregateInputSchema)
        .optional(),
      _max: z
        .lazy(() => ProblemLanguageMaxOrderByAggregateInputSchema)
        .optional(),
      _min: z
        .lazy(() => ProblemLanguageMinOrderByAggregateInputSchema)
        .optional(),
      _sum: z
        .lazy(() => ProblemLanguageSumOrderByAggregateInputSchema)
        .optional(),
    })
    .strict();

export const ProblemLanguageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProblemLanguageScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => ProblemLanguageScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemLanguageScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => ProblemLanguageScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      templateCode: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagWhereInputSchema: z.ZodType<Prisma.ProblemTagWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemTagWhereInputSchema),
          z.lazy(() => ProblemTagWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemTagWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemTagWhereInputSchema),
          z.lazy(() => ProblemTagWhereInputSchema).array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      tagId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
      problem: z
        .union([
          z.lazy(() => ProblemScalarRelationFilterSchema),
          z.lazy(() => ProblemWhereInputSchema),
        ])
        .optional(),
      tag: z
        .union([
          z.lazy(() => TagScalarRelationFilterSchema),
          z.lazy(() => TagWhereInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagOrderByWithRelationInputSchema: z.ZodType<Prisma.ProblemTagOrderByWithRelationInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
      problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional(),
      tag: z.lazy(() => TagOrderByWithRelationInputSchema).optional(),
    })
    .strict();

export const ProblemTagWhereUniqueInputSchema: z.ZodType<Prisma.ProblemTagWhereUniqueInput> =
  z
    .object({
      problemId_tagId: z.lazy(
        () => ProblemTagProblemIdTagIdCompoundUniqueInputSchema,
      ),
    })
    .and(
      z
        .object({
          problemId_tagId: z
            .lazy(() => ProblemTagProblemIdTagIdCompoundUniqueInputSchema)
            .optional(),
          AND: z
            .union([
              z.lazy(() => ProblemTagWhereInputSchema),
              z.lazy(() => ProblemTagWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => ProblemTagWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => ProblemTagWhereInputSchema),
              z.lazy(() => ProblemTagWhereInputSchema).array(),
            ])
            .optional(),
          problemId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          tagId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          problem: z
            .union([
              z.lazy(() => ProblemScalarRelationFilterSchema),
              z.lazy(() => ProblemWhereInputSchema),
            ])
            .optional(),
          tag: z
            .union([
              z.lazy(() => TagScalarRelationFilterSchema),
              z.lazy(() => TagWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const ProblemTagOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProblemTagOrderByWithAggregationInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => ProblemTagCountOrderByAggregateInputSchema)
        .optional(),
      _max: z.lazy(() => ProblemTagMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => ProblemTagMinOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const ProblemTagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProblemTagScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema),
          z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema),
          z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      tagId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
    })
    .strict();

export const SubmissionWhereInputSchema: z.ZodType<Prisma.SubmissionWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SubmissionWhereInputSchema),
          z.lazy(() => SubmissionWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SubmissionWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SubmissionWhereInputSchema),
          z.lazy(() => SubmissionWhereInputSchema).array(),
        ])
        .optional(),
      submissionId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      userId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
      code: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      status: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      timeExecution: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      submissionTime: z
        .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      deletedAt: z
        .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      createdBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      updatedBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      deletedBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      problem: z
        .union([
          z.lazy(() => ProblemScalarRelationFilterSchema),
          z.lazy(() => ProblemWhereInputSchema),
        ])
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseListRelationFilterSchema)
        .optional(),
    })
    .strict();

export const SubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.SubmissionOrderByWithRelationInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      code: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
      submissionTime: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      updatedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      deletedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const SubmissionWhereUniqueInputSchema: z.ZodType<Prisma.SubmissionWhereUniqueInput> =
  z
    .object({
      submissionId: z.string(),
    })
    .and(
      z
        .object({
          submissionId: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => SubmissionWhereInputSchema),
              z.lazy(() => SubmissionWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => SubmissionWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => SubmissionWhereInputSchema),
              z.lazy(() => SubmissionWhereInputSchema).array(),
            ])
            .optional(),
          userId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          problemId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          languageId: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          code: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          status: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          timeExecution: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          memoryUsage: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          submissionTime: z
            .union([
              z.lazy(() => DateTimeNullableFilterSchema),
              z.coerce.date(),
            ])
            .optional()
            .nullable(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          deletedAt: z
            .union([
              z.lazy(() => DateTimeNullableFilterSchema),
              z.coerce.date(),
            ])
            .optional()
            .nullable(),
          createdBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          updatedBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          deletedBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          problem: z
            .union([
              z.lazy(() => ProblemScalarRelationFilterSchema),
              z.lazy(() => ProblemWhereInputSchema),
            ])
            .optional(),
          submissionTestcases: z
            .lazy(() => SubmissionTestcaseListRelationFilterSchema)
            .optional(),
        })
        .strict(),
    );

export const SubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubmissionOrderByWithAggregationInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      code: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
      submissionTime: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      updatedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      deletedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      _count: z
        .lazy(() => SubmissionCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z.lazy(() => SubmissionAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => SubmissionMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => SubmissionMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => SubmissionSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const SubmissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubmissionScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema),
          z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SubmissionScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema),
          z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      submissionId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      userId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      code: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      status: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      timeExecution: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const SubmissionTestcaseWhereInputSchema: z.ZodType<Prisma.SubmissionTestcaseWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereInputSchema),
          z.lazy(() => SubmissionTestcaseWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SubmissionTestcaseWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereInputSchema),
          z.lazy(() => SubmissionTestcaseWhereInputSchema).array(),
        ])
        .optional(),
      submissionId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      testcaseId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      status: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      stdout: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      runtime: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      problem: z
        .union([
          z.lazy(() => ProblemScalarRelationFilterSchema),
          z.lazy(() => ProblemWhereInputSchema),
        ])
        .optional(),
      submission: z
        .union([
          z.lazy(() => SubmissionScalarRelationFilterSchema),
          z.lazy(() => SubmissionWhereInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseOrderByWithRelationInputSchema: z.ZodType<Prisma.SubmissionTestcaseOrderByWithRelationInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      testcaseId: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      stdout: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
      problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional(),
      submission: z
        .lazy(() => SubmissionOrderByWithRelationInputSchema)
        .optional(),
    })
    .strict();

export const SubmissionTestcaseWhereUniqueInputSchema: z.ZodType<Prisma.SubmissionTestcaseWhereUniqueInput> =
  z
    .object({
      submissionId_testcaseId: z.lazy(
        () => SubmissionTestcaseSubmissionIdTestcaseIdCompoundUniqueInputSchema,
      ),
    })
    .and(
      z
        .object({
          submissionId_testcaseId: z
            .lazy(
              () =>
                SubmissionTestcaseSubmissionIdTestcaseIdCompoundUniqueInputSchema,
            )
            .optional(),
          AND: z
            .union([
              z.lazy(() => SubmissionTestcaseWhereInputSchema),
              z.lazy(() => SubmissionTestcaseWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => SubmissionTestcaseWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => SubmissionTestcaseWhereInputSchema),
              z.lazy(() => SubmissionTestcaseWhereInputSchema).array(),
            ])
            .optional(),
          submissionId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          testcaseId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          status: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          stdout: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          problemId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          runtime: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          memoryUsed: z
            .union([
              z.lazy(() => DecimalFilterSchema),
              z
                .union([
                  z.number(),
                  z.string(),
                  z.instanceof(Decimal),
                  z.instanceof(Prisma.Decimal),
                  DecimalJsLikeSchema,
                ])
                .refine((v) => isValidDecimalInput(v), {
                  message: "Must be a Decimal",
                }),
            ])
            .optional(),
          problem: z
            .union([
              z.lazy(() => ProblemScalarRelationFilterSchema),
              z.lazy(() => ProblemWhereInputSchema),
            ])
            .optional(),
          submission: z
            .union([
              z.lazy(() => SubmissionScalarRelationFilterSchema),
              z.lazy(() => SubmissionWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const SubmissionTestcaseOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubmissionTestcaseOrderByWithAggregationInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      testcaseId: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      stdout: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => SubmissionTestcaseCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z
        .lazy(() => SubmissionTestcaseAvgOrderByAggregateInputSchema)
        .optional(),
      _max: z
        .lazy(() => SubmissionTestcaseMaxOrderByAggregateInputSchema)
        .optional(),
      _min: z
        .lazy(() => SubmissionTestcaseMinOrderByAggregateInputSchema)
        .optional(),
      _sum: z
        .lazy(() => SubmissionTestcaseSumOrderByAggregateInputSchema)
        .optional(),
    })
    .strict();

export const SubmissionTestcaseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubmissionTestcaseScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => SubmissionTestcaseScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SubmissionTestcaseScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereWithAggregatesInputSchema),
          z
            .lazy(() => SubmissionTestcaseScalarWhereWithAggregatesInputSchema)
            .array(),
        ])
        .optional(),
      submissionId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      testcaseId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      status: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      stdout: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      problemId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      runtime: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z.lazy(() => DecimalWithAggregatesFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
    })
    .strict();

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TagWhereInputSchema),
        z.lazy(() => TagWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TagWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TagWhereInputSchema),
        z.lazy(() => TagWhereInputSchema).array(),
      ])
      .optional(),
    tagId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
    tagName: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    createdBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    problemTags: z.lazy(() => ProblemTagListRelationFilterSchema).optional(),
  })
  .strict();

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> =
  z
    .object({
      tagId: z.lazy(() => SortOrderSchema).optional(),
      tagName: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const TagWhereUniqueInputSchema: z.ZodType<Prisma.TagWhereUniqueInput> =
  z
    .object({
      tagId: z.string(),
    })
    .and(
      z
        .object({
          tagId: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => TagWhereInputSchema),
              z.lazy(() => TagWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => TagWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => TagWhereInputSchema),
              z.lazy(() => TagWhereInputSchema).array(),
            ])
            .optional(),
          tagName: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          description: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          createdBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          problemTags: z
            .lazy(() => ProblemTagListRelationFilterSchema)
            .optional(),
        })
        .strict(),
    );

export const TagOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagOrderByWithAggregationInput> =
  z
    .object({
      tagId: z.lazy(() => SortOrderSchema).optional(),
      tagName: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      _count: z.lazy(() => TagCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => TagMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => TagMinOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const TagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => TagScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      tagId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      tagName: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      description: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TestcaseWhereInputSchema: z.ZodType<Prisma.TestcaseWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TestcaseWhereInputSchema),
        z.lazy(() => TestcaseWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TestcaseWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TestcaseWhereInputSchema),
        z.lazy(() => TestcaseWhereInputSchema).array(),
      ])
      .optional(),
    testCaseId: z
      .union([z.lazy(() => UuidFilterSchema), z.string()])
      .optional(),
    problemId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
    inputData: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    expectedOutput: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    isSample: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    points: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    label: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    explanation: z.lazy(() => JsonNullableFilterSchema).optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    deletedAt: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    createdBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    updatedBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    deletedBy: z
      .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    problem: z
      .union([
        z.lazy(() => ProblemScalarRelationFilterSchema),
        z.lazy(() => ProblemWhereInputSchema),
      ])
      .optional(),
  })
  .strict();

export const TestcaseOrderByWithRelationInputSchema: z.ZodType<Prisma.TestcaseOrderByWithRelationInput> =
  z
    .object({
      testCaseId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      inputData: z.lazy(() => SortOrderSchema).optional(),
      expectedOutput: z.lazy(() => SortOrderSchema).optional(),
      isSample: z.lazy(() => SortOrderSchema).optional(),
      points: z.lazy(() => SortOrderSchema).optional(),
      label: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      explanation: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      updatedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      deletedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional(),
    })
    .strict();

export const TestcaseWhereUniqueInputSchema: z.ZodType<Prisma.TestcaseWhereUniqueInput> =
  z
    .object({
      testCaseId: z.string(),
    })
    .and(
      z
        .object({
          testCaseId: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => TestcaseWhereInputSchema),
              z.lazy(() => TestcaseWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => TestcaseWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => TestcaseWhereInputSchema),
              z.lazy(() => TestcaseWhereInputSchema).array(),
            ])
            .optional(),
          problemId: z
            .union([z.lazy(() => UuidFilterSchema), z.string()])
            .optional(),
          inputData: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          expectedOutput: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          isSample: z
            .union([z.lazy(() => BoolFilterSchema), z.boolean()])
            .optional(),
          points: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          label: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          explanation: z.lazy(() => JsonNullableFilterSchema).optional(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          deletedAt: z
            .union([
              z.lazy(() => DateTimeNullableFilterSchema),
              z.coerce.date(),
            ])
            .optional()
            .nullable(),
          createdBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          updatedBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          deletedBy: z
            .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          problem: z
            .union([
              z.lazy(() => ProblemScalarRelationFilterSchema),
              z.lazy(() => ProblemWhereInputSchema),
            ])
            .optional(),
        })
        .strict(),
    );

export const TestcaseOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestcaseOrderByWithAggregationInput> =
  z
    .object({
      testCaseId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      inputData: z.lazy(() => SortOrderSchema).optional(),
      expectedOutput: z.lazy(() => SortOrderSchema).optional(),
      isSample: z.lazy(() => SortOrderSchema).optional(),
      points: z.lazy(() => SortOrderSchema).optional(),
      label: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      explanation: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      updatedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      deletedBy: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      _count: z.lazy(() => TestcaseCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => TestcaseAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => TestcaseMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => TestcaseMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => TestcaseSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const TestcaseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestcaseScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => TestcaseScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TestcaseScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => TestcaseScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => TestcaseScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TestcaseScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      testCaseId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()])
        .optional(),
      inputData: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      expectedOutput: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      isSample: z
        .union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
        .optional(),
      points: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      label: z
        .union([
          z.lazy(() => StringNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      explanation: z
        .lazy(() => JsonNullableWithAggregatesFilterSchema)
        .optional(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.lazy(() => UuidNullableWithAggregatesFilterSchema),
          z.string(),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().optional().nullable(),
    email: z.string(),
    emailVerified: z.coerce.date().optional().nullable(),
    image: z.string().optional().nullable(),
    hashPassword: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    accounts: z
      .lazy(() => AccountCreateNestedManyWithoutUserInputSchema)
      .optional(),
    sessions: z
      .lazy(() => SessionCreateNestedManyWithoutUserInputSchema)
      .optional(),
    Authenticator: z
      .lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema)
      .optional(),
  })
  .strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      accounts: z
        .lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      Authenticator: z
        .lazy(
          () => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema,
        )
        .optional(),
    })
    .strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z
  .object({
    id: z
      .union([
        z.string().cuid(),
        z.lazy(() => StringFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    name: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    emailVerified: z
      .union([
        z.coerce.date(),
        z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    image: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    hashPassword: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    accounts: z
      .lazy(() => AccountUpdateManyWithoutUserNestedInputSchema)
      .optional(),
    sessions: z
      .lazy(() => SessionUpdateManyWithoutUserNestedInputSchema)
      .optional(),
    Authenticator: z
      .lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema)
      .optional(),
  })
  .strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      accounts: z
        .lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      Authenticator: z
        .lazy(
          () => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z
  .object({
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().optional().nullable(),
    access_token: z.string().optional().nullable(),
    expires_at: z.number().int().optional().nullable(),
    token_type: z.string().optional().nullable(),
    scope: z.string().optional().nullable(),
    id_token: z.string().optional().nullable(),
    session_state: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
  })
  .strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> =
  z
    .object({
      userId: z.string(),
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z
  .object({
    type: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    provider: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    providerAccountId: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    refresh_token: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    access_token: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    expires_at: z
      .union([
        z.number().int(),
        z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    token_type: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    scope: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    id_token: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    session_state: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    user: z
      .lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema)
      .optional(),
  })
  .strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> =
  z
    .object({
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      type: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      provider: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      refresh_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> =
  z
    .object({
      userId: z.string(),
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> =
  z
    .object({
      type: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      provider: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      refresh_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> =
  z
    .object({
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      type: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      provider: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      refresh_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z
  .object({
    sessionToken: z.string(),
    expires: z.coerce.date(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
  })
  .strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> =
  z
    .object({
      sessionToken: z.string(),
      userId: z.string(),
      expires: z.coerce.date(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z
  .object({
    sessionToken: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    expires: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    user: z
      .lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema)
      .optional(),
  })
  .strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> =
  z
    .object({
      sessionToken: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> =
  z
    .object({
      sessionToken: z.string(),
      userId: z.string(),
      expires: z.coerce.date(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> =
  z
    .object({
      sessionToken: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> =
  z
    .object({
      sessionToken: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
      expires: z.coerce.date(),
    })
    .strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
      expires: z.coerce.date(),
    })
    .strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> =
  z
    .object({
      identifier: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> =
  z
    .object({
      identifier: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
      expires: z.coerce.date(),
    })
    .strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> =
  z
    .object({
      identifier: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> =
  z
    .object({
      identifier: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorCreateInputSchema: z.ZodType<Prisma.AuthenticatorCreateInput> =
  z
    .object({
      credentialID: z.string(),
      providerAccountId: z.string(),
      credentialPublicKey: z.string(),
      counter: z.number().int(),
      credentialDeviceType: z.string(),
      credentialBackedUp: z.boolean(),
      transports: z.string().optional().nullable(),
      user: z.lazy(() => UserCreateNestedOneWithoutAuthenticatorInputSchema),
    })
    .strict();

export const AuthenticatorUncheckedCreateInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedCreateInput> =
  z
    .object({
      credentialID: z.string(),
      userId: z.string(),
      providerAccountId: z.string(),
      credentialPublicKey: z.string(),
      counter: z.number().int(),
      credentialDeviceType: z.string(),
      credentialBackedUp: z.boolean(),
      transports: z.string().optional().nullable(),
    })
    .strict();

export const AuthenticatorUpdateInputSchema: z.ZodType<Prisma.AuthenticatorUpdateInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      user: z
        .lazy(() => UserUpdateOneRequiredWithoutAuthenticatorNestedInputSchema)
        .optional(),
    })
    .strict();

export const AuthenticatorUncheckedUpdateInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const AuthenticatorCreateManyInputSchema: z.ZodType<Prisma.AuthenticatorCreateManyInput> =
  z
    .object({
      credentialID: z.string(),
      userId: z.string(),
      providerAccountId: z.string(),
      credentialPublicKey: z.string(),
      counter: z.number().int(),
      credentialDeviceType: z.string(),
      credentialBackedUp: z.boolean(),
      transports: z.string().optional().nullable(),
    })
    .strict();

export const AuthenticatorUpdateManyMutationInputSchema: z.ZodType<Prisma.AuthenticatorUpdateManyMutationInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const AuthenticatorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateManyInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const LanguageCreateInputSchema: z.ZodType<Prisma.LanguageCreateInput> =
  z
    .object({
      languageName: z.string(),
      version: z.string(),
      sourceFileExt: z.string(),
      binaryFileExt: z.string().optional().nullable(),
      compileCommand: z.string().optional().nullable(),
      runCommand: z.string(),
      isActive: z.boolean().optional(),
      canDelete: z.boolean().optional(),
      monacoCodeLanguage: z.string().optional().nullable(),
      templateCode: z.string().optional(),
      problemLanguages: z
        .lazy(() => ProblemLanguageCreateNestedManyWithoutLanguageInputSchema)
        .optional(),
    })
    .strict();

export const LanguageUncheckedCreateInputSchema: z.ZodType<Prisma.LanguageUncheckedCreateInput> =
  z
    .object({
      languageId: z.number().int().optional(),
      languageName: z.string(),
      version: z.string(),
      sourceFileExt: z.string(),
      binaryFileExt: z.string().optional().nullable(),
      compileCommand: z.string().optional().nullable(),
      runCommand: z.string(),
      isActive: z.boolean().optional(),
      canDelete: z.boolean().optional(),
      monacoCodeLanguage: z.string().optional().nullable(),
      templateCode: z.string().optional(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedCreateNestedManyWithoutLanguageInputSchema,
        )
        .optional(),
    })
    .strict();

export const LanguageUpdateInputSchema: z.ZodType<Prisma.LanguageUpdateInput> =
  z
    .object({
      languageName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      version: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sourceFileExt: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      binaryFileExt: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      canDelete: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemLanguages: z
        .lazy(() => ProblemLanguageUpdateManyWithoutLanguageNestedInputSchema)
        .optional(),
    })
    .strict();

export const LanguageUncheckedUpdateInputSchema: z.ZodType<Prisma.LanguageUncheckedUpdateInput> =
  z
    .object({
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      version: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sourceFileExt: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      binaryFileExt: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      canDelete: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedUpdateManyWithoutLanguageNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const LanguageCreateManyInputSchema: z.ZodType<Prisma.LanguageCreateManyInput> =
  z
    .object({
      languageId: z.number().int().optional(),
      languageName: z.string(),
      version: z.string(),
      sourceFileExt: z.string(),
      binaryFileExt: z.string().optional().nullable(),
      compileCommand: z.string().optional().nullable(),
      runCommand: z.string(),
      isActive: z.boolean().optional(),
      canDelete: z.boolean().optional(),
      monacoCodeLanguage: z.string().optional().nullable(),
      templateCode: z.string().optional(),
    })
    .strict();

export const LanguageUpdateManyMutationInputSchema: z.ZodType<Prisma.LanguageUpdateManyMutationInput> =
  z
    .object({
      languageName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      version: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sourceFileExt: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      binaryFileExt: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      canDelete: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const LanguageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LanguageUncheckedUpdateManyInput> =
  z
    .object({
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      version: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sourceFileExt: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      binaryFileExt: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      canDelete: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemCreateInputSchema: z.ZodType<Prisma.ProblemCreateInput> = z
  .object({
    problemId: z.string().optional(),
    title: z.string(),
    description: z
      .union([
        z.lazy(() => NullableJsonNullValueInputSchema),
        InputJsonValueSchema,
      ])
      .optional(),
    problemStatement: z.union([
      z.lazy(() => JsonNullValueInputSchema),
      InputJsonValueSchema,
    ]),
    difficultyLevel: z.number().int().optional(),
    timeLimit: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    memoryLimit: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    isPublic: z.boolean().optional(),
    totalSubmissions: z.number().int().optional(),
    acceptedSubmissions: z.number().int().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    deletedAt: z.coerce.date().optional().nullable(),
    createdBy: z.string().optional().nullable(),
    updatedBy: z.string().optional().nullable(),
    deletedBy: z.string().optional().nullable(),
    problemLanguages: z
      .lazy(() => ProblemLanguageCreateNestedManyWithoutProblemInputSchema)
      .optional(),
    problemTags: z
      .lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema)
      .optional(),
    submissions: z
      .lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema)
      .optional(),
    submissionTestcases: z
      .lazy(() => SubmissionTestcaseCreateNestedManyWithoutProblemInputSchema)
      .optional(),
    testcases: z
      .lazy(() => TestcaseCreateNestedManyWithoutProblemInputSchema)
      .optional(),
  })
  .strict();

export const ProblemUncheckedCreateInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUpdateInputSchema: z.ZodType<Prisma.ProblemUpdateInput> = z
  .object({
    problemId: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    title: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    description: z
      .union([
        z.lazy(() => NullableJsonNullValueInputSchema),
        InputJsonValueSchema,
      ])
      .optional(),
    problemStatement: z
      .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    difficultyLevel: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    timeLimit: z
      .union([
        z
          .union([
            z.number(),
            z.string(),
            z.instanceof(Decimal),
            z.instanceof(Prisma.Decimal),
            DecimalJsLikeSchema,
          ])
          .refine((v) => isValidDecimalInput(v), {
            message: "Must be a Decimal",
          }),
        z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    memoryLimit: z
      .union([
        z
          .union([
            z.number(),
            z.string(),
            z.instanceof(Decimal),
            z.instanceof(Prisma.Decimal),
            DecimalJsLikeSchema,
          ])
          .refine((v) => isValidDecimalInput(v), {
            message: "Must be a Decimal",
          }),
        z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    isPublic: z
      .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
      .optional(),
    totalSubmissions: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    acceptedSubmissions: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    deletedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    createdBy: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    updatedBy: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    deletedBy: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    problemLanguages: z
      .lazy(() => ProblemLanguageUpdateManyWithoutProblemNestedInputSchema)
      .optional(),
    problemTags: z
      .lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema)
      .optional(),
    submissions: z
      .lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema)
      .optional(),
    submissionTestcases: z
      .lazy(() => SubmissionTestcaseUpdateManyWithoutProblemNestedInputSchema)
      .optional(),
    testcases: z
      .lazy(() => TestcaseUpdateManyWithoutProblemNestedInputSchema)
      .optional(),
  })
  .strict();

export const ProblemUncheckedUpdateInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemCreateManyInputSchema: z.ZodType<Prisma.ProblemCreateManyInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const ProblemUpdateManyMutationInputSchema: z.ZodType<Prisma.ProblemUpdateManyMutationInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const ProblemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateManyInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const ProblemLanguageCreateInputSchema: z.ZodType<Prisma.ProblemLanguageCreateInput> =
  z
    .object({
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      language: z.lazy(
        () => LanguageCreateNestedOneWithoutProblemLanguagesInputSchema,
      ),
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutProblemLanguagesInputSchema,
      ),
    })
    .strict();

export const ProblemLanguageUncheckedCreateInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedCreateInput> =
  z
    .object({
      problemId: z.string(),
      languageId: z.number().int(),
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemLanguageUpdateInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateInput> =
  z
    .object({
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      language: z
        .lazy(
          () =>
            LanguageUpdateOneRequiredWithoutProblemLanguagesNestedInputSchema,
        )
        .optional(),
      problem: z
        .lazy(
          () =>
            ProblemUpdateOneRequiredWithoutProblemLanguagesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateManyInputSchema: z.ZodType<Prisma.ProblemLanguageCreateManyInput> =
  z
    .object({
      problemId: z.string(),
      languageId: z.number().int(),
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemLanguageUpdateManyMutationInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateManyMutationInput> =
  z
    .object({
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateManyInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagCreateInputSchema: z.ZodType<Prisma.ProblemTagCreateInput> =
  z
    .object({
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutProblemTagsInputSchema,
      ),
      tag: z.lazy(() => TagCreateNestedOneWithoutProblemTagsInputSchema),
    })
    .strict();

export const ProblemTagUncheckedCreateInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateInput> =
  z
    .object({
      problemId: z.string(),
      tagId: z.string(),
    })
    .strict();

export const ProblemTagUpdateInputSchema: z.ZodType<Prisma.ProblemTagUpdateInput> =
  z
    .object({
      problem: z
        .lazy(() => ProblemUpdateOneRequiredWithoutProblemTagsNestedInputSchema)
        .optional(),
      tag: z
        .lazy(() => TagUpdateOneRequiredWithoutProblemTagsNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagCreateManyInputSchema: z.ZodType<Prisma.ProblemTagCreateManyInput> =
  z
    .object({
      problemId: z.string(),
      tagId: z.string(),
    })
    .strict();

export const ProblemTagUpdateManyMutationInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyMutationInput> =
  z.object({}).strict();

export const ProblemTagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionCreateInputSchema: z.ZodType<Prisma.SubmissionCreateInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutSubmissionsInputSchema,
      ),
      submissionTestcases: z
        .lazy(
          () => SubmissionTestcaseCreateNestedManyWithoutSubmissionInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      problemId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutSubmissionInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionUpdateInputSchema: z.ZodType<Prisma.SubmissionUpdateInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problem: z
        .lazy(() => ProblemUpdateOneRequiredWithoutSubmissionsNestedInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(
          () => SubmissionTestcaseUpdateManyWithoutSubmissionNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionCreateManyInputSchema: z.ZodType<Prisma.SubmissionCreateManyInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      problemId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const SubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.SubmissionUpdateManyMutationInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const SubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const SubmissionTestcaseCreateInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateInput> =
  z
    .object({
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutSubmissionTestcasesInputSchema,
      ),
      submission: z.lazy(
        () => SubmissionCreateNestedOneWithoutSubmissionTestcasesInputSchema,
      ),
    })
    .strict();

export const SubmissionTestcaseUncheckedCreateInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedCreateInput> =
  z
    .object({
      submissionId: z.string(),
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      problemId: z.string(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUpdateInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateInput> =
  z
    .object({
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problem: z
        .lazy(
          () =>
            ProblemUpdateOneRequiredWithoutSubmissionTestcasesNestedInputSchema,
        )
        .optional(),
      submission: z
        .lazy(
          () =>
            SubmissionUpdateOneRequiredWithoutSubmissionTestcasesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseCreateManyInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManyInput> =
  z
    .object({
      submissionId: z.string(),
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      problemId: z.string(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUpdateManyMutationInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateManyMutationInput> =
  z
    .object({
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateManyInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const TagCreateInputSchema: z.ZodType<Prisma.TagCreateInput> = z
  .object({
    tagId: z.string().optional(),
    tagName: z.string(),
    description: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    createdBy: z.string().optional().nullable(),
    problemTags: z
      .lazy(() => ProblemTagCreateNestedManyWithoutTagInputSchema)
      .optional(),
  })
  .strict();

export const TagUncheckedCreateInputSchema: z.ZodType<Prisma.TagUncheckedCreateInput> =
  z
    .object({
      tagId: z.string().optional(),
      tagName: z.string(),
      description: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      createdBy: z.string().optional().nullable(),
      problemTags: z
        .lazy(() => ProblemTagUncheckedCreateNestedManyWithoutTagInputSchema)
        .optional(),
    })
    .strict();

export const TagUpdateInputSchema: z.ZodType<Prisma.TagUpdateInput> = z
  .object({
    tagId: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    tagName: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    description: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    createdBy: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
      ])
      .optional()
      .nullable(),
    problemTags: z
      .lazy(() => ProblemTagUpdateManyWithoutTagNestedInputSchema)
      .optional(),
  })
  .strict();

export const TagUncheckedUpdateInputSchema: z.ZodType<Prisma.TagUncheckedUpdateInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemTags: z
        .lazy(() => ProblemTagUncheckedUpdateManyWithoutTagNestedInputSchema)
        .optional(),
    })
    .strict();

export const TagCreateManyInputSchema: z.ZodType<Prisma.TagCreateManyInput> = z
  .object({
    tagId: z.string().optional(),
    tagName: z.string(),
    description: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    createdBy: z.string().optional().nullable(),
  })
  .strict();

export const TagUpdateManyMutationInputSchema: z.ZodType<Prisma.TagUpdateManyMutationInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TestcaseCreateInputSchema: z.ZodType<Prisma.TestcaseCreateInput> =
  z
    .object({
      testCaseId: z.string().optional(),
      inputData: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      points: z.number().int().optional(),
      label: z.string().optional().nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problem: z.lazy(() => ProblemCreateNestedOneWithoutTestcasesInputSchema),
    })
    .strict();

export const TestcaseUncheckedCreateInputSchema: z.ZodType<Prisma.TestcaseUncheckedCreateInput> =
  z
    .object({
      testCaseId: z.string().optional(),
      problemId: z.string(),
      inputData: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      points: z.number().int().optional(),
      label: z.string().optional().nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const TestcaseUpdateInputSchema: z.ZodType<Prisma.TestcaseUpdateInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problem: z
        .lazy(() => ProblemUpdateOneRequiredWithoutTestcasesNestedInputSchema)
        .optional(),
    })
    .strict();

export const TestcaseUncheckedUpdateInputSchema: z.ZodType<Prisma.TestcaseUncheckedUpdateInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TestcaseCreateManyInputSchema: z.ZodType<Prisma.TestcaseCreateManyInput> =
  z
    .object({
      testCaseId: z.string().optional(),
      problemId: z.string(),
      inputData: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      points: z.number().int().optional(),
      label: z.string().optional().nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const TestcaseUpdateManyMutationInputSchema: z.ZodType<Prisma.TestcaseUpdateManyMutationInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TestcaseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestcaseUncheckedUpdateManyInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  })
  .strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> =
  z
    .object({
      equals: z.coerce.date().optional().nullable(),
      in: z.coerce.date().array().optional().nullable(),
      notIn: z.coerce.date().array().optional().nullable(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeNullableFilterSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z
  .object({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
      .optional(),
  })
  .strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> =
  z
    .object({
      every: z.lazy(() => AccountWhereInputSchema).optional(),
      some: z.lazy(() => AccountWhereInputSchema).optional(),
      none: z.lazy(() => AccountWhereInputSchema).optional(),
    })
    .strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> =
  z
    .object({
      every: z.lazy(() => SessionWhereInputSchema).optional(),
      some: z.lazy(() => SessionWhereInputSchema).optional(),
      none: z.lazy(() => SessionWhereInputSchema).optional(),
    })
    .strict();

export const AuthenticatorListRelationFilterSchema: z.ZodType<Prisma.AuthenticatorListRelationFilter> =
  z
    .object({
      every: z.lazy(() => AuthenticatorWhereInputSchema).optional(),
      some: z.lazy(() => AuthenticatorWhereInputSchema).optional(),
      none: z.lazy(() => AuthenticatorWhereInputSchema).optional(),
    })
    .strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z
  .object({
    sort: z.lazy(() => SortOrderSchema),
    nulls: z.lazy(() => NullsOrderSchema).optional(),
  })
  .strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AuthenticatorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AuthenticatorOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      emailVerified: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      hashPassword: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      emailVerified: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      hashPassword: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      emailVerified: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      hashPassword: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
    })
    .strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional().nullable(),
      in: z.coerce.date().array().optional().nullable(),
      notIn: z.coerce.date().array().optional().nullable(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
    })
    .strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    })
    .strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z
  .object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => UserWhereInputSchema).optional(),
      isNot: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> =
  z
    .object({
      provider: z.string(),
      providerAccountId: z.string(),
    })
    .strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> =
  z
    .object({
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z.lazy(() => SortOrderSchema).optional(),
      access_token: z.lazy(() => SortOrderSchema).optional(),
      expires_at: z.lazy(() => SortOrderSchema).optional(),
      token_type: z.lazy(() => SortOrderSchema).optional(),
      scope: z.lazy(() => SortOrderSchema).optional(),
      id_token: z.lazy(() => SortOrderSchema).optional(),
      session_state: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> =
  z
    .object({
      expires_at: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> =
  z
    .object({
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z.lazy(() => SortOrderSchema).optional(),
      access_token: z.lazy(() => SortOrderSchema).optional(),
      expires_at: z.lazy(() => SortOrderSchema).optional(),
      token_type: z.lazy(() => SortOrderSchema).optional(),
      scope: z.lazy(() => SortOrderSchema).optional(),
      id_token: z.lazy(() => SortOrderSchema).optional(),
      session_state: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> =
  z
    .object({
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z.lazy(() => SortOrderSchema).optional(),
      access_token: z.lazy(() => SortOrderSchema).optional(),
      expires_at: z.lazy(() => SortOrderSchema).optional(),
      token_type: z.lazy(() => SortOrderSchema).optional(),
      scope: z.lazy(() => SortOrderSchema).optional(),
      id_token: z.lazy(() => SortOrderSchema).optional(),
      session_state: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> =
  z
    .object({
      expires_at: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([
          z.number(),
          z.lazy(() => NestedIntNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
    })
    .strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> =
  z
    .object({
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> =
  z
    .object({
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> =
  z
    .object({
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
    })
    .strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z
      .union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)])
      .optional(),
  })
  .strict();

export const AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema: z.ZodType<Prisma.AuthenticatorUserIdCredentialIDCompoundUniqueInput> =
  z
    .object({
      userId: z.string(),
      credentialID: z.string(),
    })
    .strict();

export const AuthenticatorCountOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorCountOrderByAggregateInput> =
  z
    .object({
      credentialID: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
      counter: z.lazy(() => SortOrderSchema).optional(),
      credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
      credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
      transports: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AuthenticatorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorAvgOrderByAggregateInput> =
  z
    .object({
      counter: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AuthenticatorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorMaxOrderByAggregateInput> =
  z
    .object({
      credentialID: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
      counter: z.lazy(() => SortOrderSchema).optional(),
      credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
      credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
      transports: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AuthenticatorMinOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorMinOrderByAggregateInput> =
  z
    .object({
      credentialID: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
      counter: z.lazy(() => SortOrderSchema).optional(),
      credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
      credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
      transports: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AuthenticatorSumOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorSumOrderByAggregateInput> =
  z
    .object({
      counter: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional(),
      in: z.number().array().optional(),
      notIn: z.number().array().optional(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedIntFilterSchema).optional(),
      _max: z.lazy(() => NestedIntFilterSchema).optional(),
    })
    .strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> =
  z
    .object({
      equals: z.boolean().optional(),
      not: z
        .union([
          z.boolean(),
          z.lazy(() => NestedBoolWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedBoolFilterSchema).optional(),
      _max: z.lazy(() => NestedBoolFilterSchema).optional(),
    })
    .strict();

export const ProblemLanguageListRelationFilterSchema: z.ZodType<Prisma.ProblemLanguageListRelationFilter> =
  z
    .object({
      every: z.lazy(() => ProblemLanguageWhereInputSchema).optional(),
      some: z.lazy(() => ProblemLanguageWhereInputSchema).optional(),
      none: z.lazy(() => ProblemLanguageWhereInputSchema).optional(),
    })
    .strict();

export const ProblemLanguageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProblemLanguageOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const LanguageCountOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageCountOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      languageName: z.lazy(() => SortOrderSchema).optional(),
      version: z.lazy(() => SortOrderSchema).optional(),
      sourceFileExt: z.lazy(() => SortOrderSchema).optional(),
      binaryFileExt: z.lazy(() => SortOrderSchema).optional(),
      compileCommand: z.lazy(() => SortOrderSchema).optional(),
      runCommand: z.lazy(() => SortOrderSchema).optional(),
      isActive: z.lazy(() => SortOrderSchema).optional(),
      canDelete: z.lazy(() => SortOrderSchema).optional(),
      monacoCodeLanguage: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const LanguageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageAvgOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const LanguageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageMaxOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      languageName: z.lazy(() => SortOrderSchema).optional(),
      version: z.lazy(() => SortOrderSchema).optional(),
      sourceFileExt: z.lazy(() => SortOrderSchema).optional(),
      binaryFileExt: z.lazy(() => SortOrderSchema).optional(),
      compileCommand: z.lazy(() => SortOrderSchema).optional(),
      runCommand: z.lazy(() => SortOrderSchema).optional(),
      isActive: z.lazy(() => SortOrderSchema).optional(),
      canDelete: z.lazy(() => SortOrderSchema).optional(),
      monacoCodeLanguage: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const LanguageMinOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageMinOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      languageName: z.lazy(() => SortOrderSchema).optional(),
      version: z.lazy(() => SortOrderSchema).optional(),
      sourceFileExt: z.lazy(() => SortOrderSchema).optional(),
      binaryFileExt: z.lazy(() => SortOrderSchema).optional(),
      compileCommand: z.lazy(() => SortOrderSchema).optional(),
      runCommand: z.lazy(() => SortOrderSchema).optional(),
      isActive: z.lazy(() => SortOrderSchema).optional(),
      canDelete: z.lazy(() => SortOrderSchema).optional(),
      monacoCodeLanguage: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const LanguageSumOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageSumOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const UuidFilterSchema: z.ZodType<Prisma.UuidFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z.union([z.string(), z.lazy(() => NestedUuidFilterSchema)]).optional(),
  })
  .strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z
  .object({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
  })
  .strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z
  .object({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
  })
  .strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z
  .object({
    equals: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    in: z
      .union([
        z.number().array(),
        z.string().array(),
        z.instanceof(Decimal).array(),
        z.instanceof(Prisma.Decimal).array(),
        DecimalJsLikeSchema.array(),
      ])
      .refine(
        (v) =>
          Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
        { message: "Must be a Decimal" },
      )
      .optional(),
    notIn: z
      .union([
        z.number().array(),
        z.string().array(),
        z.instanceof(Decimal).array(),
        z.instanceof(Prisma.Decimal).array(),
        DecimalJsLikeSchema.array(),
      ])
      .refine(
        (v) =>
          Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
        { message: "Must be a Decimal" },
      )
      .optional(),
    lt: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    lte: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    gt: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    gte: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
      .optional(),
    not: z
      .union([
        z
          .union([
            z.number(),
            z.string(),
            z.instanceof(Decimal),
            z.instanceof(Prisma.Decimal),
            DecimalJsLikeSchema,
          ])
          .refine((v) => isValidDecimalInput(v), {
            message: "Must be a Decimal",
          }),
        z.lazy(() => NestedDecimalFilterSchema),
      ])
      .optional(),
  })
  .strict();

export const UuidNullableFilterSchema: z.ZodType<Prisma.UuidNullableFilter> = z
  .object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedUuidNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict();

export const ProblemTagListRelationFilterSchema: z.ZodType<Prisma.ProblemTagListRelationFilter> =
  z
    .object({
      every: z.lazy(() => ProblemTagWhereInputSchema).optional(),
      some: z.lazy(() => ProblemTagWhereInputSchema).optional(),
      none: z.lazy(() => ProblemTagWhereInputSchema).optional(),
    })
    .strict();

export const SubmissionListRelationFilterSchema: z.ZodType<Prisma.SubmissionListRelationFilter> =
  z
    .object({
      every: z.lazy(() => SubmissionWhereInputSchema).optional(),
      some: z.lazy(() => SubmissionWhereInputSchema).optional(),
      none: z.lazy(() => SubmissionWhereInputSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseListRelationFilterSchema: z.ZodType<Prisma.SubmissionTestcaseListRelationFilter> =
  z
    .object({
      every: z.lazy(() => SubmissionTestcaseWhereInputSchema).optional(),
      some: z.lazy(() => SubmissionTestcaseWhereInputSchema).optional(),
      none: z.lazy(() => SubmissionTestcaseWhereInputSchema).optional(),
    })
    .strict();

export const TestcaseListRelationFilterSchema: z.ZodType<Prisma.TestcaseListRelationFilter> =
  z
    .object({
      every: z.lazy(() => TestcaseWhereInputSchema).optional(),
      some: z.lazy(() => TestcaseWhereInputSchema).optional(),
      none: z.lazy(() => TestcaseWhereInputSchema).optional(),
    })
    .strict();

export const ProblemTagOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProblemTagOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SubmissionOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SubmissionTestcaseOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TestcaseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TestcaseOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemCountOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      problemStatement: z.lazy(() => SortOrderSchema).optional(),
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      isPublic: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemAvgOrderByAggregateInput> =
  z
    .object({
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemMaxOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      isPublic: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemMinOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      isPublic: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemSumOrderByAggregateInput> =
  z
    .object({
      difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
      totalSubmissions: z.lazy(() => SortOrderSchema).optional(),
      acceptedSubmissions: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const UuidWithAggregatesFilterSchema: z.ZodType<Prisma.UuidWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedUuidWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> =
  z
    .object({
      equals: InputJsonValueSchema.optional(),
      path: z.string().array().optional(),
      string_contains: z.string().optional(),
      string_starts_with: z.string().optional(),
      string_ends_with: z.string().optional(),
      array_contains: InputJsonValueSchema.optional().nullable(),
      array_starts_with: InputJsonValueSchema.optional().nullable(),
      array_ends_with: InputJsonValueSchema.optional().nullable(),
      lt: InputJsonValueSchema.optional(),
      lte: InputJsonValueSchema.optional(),
      gt: InputJsonValueSchema.optional(),
      gte: InputJsonValueSchema.optional(),
      not: InputJsonValueSchema.optional(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
    })
    .strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> =
  z
    .object({
      equals: InputJsonValueSchema.optional(),
      path: z.string().array().optional(),
      string_contains: z.string().optional(),
      string_starts_with: z.string().optional(),
      string_ends_with: z.string().optional(),
      array_contains: InputJsonValueSchema.optional().nullable(),
      array_starts_with: InputJsonValueSchema.optional().nullable(),
      array_ends_with: InputJsonValueSchema.optional().nullable(),
      lt: InputJsonValueSchema.optional(),
      lte: InputJsonValueSchema.optional(),
      gt: InputJsonValueSchema.optional(),
      gte: InputJsonValueSchema.optional(),
      not: InputJsonValueSchema.optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedJsonFilterSchema).optional(),
      _max: z.lazy(() => NestedJsonFilterSchema).optional(),
    })
    .strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> =
  z
    .object({
      equals: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      in: z
        .union([
          z.number().array(),
          z.string().array(),
          z.instanceof(Decimal).array(),
          z.instanceof(Prisma.Decimal).array(),
          DecimalJsLikeSchema.array(),
        ])
        .refine(
          (v) =>
            Array.isArray(v) &&
            (v as any[]).every((v) => isValidDecimalInput(v)),
          { message: "Must be a Decimal" },
        )
        .optional(),
      notIn: z
        .union([
          z.number().array(),
          z.string().array(),
          z.instanceof(Decimal).array(),
          z.instanceof(Prisma.Decimal).array(),
          DecimalJsLikeSchema.array(),
        ])
        .refine(
          (v) =>
            Array.isArray(v) &&
            (v as any[]).every((v) => isValidDecimalInput(v)),
          { message: "Must be a Decimal" },
        )
        .optional(),
      lt: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      lte: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      gt: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      gte: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      not: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => NestedDecimalWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
      _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
      _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
      _max: z.lazy(() => NestedDecimalFilterSchema).optional(),
    })
    .strict();

export const UuidNullableWithAggregatesFilterSchema: z.ZodType<Prisma.UuidNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedUuidNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
    })
    .strict();

export const LanguageScalarRelationFilterSchema: z.ZodType<Prisma.LanguageScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => LanguageWhereInputSchema).optional(),
      isNot: z.lazy(() => LanguageWhereInputSchema).optional(),
    })
    .strict();

export const ProblemScalarRelationFilterSchema: z.ZodType<Prisma.ProblemScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => ProblemWhereInputSchema).optional(),
      isNot: z.lazy(() => ProblemWhereInputSchema).optional(),
    })
    .strict();

export const ProblemLanguageProblemIdLanguageIdCompoundUniqueInputSchema: z.ZodType<Prisma.ProblemLanguageProblemIdLanguageIdCompoundUniqueInput> =
  z
    .object({
      problemId: z.string(),
      languageId: z.number(),
    })
    .strict();

export const ProblemLanguageCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemLanguageCountOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemLanguageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemLanguageAvgOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemLanguageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemLanguageMaxOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemLanguageMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemLanguageMinOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      templateCode: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemLanguageSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemLanguageSumOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      timeLimit: z.lazy(() => SortOrderSchema).optional(),
      memoryLimit: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TagScalarRelationFilterSchema: z.ZodType<Prisma.TagScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => TagWhereInputSchema).optional(),
      isNot: z.lazy(() => TagWhereInputSchema).optional(),
    })
    .strict();

export const ProblemTagProblemIdTagIdCompoundUniqueInputSchema: z.ZodType<Prisma.ProblemTagProblemIdTagIdCompoundUniqueInput> =
  z
    .object({
      problemId: z.string(),
      tagId: z.string(),
    })
    .strict();

export const ProblemTagCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagCountOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemTagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagMaxOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProblemTagMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagMinOrderByAggregateInput> =
  z
    .object({
      problemId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionCountOrderByAggregateInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      code: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
      submissionTime: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionAvgOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionMaxOrderByAggregateInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      code: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
      submissionTime: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionMinOrderByAggregateInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      languageId: z.lazy(() => SortOrderSchema).optional(),
      code: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
      submissionTime: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionSumOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionSumOrderByAggregateInput> =
  z
    .object({
      languageId: z.lazy(() => SortOrderSchema).optional(),
      timeExecution: z.lazy(() => SortOrderSchema).optional(),
      memoryUsage: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionScalarRelationFilterSchema: z.ZodType<Prisma.SubmissionScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => SubmissionWhereInputSchema).optional(),
      isNot: z.lazy(() => SubmissionWhereInputSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseSubmissionIdTestcaseIdCompoundUniqueInputSchema: z.ZodType<Prisma.SubmissionTestcaseSubmissionIdTestcaseIdCompoundUniqueInput> =
  z
    .object({
      submissionId: z.string(),
      testcaseId: z.string(),
    })
    .strict();

export const SubmissionTestcaseCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionTestcaseCountOrderByAggregateInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      testcaseId: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      stdout: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionTestcaseAvgOrderByAggregateInput> =
  z
    .object({
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionTestcaseMaxOrderByAggregateInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      testcaseId: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      stdout: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionTestcaseMinOrderByAggregateInput> =
  z
    .object({
      submissionId: z.lazy(() => SortOrderSchema).optional(),
      testcaseId: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      stdout: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseSumOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionTestcaseSumOrderByAggregateInput> =
  z
    .object({
      runtime: z.lazy(() => SortOrderSchema).optional(),
      memoryUsed: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TagCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagCountOrderByAggregateInput> =
  z
    .object({
      tagId: z.lazy(() => SortOrderSchema).optional(),
      tagName: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagMaxOrderByAggregateInput> =
  z
    .object({
      tagId: z.lazy(() => SortOrderSchema).optional(),
      tagName: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TagMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagMinOrderByAggregateInput> =
  z
    .object({
      tagId: z.lazy(() => SortOrderSchema).optional(),
      tagName: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TestcaseCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestcaseCountOrderByAggregateInput> =
  z
    .object({
      testCaseId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      inputData: z.lazy(() => SortOrderSchema).optional(),
      expectedOutput: z.lazy(() => SortOrderSchema).optional(),
      isSample: z.lazy(() => SortOrderSchema).optional(),
      points: z.lazy(() => SortOrderSchema).optional(),
      label: z.lazy(() => SortOrderSchema).optional(),
      explanation: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TestcaseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TestcaseAvgOrderByAggregateInput> =
  z
    .object({
      points: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TestcaseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestcaseMaxOrderByAggregateInput> =
  z
    .object({
      testCaseId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      inputData: z.lazy(() => SortOrderSchema).optional(),
      expectedOutput: z.lazy(() => SortOrderSchema).optional(),
      isSample: z.lazy(() => SortOrderSchema).optional(),
      points: z.lazy(() => SortOrderSchema).optional(),
      label: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TestcaseMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestcaseMinOrderByAggregateInput> =
  z
    .object({
      testCaseId: z.lazy(() => SortOrderSchema).optional(),
      problemId: z.lazy(() => SortOrderSchema).optional(),
      inputData: z.lazy(() => SortOrderSchema).optional(),
      expectedOutput: z.lazy(() => SortOrderSchema).optional(),
      isSample: z.lazy(() => SortOrderSchema).optional(),
      points: z.lazy(() => SortOrderSchema).optional(),
      label: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      deletedAt: z.lazy(() => SortOrderSchema).optional(),
      createdBy: z.lazy(() => SortOrderSchema).optional(),
      updatedBy: z.lazy(() => SortOrderSchema).optional(),
      deletedBy: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const TestcaseSumOrderByAggregateInputSchema: z.ZodType<Prisma.TestcaseSumOrderByAggregateInput> =
  z
    .object({
      points: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AccountCreateManyUserInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SessionCreateManyUserInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),
          z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AccountCreateManyUserInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SessionCreateManyUserInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),
          z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional(),
    })
    .strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional().nullable(),
    })
    .strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> =
  z
    .object({
      set: z.coerce.date().optional().nullable(),
    })
    .strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
  z
    .object({
      set: z.coerce.date().optional(),
    })
    .strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AccountCreateManyUserInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
          z
            .lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => AccountScalarWhereInputSchema),
          z.lazy(() => AccountScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SessionCreateManyUserInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
          z
            .lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SessionScalarWhereInputSchema),
          z.lazy(() => SessionScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthenticatorUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),
          z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema,
          ),
          z
            .lazy(
              () => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema,
          ),
          z
            .lazy(
              () => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => AuthenticatorScalarWhereInputSchema),
          z.lazy(() => AuthenticatorScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AccountCreateManyUserInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
          z
            .lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => AccountScalarWhereInputSchema),
          z.lazy(() => AccountScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SessionCreateManyUserInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
          z
            .lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
          z
            .lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SessionScalarWhereInputSchema),
          z.lazy(() => SessionScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),
          z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),
          z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema,
          ),
          z
            .lazy(
              () => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => AuthenticatorWhereUniqueInputSchema),
          z.lazy(() => AuthenticatorWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema,
          ),
          z
            .lazy(
              () => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema),
          z
            .lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => AuthenticatorScalarWhereInputSchema),
          z.lazy(() => AuthenticatorScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAccountsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutAccountsInputSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> =
  z
    .object({
      set: z.number().optional().nullable(),
      increment: z.number().optional(),
      decrement: z.number().optional(),
      multiply: z.number().optional(),
      divide: z.number().optional(),
    })
    .strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAccountsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutAccountsInputSchema)
        .optional(),
      upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),
          z.lazy(() => UserUpdateWithoutAccountsInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutSessionsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutSessionsInputSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutSessionsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutSessionsInputSchema)
        .optional(),
      upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),
          z.lazy(() => UserUpdateWithoutSessionsInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const UserCreateNestedOneWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAuthenticatorInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutAuthenticatorInputSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> =
  z
    .object({
      set: z.number().optional(),
      increment: z.number().optional(),
      decrement: z.number().optional(),
      multiply: z.number().optional(),
      divide: z.number().optional(),
    })
    .strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> =
  z
    .object({
      set: z.boolean().optional(),
    })
    .strict();

export const UserUpdateOneRequiredWithoutAuthenticatorNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAuthenticatorNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutAuthenticatorInputSchema)
        .optional(),
      upsert: z
        .lazy(() => UserUpsertWithoutAuthenticatorInputSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutAuthenticatorInputSchema),
          z.lazy(() => UserUpdateWithoutAuthenticatorInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutAuthenticatorInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateNestedManyWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageCreateNestedManyWithoutLanguageInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema).array(),
          z.lazy(
            () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyLanguageInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedCreateNestedManyWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedCreateNestedManyWithoutLanguageInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema).array(),
          z.lazy(
            () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyLanguageInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUpdateManyWithoutLanguageNestedInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateManyWithoutLanguageNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema).array(),
          z.lazy(
            () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              ProblemLanguageUpsertWithWhereUniqueWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpsertWithWhereUniqueWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyLanguageInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              ProblemLanguageUpdateWithWhereUniqueWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpdateWithWhereUniqueWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => ProblemLanguageUpdateManyWithWhereWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpdateManyWithWhereWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereInputSchema),
          z.lazy(() => ProblemLanguageScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateManyWithoutLanguageNestedInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateManyWithoutLanguageNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema).array(),
          z.lazy(
            () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageCreateOrConnectWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              ProblemLanguageUpsertWithWhereUniqueWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpsertWithWhereUniqueWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyLanguageInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              ProblemLanguageUpdateWithWhereUniqueWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpdateWithWhereUniqueWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => ProblemLanguageUpdateManyWithWhereWithoutLanguageInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpdateManyWithWhereWithoutLanguageInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereInputSchema),
          z.lazy(() => ProblemLanguageScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema),
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),
          z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema),
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema).array(),
          z.lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema),
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),
          z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUncheckedCreateNestedManyWithoutProblemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema),
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema).array(),
          z.lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> =
  z
    .object({
      set: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      increment: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      decrement: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      multiply: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      divide: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemLanguageUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => ProblemLanguageUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemLanguageUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => ProblemLanguageUpdateManyWithWhereWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageUpdateManyWithWhereWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereInputSchema),
          z.lazy(() => ProblemLanguageScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemTagScalarWhereInputSchema),
          z.lazy(() => ProblemTagScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema),
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),
          z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SubmissionScalarWhereInputSchema),
          z.lazy(() => SubmissionScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateManyWithWhereWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateManyWithWhereWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.TestcaseUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema),
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema).array(),
          z.lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TestcaseUpsertWithWhereUniqueWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUpsertWithWhereUniqueWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TestcaseUpdateWithWhereUniqueWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUpdateWithWhereUniqueWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TestcaseUpdateManyWithWhereWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUpdateManyWithWhereWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TestcaseScalarWhereInputSchema),
          z.lazy(() => TestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemLanguageCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => ProblemLanguageUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemLanguageCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
          z.lazy(() => ProblemLanguageWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemLanguageUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                ProblemLanguageUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => ProblemLanguageUpdateManyWithWhereWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => ProblemLanguageUpdateManyWithWhereWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereInputSchema),
          z.lazy(() => ProblemLanguageScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),
          z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema),
          z
            .lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemTagScalarWhereInputSchema),
          z.lazy(() => ProblemTagScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema),
          z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),
          z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionWhereUniqueInputSchema),
          z.lazy(() => SubmissionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SubmissionScalarWhereInputSchema),
          z.lazy(() => SubmissionScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () => SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpsertWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpsertWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateWithWhereUniqueWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateWithWhereUniqueWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateManyWithWhereWithoutProblemInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateManyWithWhereWithoutProblemInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.TestcaseUncheckedUpdateManyWithoutProblemNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema),
          z.lazy(() => TestcaseCreateWithoutProblemInputSchema).array(),
          z.lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseCreateOrConnectWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TestcaseUpsertWithWhereUniqueWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUpsertWithWhereUniqueWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TestcaseCreateManyProblemInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TestcaseWhereUniqueInputSchema),
          z.lazy(() => TestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TestcaseUpdateWithWhereUniqueWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUpdateWithWhereUniqueWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TestcaseUpdateManyWithWhereWithoutProblemInputSchema),
          z
            .lazy(() => TestcaseUpdateManyWithWhereWithoutProblemInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TestcaseScalarWhereInputSchema),
          z.lazy(() => TestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const LanguageCreateNestedOneWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageCreateNestedOneWithoutProblemLanguagesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => LanguageCreateWithoutProblemLanguagesInputSchema),
          z.lazy(
            () => LanguageUncheckedCreateWithoutProblemLanguagesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => LanguageCreateOrConnectWithoutProblemLanguagesInputSchema)
        .optional(),
      connect: z.lazy(() => LanguageWhereUniqueInputSchema).optional(),
    })
    .strict();

export const ProblemCreateNestedOneWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutProblemLanguagesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutProblemLanguagesInputSchema),
          z.lazy(
            () => ProblemUncheckedCreateWithoutProblemLanguagesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutProblemLanguagesInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
    })
    .strict();

export const LanguageUpdateOneRequiredWithoutProblemLanguagesNestedInputSchema: z.ZodType<Prisma.LanguageUpdateOneRequiredWithoutProblemLanguagesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => LanguageCreateWithoutProblemLanguagesInputSchema),
          z.lazy(
            () => LanguageUncheckedCreateWithoutProblemLanguagesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => LanguageCreateOrConnectWithoutProblemLanguagesInputSchema)
        .optional(),
      upsert: z
        .lazy(() => LanguageUpsertWithoutProblemLanguagesInputSchema)
        .optional(),
      connect: z.lazy(() => LanguageWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () =>
              LanguageUpdateToOneWithWhereWithoutProblemLanguagesInputSchema,
          ),
          z.lazy(() => LanguageUpdateWithoutProblemLanguagesInputSchema),
          z.lazy(
            () => LanguageUncheckedUpdateWithoutProblemLanguagesInputSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const ProblemUpdateOneRequiredWithoutProblemLanguagesNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutProblemLanguagesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutProblemLanguagesInputSchema),
          z.lazy(
            () => ProblemUncheckedCreateWithoutProblemLanguagesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutProblemLanguagesInputSchema)
        .optional(),
      upsert: z
        .lazy(() => ProblemUpsertWithoutProblemLanguagesInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemUpdateToOneWithWhereWithoutProblemLanguagesInputSchema,
          ),
          z.lazy(() => ProblemUpdateWithoutProblemLanguagesInputSchema),
          z.lazy(
            () => ProblemUncheckedUpdateWithoutProblemLanguagesInputSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const ProblemCreateNestedOneWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutProblemTagsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutProblemTagsInputSchema),
          z.lazy(() => ProblemUncheckedCreateWithoutProblemTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutProblemTagsInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
    })
    .strict();

export const TagCreateNestedOneWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagCreateNestedOneWithoutProblemTagsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutProblemTagsInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutProblemTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => TagCreateOrConnectWithoutProblemTagsInputSchema)
        .optional(),
      connect: z.lazy(() => TagWhereUniqueInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateOneRequiredWithoutProblemTagsNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutProblemTagsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutProblemTagsInputSchema),
          z.lazy(() => ProblemUncheckedCreateWithoutProblemTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutProblemTagsInputSchema)
        .optional(),
      upsert: z
        .lazy(() => ProblemUpsertWithoutProblemTagsInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemUpdateToOneWithWhereWithoutProblemTagsInputSchema,
          ),
          z.lazy(() => ProblemUpdateWithoutProblemTagsInputSchema),
          z.lazy(() => ProblemUncheckedUpdateWithoutProblemTagsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const TagUpdateOneRequiredWithoutProblemTagsNestedInputSchema: z.ZodType<Prisma.TagUpdateOneRequiredWithoutProblemTagsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutProblemTagsInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutProblemTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => TagCreateOrConnectWithoutProblemTagsInputSchema)
        .optional(),
      upsert: z.lazy(() => TagUpsertWithoutProblemTagsInputSchema).optional(),
      connect: z.lazy(() => TagWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => TagUpdateToOneWithWhereWithoutProblemTagsInputSchema),
          z.lazy(() => TagUpdateWithoutProblemTagsInputSchema),
          z.lazy(() => TagUncheckedUpdateWithoutProblemTagsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemCreateNestedOneWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutSubmissionsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutSubmissionsInputSchema),
          z.lazy(() => ProblemUncheckedCreateWithoutSubmissionsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutSubmissionsInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
    })
    .strict();

export const SubmissionTestcaseCreateNestedManyWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateNestedManyWithoutSubmissionInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManySubmissionInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedCreateNestedManyWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedCreateNestedManyWithoutSubmissionInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManySubmissionInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemUpdateOneRequiredWithoutSubmissionsNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutSubmissionsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutSubmissionsInputSchema),
          z.lazy(() => ProblemUncheckedCreateWithoutSubmissionsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutSubmissionsInputSchema)
        .optional(),
      upsert: z
        .lazy(() => ProblemUpsertWithoutSubmissionsInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => ProblemUpdateToOneWithWhereWithoutSubmissionsInputSchema,
          ),
          z.lazy(() => ProblemUpdateWithoutSubmissionsInputSchema),
          z.lazy(() => ProblemUncheckedUpdateWithoutSubmissionsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUpdateManyWithoutSubmissionNestedInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateManyWithoutSubmissionNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpsertWithWhereUniqueWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpsertWithWhereUniqueWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManySubmissionInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateWithWhereUniqueWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateWithWhereUniqueWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateManyWithWhereWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateManyWithWhereWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionNestedInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema),
          z
            .lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema)
            .array(),
          z.lazy(
            () => SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpsertWithWhereUniqueWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpsertWithWhereUniqueWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SubmissionTestcaseCreateManySubmissionInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
          z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateWithWhereUniqueWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateWithWhereUniqueWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              SubmissionTestcaseUpdateManyWithWhereWithoutSubmissionInputSchema,
          ),
          z
            .lazy(
              () =>
                SubmissionTestcaseUpdateManyWithWhereWithoutSubmissionInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemCreateNestedOneWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutSubmissionTestcasesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutSubmissionTestcasesInputSchema),
          z.lazy(
            () => ProblemUncheckedCreateWithoutSubmissionTestcasesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutSubmissionTestcasesInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
    })
    .strict();

export const SubmissionCreateNestedOneWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionCreateNestedOneWithoutSubmissionTestcasesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionCreateWithoutSubmissionTestcasesInputSchema),
          z.lazy(
            () =>
              SubmissionUncheckedCreateWithoutSubmissionTestcasesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(
          () => SubmissionCreateOrConnectWithoutSubmissionTestcasesInputSchema,
        )
        .optional(),
      connect: z.lazy(() => SubmissionWhereUniqueInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateOneRequiredWithoutSubmissionTestcasesNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutSubmissionTestcasesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutSubmissionTestcasesInputSchema),
          z.lazy(
            () => ProblemUncheckedCreateWithoutSubmissionTestcasesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutSubmissionTestcasesInputSchema)
        .optional(),
      upsert: z
        .lazy(() => ProblemUpsertWithoutSubmissionTestcasesInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () =>
              ProblemUpdateToOneWithWhereWithoutSubmissionTestcasesInputSchema,
          ),
          z.lazy(() => ProblemUpdateWithoutSubmissionTestcasesInputSchema),
          z.lazy(
            () => ProblemUncheckedUpdateWithoutSubmissionTestcasesInputSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const SubmissionUpdateOneRequiredWithoutSubmissionTestcasesNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateOneRequiredWithoutSubmissionTestcasesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SubmissionCreateWithoutSubmissionTestcasesInputSchema),
          z.lazy(
            () =>
              SubmissionUncheckedCreateWithoutSubmissionTestcasesInputSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(
          () => SubmissionCreateOrConnectWithoutSubmissionTestcasesInputSchema,
        )
        .optional(),
      upsert: z
        .lazy(() => SubmissionUpsertWithoutSubmissionTestcasesInputSchema)
        .optional(),
      connect: z.lazy(() => SubmissionWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () =>
              SubmissionUpdateToOneWithWhereWithoutSubmissionTestcasesInputSchema,
          ),
          z.lazy(() => SubmissionUpdateWithoutSubmissionTestcasesInputSchema),
          z.lazy(
            () =>
              SubmissionUncheckedUpdateWithoutSubmissionTestcasesInputSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagCreateNestedManyWithoutTagInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateNestedManyWithoutTagInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithoutTagNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema),
          z
            .lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema),
          z
            .lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema),
          z
            .lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemTagScalarWhereInputSchema),
          z.lazy(() => ProblemTagScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutTagNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema),
          z
            .lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProblemTagWhereUniqueInputSchema),
          z.lazy(() => ProblemTagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema),
          z
            .lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema),
          z
            .lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProblemTagScalarWhereInputSchema),
          z.lazy(() => ProblemTagScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemCreateNestedOneWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutTestcasesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutTestcasesInputSchema),
          z.lazy(() => ProblemUncheckedCreateWithoutTestcasesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutTestcasesInputSchema)
        .optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateOneRequiredWithoutTestcasesNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutTestcasesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProblemCreateWithoutTestcasesInputSchema),
          z.lazy(() => ProblemUncheckedCreateWithoutTestcasesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ProblemCreateOrConnectWithoutTestcasesInputSchema)
        .optional(),
      upsert: z.lazy(() => ProblemUpsertWithoutTestcasesInputSchema).optional(),
      connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => ProblemUpdateToOneWithWhereWithoutTestcasesInputSchema),
          z.lazy(() => ProblemUpdateWithoutTestcasesInputSchema),
          z.lazy(() => ProblemUncheckedUpdateWithoutTestcasesInputSchema),
        ])
        .optional(),
    })
    .strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> =
  z
    .object({
      equals: z.coerce.date().optional().nullable(),
      in: z.coerce.date().array().optional().nullable(),
      notIn: z.coerce.date().array().optional().nullable(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeNullableFilterSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
        .optional(),
    })
    .strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
    })
    .strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional().nullable(),
      in: z.coerce.date().array().optional().nullable(),
      notIn: z.coerce.date().array().optional().nullable(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
    })
    .strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    })
    .strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([
          z.number(),
          z.lazy(() => NestedIntNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
    })
    .strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedFloatNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z
      .union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional(),
      in: z.number().array().optional(),
      notIn: z.number().array().optional(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedIntFilterSchema).optional(),
      _max: z.lazy(() => NestedIntFilterSchema).optional(),
    })
    .strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedFloatFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> =
  z
    .object({
      equals: z.boolean().optional(),
      not: z
        .union([
          z.boolean(),
          z.lazy(() => NestedBoolWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedBoolFilterSchema).optional(),
      _max: z.lazy(() => NestedBoolFilterSchema).optional(),
    })
    .strict();

export const NestedUuidFilterSchema: z.ZodType<Prisma.NestedUuidFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedUuidFilterSchema)]).optional(),
  })
  .strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> =
  z
    .object({
      equals: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      in: z
        .union([
          z.number().array(),
          z.string().array(),
          z.instanceof(Decimal).array(),
          z.instanceof(Prisma.Decimal).array(),
          DecimalJsLikeSchema.array(),
        ])
        .refine(
          (v) =>
            Array.isArray(v) &&
            (v as any[]).every((v) => isValidDecimalInput(v)),
          { message: "Must be a Decimal" },
        )
        .optional(),
      notIn: z
        .union([
          z.number().array(),
          z.string().array(),
          z.instanceof(Decimal).array(),
          z.instanceof(Prisma.Decimal).array(),
          DecimalJsLikeSchema.array(),
        ])
        .refine(
          (v) =>
            Array.isArray(v) &&
            (v as any[]).every((v) => isValidDecimalInput(v)),
          { message: "Must be a Decimal" },
        )
        .optional(),
      lt: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      lte: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      gt: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      gte: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      not: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => NestedDecimalFilterSchema),
        ])
        .optional(),
    })
    .strict();

export const NestedUuidNullableFilterSchema: z.ZodType<Prisma.NestedUuidNullableFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedUuidNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const NestedUuidWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedUuidWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> =
  z
    .object({
      equals: InputJsonValueSchema.optional(),
      path: z.string().array().optional(),
      string_contains: z.string().optional(),
      string_starts_with: z.string().optional(),
      string_ends_with: z.string().optional(),
      array_contains: InputJsonValueSchema.optional().nullable(),
      array_starts_with: InputJsonValueSchema.optional().nullable(),
      array_ends_with: InputJsonValueSchema.optional().nullable(),
      lt: InputJsonValueSchema.optional(),
      lte: InputJsonValueSchema.optional(),
      gt: InputJsonValueSchema.optional(),
      gte: InputJsonValueSchema.optional(),
      not: InputJsonValueSchema.optional(),
    })
    .strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z
  .object({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
  })
  .strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> =
  z
    .object({
      equals: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      in: z
        .union([
          z.number().array(),
          z.string().array(),
          z.instanceof(Decimal).array(),
          z.instanceof(Prisma.Decimal).array(),
          DecimalJsLikeSchema.array(),
        ])
        .refine(
          (v) =>
            Array.isArray(v) &&
            (v as any[]).every((v) => isValidDecimalInput(v)),
          { message: "Must be a Decimal" },
        )
        .optional(),
      notIn: z
        .union([
          z.number().array(),
          z.string().array(),
          z.instanceof(Decimal).array(),
          z.instanceof(Prisma.Decimal).array(),
          DecimalJsLikeSchema.array(),
        ])
        .refine(
          (v) =>
            Array.isArray(v) &&
            (v as any[]).every((v) => isValidDecimalInput(v)),
          { message: "Must be a Decimal" },
        )
        .optional(),
      lt: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      lte: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      gt: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      gte: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      not: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => NestedDecimalWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
      _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
      _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
      _max: z.lazy(() => NestedDecimalFilterSchema).optional(),
    })
    .strict();

export const NestedUuidNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedUuidNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
    })
    .strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> =
  z
    .object({
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> =
  z
    .object({
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => AccountCreateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => AccountCreateManyUserInputSchema),
        z.lazy(() => AccountCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> =
  z
    .object({
      sessionToken: z.string(),
      expires: z.coerce.date(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> =
  z
    .object({
      sessionToken: z.string(),
      expires: z.coerce.date(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => SessionCreateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => SessionCreateManyUserInputSchema),
        z.lazy(() => SessionCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AuthenticatorCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateWithoutUserInput> =
  z
    .object({
      credentialID: z.string(),
      providerAccountId: z.string(),
      credentialPublicKey: z.string(),
      counter: z.number().int(),
      credentialDeviceType: z.string(),
      credentialBackedUp: z.boolean(),
      transports: z.string().optional().nullable(),
    })
    .strict();

export const AuthenticatorUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedCreateWithoutUserInput> =
  z
    .object({
      credentialID: z.string(),
      providerAccountId: z.string(),
      credentialPublicKey: z.string(),
      counter: z.number().int(),
      credentialDeviceType: z.string(),
      credentialBackedUp: z.boolean(),
      transports: z.string().optional().nullable(),
    })
    .strict();

export const AuthenticatorCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AuthenticatorWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),
        z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AuthenticatorCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AuthenticatorCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => AuthenticatorCreateManyUserInputSchema),
        z.lazy(() => AuthenticatorCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => AccountUpdateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => AccountCreateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => AccountUpdateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => AccountUpdateManyMutationInputSchema),
        z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AccountScalarWhereInputSchema),
          z.lazy(() => AccountScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AccountScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AccountScalarWhereInputSchema),
          z.lazy(() => AccountScalarWhereInputSchema).array(),
        ])
        .optional(),
      userId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      provider: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      providerAccountId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      refresh_token: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      access_token: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.lazy(() => IntNullableFilterSchema), z.number()])
        .optional()
        .nullable(),
      token_type: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      scope: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      id_token: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      session_state: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => SessionUpdateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => SessionCreateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => SessionUpdateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => SessionUpdateManyMutationInputSchema),
        z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SessionScalarWhereInputSchema),
          z.lazy(() => SessionScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SessionScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SessionScalarWhereInputSchema),
          z.lazy(() => SessionScalarWhereInputSchema).array(),
        ])
        .optional(),
      sessionToken: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      userId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      expires: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict();

export const AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AuthenticatorWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => AuthenticatorUpdateWithoutUserInputSchema),
        z.lazy(() => AuthenticatorUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),
        z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AuthenticatorWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => AuthenticatorUpdateWithoutUserInputSchema),
        z.lazy(() => AuthenticatorUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AuthenticatorUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AuthenticatorScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => AuthenticatorUpdateManyMutationInputSchema),
        z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict();

export const AuthenticatorScalarWhereInputSchema: z.ZodType<Prisma.AuthenticatorScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AuthenticatorScalarWhereInputSchema),
          z.lazy(() => AuthenticatorScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AuthenticatorScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AuthenticatorScalarWhereInputSchema),
          z.lazy(() => AuthenticatorScalarWhereInputSchema).array(),
        ])
        .optional(),
      credentialID: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      userId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      providerAccountId: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      credentialPublicKey: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      counter: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      credentialDeviceType: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      credentialBackedUp: z
        .union([z.lazy(() => BoolFilterSchema), z.boolean()])
        .optional(),
      transports: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
    })
    .strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      sessions: z
        .lazy(() => SessionCreateNestedManyWithoutUserInputSchema)
        .optional(),
      Authenticator: z
        .lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema)
        .optional(),
    })
    .strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      sessions: z
        .lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      Authenticator: z
        .lazy(
          () => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema,
        )
        .optional(),
    })
    .strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
      ]),
    })
    .strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
      ]),
    })
    .strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sessions: z
        .lazy(() => SessionUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      Authenticator: z
        .lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema)
        .optional(),
    })
    .strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sessions: z
        .lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      Authenticator: z
        .lazy(
          () => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      accounts: z
        .lazy(() => AccountCreateNestedManyWithoutUserInputSchema)
        .optional(),
      Authenticator: z
        .lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema)
        .optional(),
    })
    .strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      accounts: z
        .lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      Authenticator: z
        .lazy(
          () => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema,
        )
        .optional(),
    })
    .strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
      ]),
    })
    .strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
      ]),
    })
    .strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      accounts: z
        .lazy(() => AccountUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      Authenticator: z
        .lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema)
        .optional(),
    })
    .strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      accounts: z
        .lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      Authenticator: z
        .lazy(
          () => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const UserCreateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserCreateWithoutAuthenticatorInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      accounts: z
        .lazy(() => AccountCreateNestedManyWithoutUserInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionCreateNestedManyWithoutUserInputSchema)
        .optional(),
    })
    .strict();

export const UserUncheckedCreateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAuthenticatorInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      hashPassword: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      accounts: z
        .lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
    })
    .strict();

export const UserCreateOrConnectWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAuthenticatorInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema),
      ]),
    })
    .strict();

export const UserUpsertWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUpsertWithoutAuthenticatorInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutAuthenticatorInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAuthenticatorInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict();

export const UserUpdateToOneWithWhereWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAuthenticatorInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutAuthenticatorInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAuthenticatorInputSchema),
      ]),
    })
    .strict();

export const UserUpdateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUpdateWithoutAuthenticatorInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      accounts: z
        .lazy(() => AccountUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionUpdateManyWithoutUserNestedInputSchema)
        .optional(),
    })
    .strict();

export const UserUncheckedUpdateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAuthenticatorInput> =
  z
    .object({
      id: z
        .union([
          z.string().cuid(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      hashPassword: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      accounts: z
        .lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageCreateWithoutLanguageInput> =
  z
    .object({
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutProblemLanguagesInputSchema,
      ),
    })
    .strict();

export const ProblemLanguageUncheckedCreateWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedCreateWithoutLanguageInput> =
  z
    .object({
      problemId: z.string(),
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateOrConnectWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageCreateOrConnectWithoutLanguageInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema),
        z.lazy(() => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema),
      ]),
    })
    .strict();

export const ProblemLanguageCreateManyLanguageInputEnvelopeSchema: z.ZodType<Prisma.ProblemLanguageCreateManyLanguageInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => ProblemLanguageCreateManyLanguageInputSchema),
        z.lazy(() => ProblemLanguageCreateManyLanguageInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemLanguageUpsertWithWhereUniqueWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUpsertWithWhereUniqueWithoutLanguageInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => ProblemLanguageUpdateWithoutLanguageInputSchema),
        z.lazy(() => ProblemLanguageUncheckedUpdateWithoutLanguageInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemLanguageCreateWithoutLanguageInputSchema),
        z.lazy(() => ProblemLanguageUncheckedCreateWithoutLanguageInputSchema),
      ]),
    })
    .strict();

export const ProblemLanguageUpdateWithWhereUniqueWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateWithWhereUniqueWithoutLanguageInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => ProblemLanguageUpdateWithoutLanguageInputSchema),
        z.lazy(() => ProblemLanguageUncheckedUpdateWithoutLanguageInputSchema),
      ]),
    })
    .strict();

export const ProblemLanguageUpdateManyWithWhereWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateManyWithWhereWithoutLanguageInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => ProblemLanguageUpdateManyMutationInputSchema),
        z.lazy(
          () => ProblemLanguageUncheckedUpdateManyWithoutLanguageInputSchema,
        ),
      ]),
    })
    .strict();

export const ProblemLanguageScalarWhereInputSchema: z.ZodType<Prisma.ProblemLanguageScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereInputSchema),
          z.lazy(() => ProblemLanguageScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemLanguageScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemLanguageScalarWhereInputSchema),
          z.lazy(() => ProblemLanguageScalarWhereInputSchema).array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
      templateCode: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageCreateWithoutProblemInput> =
  z
    .object({
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      language: z.lazy(
        () => LanguageCreateNestedOneWithoutProblemLanguagesInputSchema,
      ),
    })
    .strict();

export const ProblemLanguageUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedCreateWithoutProblemInput> =
  z
    .object({
      languageId: z.number().int(),
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageCreateOrConnectWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema),
        z.lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemLanguageCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.ProblemLanguageCreateManyProblemInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => ProblemLanguageCreateManyProblemInputSchema),
        z.lazy(() => ProblemLanguageCreateManyProblemInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemTagCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateWithoutProblemInput> =
  z
    .object({
      tag: z.lazy(() => TagCreateNestedOneWithoutProblemTagsInputSchema),
    })
    .strict();

export const ProblemTagUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateWithoutProblemInput> =
  z
    .object({
      tagId: z.string(),
    })
    .strict();

export const ProblemTagCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateOrConnectWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),
        z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemTagCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.ProblemTagCreateManyProblemInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => ProblemTagCreateManyProblemInputSchema),
        z.lazy(() => ProblemTagCreateManyProblemInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SubmissionCreateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutProblemInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      submissionTestcases: z
        .lazy(
          () => SubmissionTestcaseCreateNestedManyWithoutSubmissionInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutProblemInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutSubmissionInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => SubmissionCreateWithoutProblemInputSchema),
        z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const SubmissionCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.SubmissionCreateManyProblemInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => SubmissionCreateManyProblemInputSchema),
        z.lazy(() => SubmissionCreateManyProblemInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SubmissionTestcaseCreateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateWithoutProblemInput> =
  z
    .object({
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submission: z.lazy(
        () => SubmissionCreateNestedOneWithoutSubmissionTestcasesInputSchema,
      ),
    })
    .strict();

export const SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedCreateWithoutProblemInput> =
  z
    .object({
      submissionId: z.string(),
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const SubmissionTestcaseCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateOrConnectWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManyProblemInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => SubmissionTestcaseCreateManyProblemInputSchema),
        z.lazy(() => SubmissionTestcaseCreateManyProblemInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const TestcaseCreateWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseCreateWithoutProblemInput> =
  z
    .object({
      testCaseId: z.string().optional(),
      inputData: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      points: z.number().int().optional(),
      label: z.string().optional().nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const TestcaseUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUncheckedCreateWithoutProblemInput> =
  z
    .object({
      testCaseId: z.string().optional(),
      inputData: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      points: z.number().int().optional(),
      label: z.string().optional().nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const TestcaseCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseCreateOrConnectWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => TestcaseWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => TestcaseCreateWithoutProblemInputSchema),
        z.lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const TestcaseCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.TestcaseCreateManyProblemInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => TestcaseCreateManyProblemInputSchema),
        z.lazy(() => TestcaseCreateManyProblemInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemLanguageUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUpsertWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => ProblemLanguageUpdateWithoutProblemInputSchema),
        z.lazy(() => ProblemLanguageUncheckedUpdateWithoutProblemInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemLanguageCreateWithoutProblemInputSchema),
        z.lazy(() => ProblemLanguageUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemLanguageUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => ProblemLanguageUpdateWithoutProblemInputSchema),
        z.lazy(() => ProblemLanguageUncheckedUpdateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemLanguageUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateManyWithWhereWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemLanguageScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => ProblemLanguageUpdateManyMutationInputSchema),
        z.lazy(
          () => ProblemLanguageUncheckedUpdateManyWithoutProblemInputSchema,
        ),
      ]),
    })
    .strict();

export const ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpsertWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => ProblemTagUpdateWithoutProblemInputSchema),
        z.lazy(() => ProblemTagUncheckedUpdateWithoutProblemInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),
        z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => ProblemTagUpdateWithoutProblemInputSchema),
        z.lazy(() => ProblemTagUncheckedUpdateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemTagUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithWhereWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => ProblemTagUpdateManyMutationInputSchema),
        z.lazy(() => ProblemTagUncheckedUpdateManyWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const ProblemTagScalarWhereInputSchema: z.ZodType<Prisma.ProblemTagScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ProblemTagScalarWhereInputSchema),
          z.lazy(() => ProblemTagScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ProblemTagScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ProblemTagScalarWhereInputSchema),
          z.lazy(() => ProblemTagScalarWhereInputSchema).array(),
        ])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      tagId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
    })
    .strict();

export const SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => SubmissionUpdateWithoutProblemInputSchema),
        z.lazy(() => SubmissionUncheckedUpdateWithoutProblemInputSchema),
      ]),
      create: z.union([
        z.lazy(() => SubmissionCreateWithoutProblemInputSchema),
        z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => SubmissionUpdateWithoutProblemInputSchema),
        z.lazy(() => SubmissionUncheckedUpdateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const SubmissionUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => SubmissionUpdateManyMutationInputSchema),
        z.lazy(() => SubmissionUncheckedUpdateManyWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const SubmissionScalarWhereInputSchema: z.ZodType<Prisma.SubmissionScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SubmissionScalarWhereInputSchema),
          z.lazy(() => SubmissionScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SubmissionScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SubmissionScalarWhereInputSchema),
          z.lazy(() => SubmissionScalarWhereInputSchema).array(),
        ])
        .optional(),
      submissionId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      userId: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      languageId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
      code: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      status: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      timeExecution: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      submissionTime: z
        .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      deletedAt: z
        .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      createdBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      updatedBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      deletedBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
    })
    .strict();

export const SubmissionTestcaseUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpsertWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => SubmissionTestcaseUpdateWithoutProblemInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedUpdateWithoutProblemInputSchema,
        ),
      ]),
      create: z.union([
        z.lazy(() => SubmissionTestcaseCreateWithoutProblemInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedCreateWithoutProblemInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => SubmissionTestcaseUpdateWithoutProblemInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedUpdateWithoutProblemInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateManyWithWhereWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => SubmissionTestcaseUpdateManyMutationInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedUpdateManyWithoutProblemInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseScalarWhereInputSchema: z.ZodType<Prisma.SubmissionTestcaseScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SubmissionTestcaseScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
          z.lazy(() => SubmissionTestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
      submissionId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      testcaseId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      status: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      stdout: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      runtime: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z.lazy(() => DecimalFilterSchema),
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
        ])
        .optional(),
    })
    .strict();

export const TestcaseUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUpsertWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => TestcaseWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => TestcaseUpdateWithoutProblemInputSchema),
        z.lazy(() => TestcaseUncheckedUpdateWithoutProblemInputSchema),
      ]),
      create: z.union([
        z.lazy(() => TestcaseCreateWithoutProblemInputSchema),
        z.lazy(() => TestcaseUncheckedCreateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const TestcaseUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUpdateWithWhereUniqueWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => TestcaseWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => TestcaseUpdateWithoutProblemInputSchema),
        z.lazy(() => TestcaseUncheckedUpdateWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const TestcaseUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUpdateManyWithWhereWithoutProblemInput> =
  z
    .object({
      where: z.lazy(() => TestcaseScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => TestcaseUpdateManyMutationInputSchema),
        z.lazy(() => TestcaseUncheckedUpdateManyWithoutProblemInputSchema),
      ]),
    })
    .strict();

export const TestcaseScalarWhereInputSchema: z.ZodType<Prisma.TestcaseScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => TestcaseScalarWhereInputSchema),
          z.lazy(() => TestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => TestcaseScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => TestcaseScalarWhereInputSchema),
          z.lazy(() => TestcaseScalarWhereInputSchema).array(),
        ])
        .optional(),
      testCaseId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      problemId: z
        .union([z.lazy(() => UuidFilterSchema), z.string()])
        .optional(),
      inputData: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      expectedOutput: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      isSample: z
        .union([z.lazy(() => BoolFilterSchema), z.boolean()])
        .optional(),
      points: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      label: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      explanation: z.lazy(() => JsonNullableFilterSchema).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      deletedAt: z
        .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      createdBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      updatedBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      deletedBy: z
        .union([z.lazy(() => UuidNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
    })
    .strict();

export const LanguageCreateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageCreateWithoutProblemLanguagesInput> =
  z
    .object({
      languageName: z.string(),
      version: z.string(),
      sourceFileExt: z.string(),
      binaryFileExt: z.string().optional().nullable(),
      compileCommand: z.string().optional().nullable(),
      runCommand: z.string(),
      isActive: z.boolean().optional(),
      canDelete: z.boolean().optional(),
      monacoCodeLanguage: z.string().optional().nullable(),
      templateCode: z.string().optional(),
    })
    .strict();

export const LanguageUncheckedCreateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageUncheckedCreateWithoutProblemLanguagesInput> =
  z
    .object({
      languageId: z.number().int().optional(),
      languageName: z.string(),
      version: z.string(),
      sourceFileExt: z.string(),
      binaryFileExt: z.string().optional().nullable(),
      compileCommand: z.string().optional().nullable(),
      runCommand: z.string(),
      isActive: z.boolean().optional(),
      canDelete: z.boolean().optional(),
      monacoCodeLanguage: z.string().optional().nullable(),
      templateCode: z.string().optional(),
    })
    .strict();

export const LanguageCreateOrConnectWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageCreateOrConnectWithoutProblemLanguagesInput> =
  z
    .object({
      where: z.lazy(() => LanguageWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => LanguageCreateWithoutProblemLanguagesInputSchema),
        z.lazy(() => LanguageUncheckedCreateWithoutProblemLanguagesInputSchema),
      ]),
    })
    .strict();

export const ProblemCreateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemCreateWithoutProblemLanguagesInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemTags: z
        .lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedCreateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutProblemLanguagesInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemCreateOrConnectWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutProblemLanguagesInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutProblemLanguagesInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutProblemLanguagesInputSchema),
      ]),
    })
    .strict();

export const LanguageUpsertWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageUpsertWithoutProblemLanguagesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => LanguageUpdateWithoutProblemLanguagesInputSchema),
        z.lazy(() => LanguageUncheckedUpdateWithoutProblemLanguagesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => LanguageCreateWithoutProblemLanguagesInputSchema),
        z.lazy(() => LanguageUncheckedCreateWithoutProblemLanguagesInputSchema),
      ]),
      where: z.lazy(() => LanguageWhereInputSchema).optional(),
    })
    .strict();

export const LanguageUpdateToOneWithWhereWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageUpdateToOneWithWhereWithoutProblemLanguagesInput> =
  z
    .object({
      where: z.lazy(() => LanguageWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => LanguageUpdateWithoutProblemLanguagesInputSchema),
        z.lazy(() => LanguageUncheckedUpdateWithoutProblemLanguagesInputSchema),
      ]),
    })
    .strict();

export const LanguageUpdateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageUpdateWithoutProblemLanguagesInput> =
  z
    .object({
      languageName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      version: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sourceFileExt: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      binaryFileExt: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      canDelete: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const LanguageUncheckedUpdateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.LanguageUncheckedUpdateWithoutProblemLanguagesInput> =
  z
    .object({
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      version: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      sourceFileExt: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      binaryFileExt: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      compileCommand: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runCommand: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      canDelete: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      monacoCodeLanguage: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemUpsertWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutProblemLanguagesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => ProblemUpdateWithoutProblemLanguagesInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutProblemLanguagesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutProblemLanguagesInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutProblemLanguagesInputSchema),
      ]),
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateToOneWithWhereWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutProblemLanguagesInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => ProblemUpdateWithoutProblemLanguagesInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutProblemLanguagesInputSchema),
      ]),
    })
    .strict();

export const ProblemUpdateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutProblemLanguagesInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemTags: z
        .lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedUpdateWithoutProblemLanguagesInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutProblemLanguagesInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemCreateWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemCreateWithoutProblemTagsInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedCreateWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutProblemTagsInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemCreateOrConnectWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutProblemTagsInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutProblemTagsInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutProblemTagsInputSchema),
      ]),
    })
    .strict();

export const TagCreateWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagCreateWithoutProblemTagsInput> =
  z
    .object({
      tagId: z.string().optional(),
      tagName: z.string(),
      description: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      createdBy: z.string().optional().nullable(),
    })
    .strict();

export const TagUncheckedCreateWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutProblemTagsInput> =
  z
    .object({
      tagId: z.string().optional(),
      tagName: z.string(),
      description: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      createdBy: z.string().optional().nullable(),
    })
    .strict();

export const TagCreateOrConnectWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutProblemTagsInput> =
  z
    .object({
      where: z.lazy(() => TagWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => TagCreateWithoutProblemTagsInputSchema),
        z.lazy(() => TagUncheckedCreateWithoutProblemTagsInputSchema),
      ]),
    })
    .strict();

export const ProblemUpsertWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutProblemTagsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => ProblemUpdateWithoutProblemTagsInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutProblemTagsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutProblemTagsInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutProblemTagsInputSchema),
      ]),
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateToOneWithWhereWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutProblemTagsInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => ProblemUpdateWithoutProblemTagsInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutProblemTagsInputSchema),
      ]),
    })
    .strict();

export const ProblemUpdateWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutProblemTagsInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedUpdateWithoutProblemTagsInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutProblemTagsInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const TagUpsertWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagUpsertWithoutProblemTagsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => TagUpdateWithoutProblemTagsInputSchema),
        z.lazy(() => TagUncheckedUpdateWithoutProblemTagsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => TagCreateWithoutProblemTagsInputSchema),
        z.lazy(() => TagUncheckedCreateWithoutProblemTagsInputSchema),
      ]),
      where: z.lazy(() => TagWhereInputSchema).optional(),
    })
    .strict();

export const TagUpdateToOneWithWhereWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutProblemTagsInput> =
  z
    .object({
      where: z.lazy(() => TagWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => TagUpdateWithoutProblemTagsInputSchema),
        z.lazy(() => TagUncheckedUpdateWithoutProblemTagsInputSchema),
      ]),
    })
    .strict();

export const TagUpdateWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagUpdateWithoutProblemTagsInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TagUncheckedUpdateWithoutProblemTagsInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutProblemTagsInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      tagName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const ProblemCreateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemCreateWithoutSubmissionsInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedCreateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutSubmissionsInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemCreateOrConnectWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutSubmissionsInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutSubmissionsInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutSubmissionsInputSchema),
      ]),
    })
    .strict();

export const SubmissionTestcaseCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateWithoutSubmissionInput> =
  z
    .object({
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutSubmissionTestcasesInputSchema,
      ),
    })
    .strict();

export const SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedCreateWithoutSubmissionInput> =
  z
    .object({
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      problemId: z.string(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const SubmissionTestcaseCreateOrConnectWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateOrConnectWithoutSubmissionInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseCreateManySubmissionInputEnvelopeSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManySubmissionInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => SubmissionTestcaseCreateManySubmissionInputSchema),
        z.lazy(() => SubmissionTestcaseCreateManySubmissionInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemUpsertWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutSubmissionsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => ProblemUpdateWithoutSubmissionsInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutSubmissionsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutSubmissionsInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutSubmissionsInputSchema),
      ]),
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateToOneWithWhereWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutSubmissionsInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => ProblemUpdateWithoutSubmissionsInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutSubmissionsInputSchema),
      ]),
    })
    .strict();

export const ProblemUpdateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutSubmissionsInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedUpdateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutSubmissionsInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUpsertWithWhereUniqueWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpsertWithWhereUniqueWithoutSubmissionInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => SubmissionTestcaseUpdateWithoutSubmissionInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedUpdateWithoutSubmissionInputSchema,
        ),
      ]),
      create: z.union([
        z.lazy(() => SubmissionTestcaseCreateWithoutSubmissionInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedCreateWithoutSubmissionInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseUpdateWithWhereUniqueWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateWithWhereUniqueWithoutSubmissionInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => SubmissionTestcaseUpdateWithoutSubmissionInputSchema),
        z.lazy(
          () => SubmissionTestcaseUncheckedUpdateWithoutSubmissionInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionTestcaseUpdateManyWithWhereWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateManyWithWhereWithoutSubmissionInput> =
  z
    .object({
      where: z.lazy(() => SubmissionTestcaseScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => SubmissionTestcaseUpdateManyMutationInputSchema),
        z.lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionInputSchema,
        ),
      ]),
    })
    .strict();

export const ProblemCreateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemCreateWithoutSubmissionTestcasesInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedCreateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutSubmissionTestcasesInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemCreateOrConnectWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutSubmissionTestcasesInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => ProblemUncheckedCreateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionCreateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutSubmissionTestcasesInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutSubmissionsInputSchema,
      ),
    })
    .strict();

export const SubmissionUncheckedCreateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutSubmissionTestcasesInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      problemId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const SubmissionCreateOrConnectWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutSubmissionTestcasesInput> =
  z
    .object({
      where: z.lazy(() => SubmissionWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => SubmissionCreateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => SubmissionUncheckedCreateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
    })
    .strict();

export const ProblemUpsertWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutSubmissionTestcasesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => ProblemUpdateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => ProblemUncheckedUpdateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => ProblemUncheckedCreateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateToOneWithWhereWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutSubmissionTestcasesInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => ProblemUpdateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => ProblemUncheckedUpdateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
    })
    .strict();

export const ProblemUpdateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutSubmissionTestcasesInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      testcases: z
        .lazy(() => TestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedUpdateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutSubmissionTestcasesInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      testcases: z
        .lazy(() => TestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const SubmissionUpsertWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionUpsertWithoutSubmissionTestcasesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => SubmissionUpdateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => SubmissionUncheckedUpdateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
      create: z.union([
        z.lazy(() => SubmissionCreateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => SubmissionUncheckedCreateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
      where: z.lazy(() => SubmissionWhereInputSchema).optional(),
    })
    .strict();

export const SubmissionUpdateToOneWithWhereWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionUpdateToOneWithWhereWithoutSubmissionTestcasesInput> =
  z
    .object({
      where: z.lazy(() => SubmissionWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => SubmissionUpdateWithoutSubmissionTestcasesInputSchema),
        z.lazy(
          () => SubmissionUncheckedUpdateWithoutSubmissionTestcasesInputSchema,
        ),
      ]),
    })
    .strict();

export const SubmissionUpdateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutSubmissionTestcasesInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problem: z
        .lazy(() => ProblemUpdateOneRequiredWithoutSubmissionsNestedInputSchema)
        .optional(),
    })
    .strict();

export const SubmissionUncheckedUpdateWithoutSubmissionTestcasesInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutSubmissionTestcasesInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const ProblemTagCreateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagCreateWithoutTagInput> =
  z
    .object({
      problem: z.lazy(
        () => ProblemCreateNestedOneWithoutProblemTagsInputSchema,
      ),
    })
    .strict();

export const ProblemTagUncheckedCreateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateWithoutTagInput> =
  z
    .object({
      problemId: z.string(),
    })
    .strict();

export const ProblemTagCreateOrConnectWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagCreateOrConnectWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemTagCreateWithoutTagInputSchema),
        z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),
      ]),
    })
    .strict();

export const ProblemTagCreateManyTagInputEnvelopeSchema: z.ZodType<Prisma.ProblemTagCreateManyTagInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => ProblemTagCreateManyTagInputSchema),
        z.lazy(() => ProblemTagCreateManyTagInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpsertWithWhereUniqueWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => ProblemTagUpdateWithoutTagInputSchema),
        z.lazy(() => ProblemTagUncheckedUpdateWithoutTagInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemTagCreateWithoutTagInputSchema),
        z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),
      ]),
    })
    .strict();

export const ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithWhereUniqueWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => ProblemTagUpdateWithoutTagInputSchema),
        z.lazy(() => ProblemTagUncheckedUpdateWithoutTagInputSchema),
      ]),
    })
    .strict();

export const ProblemTagUpdateManyWithWhereWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithWhereWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => ProblemTagScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => ProblemTagUpdateManyMutationInputSchema),
        z.lazy(() => ProblemTagUncheckedUpdateManyWithoutTagInputSchema),
      ]),
    })
    .strict();

export const ProblemCreateWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemCreateWithoutTestcasesInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseCreateNestedManyWithoutProblemInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedCreateWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutTestcasesInput> =
  z
    .object({
      problemId: z.string().optional(),
      title: z.string(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z.union([
        z.lazy(() => JsonNullValueInputSchema),
        InputJsonValueSchema,
      ]),
      difficultyLevel: z.number().int().optional(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      isPublic: z.boolean().optional(),
      totalSubmissions: z.number().int().optional(),
      acceptedSubmissions: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedCreateNestedManyWithoutProblemInputSchema,
        )
        .optional(),
    })
    .strict();

export const ProblemCreateOrConnectWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutTestcasesInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutTestcasesInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutTestcasesInputSchema),
      ]),
    })
    .strict();

export const ProblemUpsertWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutTestcasesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => ProblemUpdateWithoutTestcasesInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutTestcasesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ProblemCreateWithoutTestcasesInputSchema),
        z.lazy(() => ProblemUncheckedCreateWithoutTestcasesInputSchema),
      ]),
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
    })
    .strict();

export const ProblemUpdateToOneWithWhereWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutTestcasesInput> =
  z
    .object({
      where: z.lazy(() => ProblemWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => ProblemUpdateWithoutTestcasesInputSchema),
        z.lazy(() => ProblemUncheckedUpdateWithoutTestcasesInputSchema),
      ]),
    })
    .strict();

export const ProblemUpdateWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutTestcasesInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(() => ProblemLanguageUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      problemTags: z
        .lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissions: z
        .lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
      submissionTestcases: z
        .lazy(() => SubmissionTestcaseUpdateManyWithoutProblemNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemUncheckedUpdateWithoutTestcasesInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutTestcasesInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      title: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      description: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      problemStatement: z
        .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      difficultyLevel: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isPublic: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      totalSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      acceptedSubmissions: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemLanguages: z
        .lazy(
          () =>
            ProblemLanguageUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      problemTags: z
        .lazy(
          () => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissions: z
        .lazy(
          () => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutProblemNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> =
  z
    .object({
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> =
  z
    .object({
      sessionToken: z.string(),
      expires: z.coerce.date(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const AuthenticatorCreateManyUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateManyUserInput> =
  z
    .object({
      credentialID: z.string(),
      providerAccountId: z.string(),
      credentialPublicKey: z.string(),
      counter: z.number().int(),
      credentialDeviceType: z.string(),
      credentialBackedUp: z.boolean(),
      transports: z.string().optional().nullable(),
    })
    .strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> =
  z
    .object({
      type: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      provider: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      refresh_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> =
  z
    .object({
      type: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      provider: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      refresh_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      type: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      provider: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      refresh_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      access_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      expires_at: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      token_type: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      scope: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      id_token: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      session_state: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> =
  z
    .object({
      sessionToken: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> =
  z
    .object({
      sessionToken: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      sessionToken: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expires: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpdateWithoutUserInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const AuthenticatorUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateWithoutUserInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const AuthenticatorUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      credentialID: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      providerAccountId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialPublicKey: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      counter: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialDeviceType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      credentialBackedUp: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      transports: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const ProblemLanguageCreateManyLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageCreateManyLanguageInput> =
  z
    .object({
      problemId: z.string(),
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemLanguageUpdateWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateWithoutLanguageInput> =
  z
    .object({
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problem: z
        .lazy(
          () =>
            ProblemUpdateOneRequiredWithoutProblemLanguagesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateWithoutLanguageInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateManyWithoutLanguageInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateManyWithoutLanguageInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageCreateManyProblemInputSchema: z.ZodType<Prisma.ProblemLanguageCreateManyProblemInput> =
  z
    .object({
      languageId: z.number().int(),
      templateCode: z.string().optional().nullable(),
      timeLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryLimit: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const ProblemTagCreateManyProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateManyProblemInput> =
  z
    .object({
      tagId: z.string(),
    })
    .strict();

export const SubmissionCreateManyProblemInputSchema: z.ZodType<Prisma.SubmissionCreateManyProblemInput> =
  z
    .object({
      submissionId: z.string().optional(),
      userId: z.string(),
      languageId: z.number().int(),
      code: z.string(),
      status: z.string(),
      timeExecution: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), {
          message: "Must be a Decimal",
        }),
      memoryUsage: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      submissionTime: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const SubmissionTestcaseCreateManyProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManyProblemInput> =
  z
    .object({
      submissionId: z.string(),
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const TestcaseCreateManyProblemInputSchema: z.ZodType<Prisma.TestcaseCreateManyProblemInput> =
  z
    .object({
      testCaseId: z.string().optional(),
      inputData: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      points: z.number().int().optional(),
      label: z.string().optional().nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      deletedAt: z.coerce.date().optional().nullable(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
      deletedBy: z.string().optional().nullable(),
    })
    .strict();

export const ProblemLanguageUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUpdateWithoutProblemInput> =
  z
    .object({
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      language: z
        .lazy(
          () =>
            LanguageUpdateOneRequiredWithoutProblemLanguagesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateWithoutProblemInput> =
  z
    .object({
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageUncheckedUpdateManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemLanguageUncheckedUpdateManyWithoutProblemInput> =
  z
    .object({
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      templateCode: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      timeLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryLimit: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithoutProblemInput> =
  z
    .object({
      tag: z
        .lazy(() => TagUpdateOneRequiredWithoutProblemTagsNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateWithoutProblemInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutProblemInput> =
  z
    .object({
      tagId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionUpdateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutProblemInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      submissionTestcases: z
        .lazy(
          () => SubmissionTestcaseUpdateManyWithoutSubmissionNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutProblemInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      submissionTestcases: z
        .lazy(
          () =>
            SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionUncheckedUpdateManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutProblemInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      userId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      languageId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      code: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      timeExecution: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsage: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submissionTime: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const SubmissionTestcaseUpdateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateWithoutProblemInput> =
  z
    .object({
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      submission: z
        .lazy(
          () =>
            SubmissionUpdateOneRequiredWithoutSubmissionTestcasesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateWithoutProblemInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateManyWithoutProblemInput> =
  z
    .object({
      submissionId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const TestcaseUpdateWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUpdateWithoutProblemInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TestcaseUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUncheckedUpdateWithoutProblemInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const TestcaseUncheckedUpdateManyWithoutProblemInputSchema: z.ZodType<Prisma.TestcaseUncheckedUpdateManyWithoutProblemInput> =
  z
    .object({
      testCaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      inputData: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      expectedOutput: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSample: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      points: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      label: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      explanation: z
        .union([
          z.lazy(() => NullableJsonNullValueInputSchema),
          InputJsonValueSchema,
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      deletedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      createdBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      updatedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      deletedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const SubmissionTestcaseCreateManySubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManySubmissionInput> =
  z
    .object({
      testcaseId: z.string(),
      status: z.string(),
      stdout: z.string().optional().nullable(),
      problemId: z.string(),
      runtime: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
      memoryUsed: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateWithoutSubmissionInput> =
  z
    .object({
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      problem: z
        .lazy(
          () =>
            ProblemUpdateOneRequiredWithoutSubmissionTestcasesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateWithoutSubmissionInput> =
  z
    .object({
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionTestcaseUncheckedUpdateManyWithoutSubmissionInput> =
  z
    .object({
      testcaseId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      stdout: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      runtime: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      memoryUsed: z
        .union([
          z
            .union([
              z.number(),
              z.string(),
              z.instanceof(Decimal),
              z.instanceof(Prisma.Decimal),
              DecimalJsLikeSchema,
            ])
            .refine((v) => isValidDecimalInput(v), {
              message: "Must be a Decimal",
            }),
          z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagCreateManyTagInputSchema: z.ZodType<Prisma.ProblemTagCreateManyTagInput> =
  z
    .object({
      problemId: z.string(),
    })
    .strict();

export const ProblemTagUpdateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithoutTagInput> =
  z
    .object({
      problem: z
        .lazy(() => ProblemUpdateOneRequiredWithoutProblemTagsNestedInputSchema)
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateWithoutTagInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagUncheckedUpdateManyWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutTagInput> =
  z
    .object({
      problemId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputSchema.array(),
        UserOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> =
  z
    .object({
      select: UserSelectSchema.optional(),
      include: UserIncludeSchema.optional(),
      where: UserWhereInputSchema.optional(),
      orderBy: z
        .union([
          UserOrderByWithRelationInputSchema.array(),
          UserOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: UserWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputSchema.array(),
        UserOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z
  .object({
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputSchema.array(),
        UserOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z
  .object({
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([
        UserOrderByWithAggregationInputSchema.array(),
        UserOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: UserScalarFieldEnumSchema.array(),
    having: UserScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
  })
  .strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> =
  z
    .object({
      select: UserSelectSchema.optional(),
      include: UserIncludeSchema.optional(),
      where: UserWhereUniqueInputSchema,
    })
    .strict();

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> =
  z
    .object({
      select: AccountSelectSchema.optional(),
      include: AccountIncludeSchema.optional(),
      where: AccountWhereInputSchema.optional(),
      orderBy: z
        .union([
          AccountOrderByWithRelationInputSchema.array(),
          AccountOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AccountWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          AccountScalarFieldEnumSchema,
          AccountScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> =
  z
    .object({
      select: AccountSelectSchema.optional(),
      include: AccountIncludeSchema.optional(),
      where: AccountWhereInputSchema.optional(),
      orderBy: z
        .union([
          AccountOrderByWithRelationInputSchema.array(),
          AccountOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AccountWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          AccountScalarFieldEnumSchema,
          AccountScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> =
  z
    .object({
      select: AccountSelectSchema.optional(),
      include: AccountIncludeSchema.optional(),
      where: AccountWhereInputSchema.optional(),
      orderBy: z
        .union([
          AccountOrderByWithRelationInputSchema.array(),
          AccountOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AccountWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          AccountScalarFieldEnumSchema,
          AccountScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> =
  z
    .object({
      where: AccountWhereInputSchema.optional(),
      orderBy: z
        .union([
          AccountOrderByWithRelationInputSchema.array(),
          AccountOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AccountWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z
  .object({
    where: AccountWhereInputSchema.optional(),
    orderBy: z
      .union([
        AccountOrderByWithAggregationInputSchema.array(),
        AccountOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: AccountScalarFieldEnumSchema.array(),
    having: AccountScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> =
  z
    .object({
      select: AccountSelectSchema.optional(),
      include: AccountIncludeSchema.optional(),
      where: AccountWhereUniqueInputSchema,
    })
    .strict();

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> =
  z
    .object({
      select: AccountSelectSchema.optional(),
      include: AccountIncludeSchema.optional(),
      where: AccountWhereUniqueInputSchema,
    })
    .strict();

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> =
  z
    .object({
      select: SessionSelectSchema.optional(),
      include: SessionIncludeSchema.optional(),
      where: SessionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SessionOrderByWithRelationInputSchema.array(),
          SessionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SessionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SessionScalarFieldEnumSchema,
          SessionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> =
  z
    .object({
      select: SessionSelectSchema.optional(),
      include: SessionIncludeSchema.optional(),
      where: SessionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SessionOrderByWithRelationInputSchema.array(),
          SessionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SessionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SessionScalarFieldEnumSchema,
          SessionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> =
  z
    .object({
      select: SessionSelectSchema.optional(),
      include: SessionIncludeSchema.optional(),
      where: SessionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SessionOrderByWithRelationInputSchema.array(),
          SessionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SessionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SessionScalarFieldEnumSchema,
          SessionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> =
  z
    .object({
      where: SessionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SessionOrderByWithRelationInputSchema.array(),
          SessionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SessionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z
  .object({
    where: SessionWhereInputSchema.optional(),
    orderBy: z
      .union([
        SessionOrderByWithAggregationInputSchema.array(),
        SessionOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: SessionScalarFieldEnumSchema.array(),
    having: SessionScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> =
  z
    .object({
      select: SessionSelectSchema.optional(),
      include: SessionIncludeSchema.optional(),
      where: SessionWhereUniqueInputSchema,
    })
    .strict();

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> =
  z
    .object({
      select: SessionSelectSchema.optional(),
      include: SessionIncludeSchema.optional(),
      where: SessionWhereUniqueInputSchema,
    })
    .strict();

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationTokenScalarFieldEnumSchema,
          VerificationTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationTokenScalarFieldEnumSchema,
          VerificationTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationTokenScalarFieldEnumSchema,
          VerificationTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> =
  z
    .object({
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> =
  z
    .object({
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithAggregationInputSchema.array(),
          VerificationTokenOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: VerificationTokenScalarFieldEnumSchema.array(),
      having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereUniqueInputSchema,
    })
    .strict();

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereUniqueInputSchema,
    })
    .strict();

export const AuthenticatorFindFirstArgsSchema: z.ZodType<Prisma.AuthenticatorFindFirstArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereInputSchema.optional(),
      orderBy: z
        .union([
          AuthenticatorOrderByWithRelationInputSchema.array(),
          AuthenticatorOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AuthenticatorWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          AuthenticatorScalarFieldEnumSchema,
          AuthenticatorScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AuthenticatorFindFirstOrThrowArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereInputSchema.optional(),
      orderBy: z
        .union([
          AuthenticatorOrderByWithRelationInputSchema.array(),
          AuthenticatorOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AuthenticatorWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          AuthenticatorScalarFieldEnumSchema,
          AuthenticatorScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorFindManyArgsSchema: z.ZodType<Prisma.AuthenticatorFindManyArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereInputSchema.optional(),
      orderBy: z
        .union([
          AuthenticatorOrderByWithRelationInputSchema.array(),
          AuthenticatorOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AuthenticatorWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          AuthenticatorScalarFieldEnumSchema,
          AuthenticatorScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const AuthenticatorAggregateArgsSchema: z.ZodType<Prisma.AuthenticatorAggregateArgs> =
  z
    .object({
      where: AuthenticatorWhereInputSchema.optional(),
      orderBy: z
        .union([
          AuthenticatorOrderByWithRelationInputSchema.array(),
          AuthenticatorOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AuthenticatorWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const AuthenticatorGroupByArgsSchema: z.ZodType<Prisma.AuthenticatorGroupByArgs> =
  z
    .object({
      where: AuthenticatorWhereInputSchema.optional(),
      orderBy: z
        .union([
          AuthenticatorOrderByWithAggregationInputSchema.array(),
          AuthenticatorOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: AuthenticatorScalarFieldEnumSchema.array(),
      having: AuthenticatorScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const AuthenticatorFindUniqueArgsSchema: z.ZodType<Prisma.AuthenticatorFindUniqueArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereUniqueInputSchema,
    })
    .strict();

export const AuthenticatorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AuthenticatorFindUniqueOrThrowArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereUniqueInputSchema,
    })
    .strict();

export const LanguageFindFirstArgsSchema: z.ZodType<Prisma.LanguageFindFirstArgs> =
  z
    .object({
      select: LanguageSelectSchema.optional(),
      include: LanguageIncludeSchema.optional(),
      where: LanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          LanguageOrderByWithRelationInputSchema.array(),
          LanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: LanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          LanguageScalarFieldEnumSchema,
          LanguageScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const LanguageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LanguageFindFirstOrThrowArgs> =
  z
    .object({
      select: LanguageSelectSchema.optional(),
      include: LanguageIncludeSchema.optional(),
      where: LanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          LanguageOrderByWithRelationInputSchema.array(),
          LanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: LanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          LanguageScalarFieldEnumSchema,
          LanguageScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const LanguageFindManyArgsSchema: z.ZodType<Prisma.LanguageFindManyArgs> =
  z
    .object({
      select: LanguageSelectSchema.optional(),
      include: LanguageIncludeSchema.optional(),
      where: LanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          LanguageOrderByWithRelationInputSchema.array(),
          LanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: LanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          LanguageScalarFieldEnumSchema,
          LanguageScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const LanguageAggregateArgsSchema: z.ZodType<Prisma.LanguageAggregateArgs> =
  z
    .object({
      where: LanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          LanguageOrderByWithRelationInputSchema.array(),
          LanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: LanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const LanguageGroupByArgsSchema: z.ZodType<Prisma.LanguageGroupByArgs> =
  z
    .object({
      where: LanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          LanguageOrderByWithAggregationInputSchema.array(),
          LanguageOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: LanguageScalarFieldEnumSchema.array(),
      having: LanguageScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const LanguageFindUniqueArgsSchema: z.ZodType<Prisma.LanguageFindUniqueArgs> =
  z
    .object({
      select: LanguageSelectSchema.optional(),
      include: LanguageIncludeSchema.optional(),
      where: LanguageWhereUniqueInputSchema,
    })
    .strict();

export const LanguageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LanguageFindUniqueOrThrowArgs> =
  z
    .object({
      select: LanguageSelectSchema.optional(),
      include: LanguageIncludeSchema.optional(),
      where: LanguageWhereUniqueInputSchema,
    })
    .strict();

export const ProblemFindFirstArgsSchema: z.ZodType<Prisma.ProblemFindFirstArgs> =
  z
    .object({
      select: ProblemSelectSchema.optional(),
      include: ProblemIncludeSchema.optional(),
      where: ProblemWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemOrderByWithRelationInputSchema.array(),
          ProblemOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemScalarFieldEnumSchema,
          ProblemScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProblemFindFirstOrThrowArgs> =
  z
    .object({
      select: ProblemSelectSchema.optional(),
      include: ProblemIncludeSchema.optional(),
      where: ProblemWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemOrderByWithRelationInputSchema.array(),
          ProblemOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemScalarFieldEnumSchema,
          ProblemScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemFindManyArgsSchema: z.ZodType<Prisma.ProblemFindManyArgs> =
  z
    .object({
      select: ProblemSelectSchema.optional(),
      include: ProblemIncludeSchema.optional(),
      where: ProblemWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemOrderByWithRelationInputSchema.array(),
          ProblemOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemScalarFieldEnumSchema,
          ProblemScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemAggregateArgsSchema: z.ZodType<Prisma.ProblemAggregateArgs> =
  z
    .object({
      where: ProblemWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemOrderByWithRelationInputSchema.array(),
          ProblemOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ProblemGroupByArgsSchema: z.ZodType<Prisma.ProblemGroupByArgs> = z
  .object({
    where: ProblemWhereInputSchema.optional(),
    orderBy: z
      .union([
        ProblemOrderByWithAggregationInputSchema.array(),
        ProblemOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: ProblemScalarFieldEnumSchema.array(),
    having: ProblemScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const ProblemFindUniqueArgsSchema: z.ZodType<Prisma.ProblemFindUniqueArgs> =
  z
    .object({
      select: ProblemSelectSchema.optional(),
      include: ProblemIncludeSchema.optional(),
      where: ProblemWhereUniqueInputSchema,
    })
    .strict();

export const ProblemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProblemFindUniqueOrThrowArgs> =
  z
    .object({
      select: ProblemSelectSchema.optional(),
      include: ProblemIncludeSchema.optional(),
      where: ProblemWhereUniqueInputSchema,
    })
    .strict();

export const ProblemLanguageFindFirstArgsSchema: z.ZodType<Prisma.ProblemLanguageFindFirstArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemLanguageOrderByWithRelationInputSchema.array(),
          ProblemLanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemLanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemLanguageScalarFieldEnumSchema,
          ProblemLanguageScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProblemLanguageFindFirstOrThrowArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemLanguageOrderByWithRelationInputSchema.array(),
          ProblemLanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemLanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemLanguageScalarFieldEnumSchema,
          ProblemLanguageScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageFindManyArgsSchema: z.ZodType<Prisma.ProblemLanguageFindManyArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemLanguageOrderByWithRelationInputSchema.array(),
          ProblemLanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemLanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemLanguageScalarFieldEnumSchema,
          ProblemLanguageScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemLanguageAggregateArgsSchema: z.ZodType<Prisma.ProblemLanguageAggregateArgs> =
  z
    .object({
      where: ProblemLanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemLanguageOrderByWithRelationInputSchema.array(),
          ProblemLanguageOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemLanguageWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ProblemLanguageGroupByArgsSchema: z.ZodType<Prisma.ProblemLanguageGroupByArgs> =
  z
    .object({
      where: ProblemLanguageWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemLanguageOrderByWithAggregationInputSchema.array(),
          ProblemLanguageOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: ProblemLanguageScalarFieldEnumSchema.array(),
      having: ProblemLanguageScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ProblemLanguageFindUniqueArgsSchema: z.ZodType<Prisma.ProblemLanguageFindUniqueArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereUniqueInputSchema,
    })
    .strict();

export const ProblemLanguageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProblemLanguageFindUniqueOrThrowArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereUniqueInputSchema,
    })
    .strict();

export const ProblemTagFindFirstArgsSchema: z.ZodType<Prisma.ProblemTagFindFirstArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemTagOrderByWithRelationInputSchema.array(),
          ProblemTagOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemTagWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemTagScalarFieldEnumSchema,
          ProblemTagScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProblemTagFindFirstOrThrowArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemTagOrderByWithRelationInputSchema.array(),
          ProblemTagOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemTagWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemTagScalarFieldEnumSchema,
          ProblemTagScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagFindManyArgsSchema: z.ZodType<Prisma.ProblemTagFindManyArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemTagOrderByWithRelationInputSchema.array(),
          ProblemTagOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemTagWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          ProblemTagScalarFieldEnumSchema,
          ProblemTagScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ProblemTagAggregateArgsSchema: z.ZodType<Prisma.ProblemTagAggregateArgs> =
  z
    .object({
      where: ProblemTagWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemTagOrderByWithRelationInputSchema.array(),
          ProblemTagOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ProblemTagWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ProblemTagGroupByArgsSchema: z.ZodType<Prisma.ProblemTagGroupByArgs> =
  z
    .object({
      where: ProblemTagWhereInputSchema.optional(),
      orderBy: z
        .union([
          ProblemTagOrderByWithAggregationInputSchema.array(),
          ProblemTagOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: ProblemTagScalarFieldEnumSchema.array(),
      having: ProblemTagScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ProblemTagFindUniqueArgsSchema: z.ZodType<Prisma.ProblemTagFindUniqueArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereUniqueInputSchema,
    })
    .strict();

export const ProblemTagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProblemTagFindUniqueOrThrowArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionFindFirstArgsSchema: z.ZodType<Prisma.SubmissionFindFirstArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionOrderByWithRelationInputSchema.array(),
          SubmissionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SubmissionScalarFieldEnumSchema,
          SubmissionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubmissionFindFirstOrThrowArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionOrderByWithRelationInputSchema.array(),
          SubmissionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SubmissionScalarFieldEnumSchema,
          SubmissionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionFindManyArgsSchema: z.ZodType<Prisma.SubmissionFindManyArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionOrderByWithRelationInputSchema.array(),
          SubmissionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SubmissionScalarFieldEnumSchema,
          SubmissionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionAggregateArgsSchema: z.ZodType<Prisma.SubmissionAggregateArgs> =
  z
    .object({
      where: SubmissionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionOrderByWithRelationInputSchema.array(),
          SubmissionOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const SubmissionGroupByArgsSchema: z.ZodType<Prisma.SubmissionGroupByArgs> =
  z
    .object({
      where: SubmissionWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionOrderByWithAggregationInputSchema.array(),
          SubmissionOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: SubmissionScalarFieldEnumSchema.array(),
      having: SubmissionScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const SubmissionFindUniqueArgsSchema: z.ZodType<Prisma.SubmissionFindUniqueArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubmissionFindUniqueOrThrowArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionTestcaseFindFirstArgsSchema: z.ZodType<Prisma.SubmissionTestcaseFindFirstArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionTestcaseOrderByWithRelationInputSchema.array(),
          SubmissionTestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionTestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SubmissionTestcaseScalarFieldEnumSchema,
          SubmissionTestcaseScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubmissionTestcaseFindFirstOrThrowArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionTestcaseOrderByWithRelationInputSchema.array(),
          SubmissionTestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionTestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SubmissionTestcaseScalarFieldEnumSchema,
          SubmissionTestcaseScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseFindManyArgsSchema: z.ZodType<Prisma.SubmissionTestcaseFindManyArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionTestcaseOrderByWithRelationInputSchema.array(),
          SubmissionTestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionTestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          SubmissionTestcaseScalarFieldEnumSchema,
          SubmissionTestcaseScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const SubmissionTestcaseAggregateArgsSchema: z.ZodType<Prisma.SubmissionTestcaseAggregateArgs> =
  z
    .object({
      where: SubmissionTestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionTestcaseOrderByWithRelationInputSchema.array(),
          SubmissionTestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: SubmissionTestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const SubmissionTestcaseGroupByArgsSchema: z.ZodType<Prisma.SubmissionTestcaseGroupByArgs> =
  z
    .object({
      where: SubmissionTestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          SubmissionTestcaseOrderByWithAggregationInputSchema.array(),
          SubmissionTestcaseOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: SubmissionTestcaseScalarFieldEnumSchema.array(),
      having: SubmissionTestcaseScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const SubmissionTestcaseFindUniqueArgsSchema: z.ZodType<Prisma.SubmissionTestcaseFindUniqueArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionTestcaseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubmissionTestcaseFindUniqueOrThrowArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereUniqueInputSchema,
    })
    .strict();

export const TagFindFirstArgsSchema: z.ZodType<Prisma.TagFindFirstArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagOrderByWithRelationInputSchema.array(),
        TagOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([TagScalarFieldEnumSchema, TagScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const TagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagFindFirstOrThrowArgs> =
  z
    .object({
      select: TagSelectSchema.optional(),
      include: TagIncludeSchema.optional(),
      where: TagWhereInputSchema.optional(),
      orderBy: z
        .union([
          TagOrderByWithRelationInputSchema.array(),
          TagOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: TagWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([TagScalarFieldEnumSchema, TagScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict();

export const TagFindManyArgsSchema: z.ZodType<Prisma.TagFindManyArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagOrderByWithRelationInputSchema.array(),
        TagOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([TagScalarFieldEnumSchema, TagScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const TagAggregateArgsSchema: z.ZodType<Prisma.TagAggregateArgs> = z
  .object({
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagOrderByWithRelationInputSchema.array(),
        TagOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const TagGroupByArgsSchema: z.ZodType<Prisma.TagGroupByArgs> = z
  .object({
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagOrderByWithAggregationInputSchema.array(),
        TagOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: TagScalarFieldEnumSchema.array(),
    having: TagScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const TagFindUniqueArgsSchema: z.ZodType<Prisma.TagFindUniqueArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
  })
  .strict();

export const TagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagFindUniqueOrThrowArgs> =
  z
    .object({
      select: TagSelectSchema.optional(),
      include: TagIncludeSchema.optional(),
      where: TagWhereUniqueInputSchema,
    })
    .strict();

export const TestcaseFindFirstArgsSchema: z.ZodType<Prisma.TestcaseFindFirstArgs> =
  z
    .object({
      select: TestcaseSelectSchema.optional(),
      include: TestcaseIncludeSchema.optional(),
      where: TestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          TestcaseOrderByWithRelationInputSchema.array(),
          TestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: TestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          TestcaseScalarFieldEnumSchema,
          TestcaseScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TestcaseFindFirstOrThrowArgs> =
  z
    .object({
      select: TestcaseSelectSchema.optional(),
      include: TestcaseIncludeSchema.optional(),
      where: TestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          TestcaseOrderByWithRelationInputSchema.array(),
          TestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: TestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          TestcaseScalarFieldEnumSchema,
          TestcaseScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseFindManyArgsSchema: z.ZodType<Prisma.TestcaseFindManyArgs> =
  z
    .object({
      select: TestcaseSelectSchema.optional(),
      include: TestcaseIncludeSchema.optional(),
      where: TestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          TestcaseOrderByWithRelationInputSchema.array(),
          TestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: TestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          TestcaseScalarFieldEnumSchema,
          TestcaseScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const TestcaseAggregateArgsSchema: z.ZodType<Prisma.TestcaseAggregateArgs> =
  z
    .object({
      where: TestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          TestcaseOrderByWithRelationInputSchema.array(),
          TestcaseOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: TestcaseWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const TestcaseGroupByArgsSchema: z.ZodType<Prisma.TestcaseGroupByArgs> =
  z
    .object({
      where: TestcaseWhereInputSchema.optional(),
      orderBy: z
        .union([
          TestcaseOrderByWithAggregationInputSchema.array(),
          TestcaseOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: TestcaseScalarFieldEnumSchema.array(),
      having: TestcaseScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const TestcaseFindUniqueArgsSchema: z.ZodType<Prisma.TestcaseFindUniqueArgs> =
  z
    .object({
      select: TestcaseSelectSchema.optional(),
      include: TestcaseIncludeSchema.optional(),
      where: TestcaseWhereUniqueInputSchema,
    })
    .strict();

export const TestcaseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TestcaseFindUniqueOrThrowArgs> =
  z
    .object({
      select: TestcaseSelectSchema.optional(),
      include: TestcaseIncludeSchema.optional(),
      where: TestcaseWhereUniqueInputSchema,
    })
    .strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
  })
  .strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
    create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
    update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
  })
  .strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z
  .object({
    data: z.union([
      UserCreateManyInputSchema,
      UserCreateManyInputSchema.array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        UserCreateManyInputSchema,
        UserCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
  })
  .strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
    where: UserWhereUniqueInputSchema,
  })
  .strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z
  .object({
    data: z.union([
      UserUpdateManyMutationInputSchema,
      UserUncheckedUpdateManyInputSchema,
    ]),
    where: UserWhereInputSchema.optional(),
  })
  .strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z
  .object({
    where: UserWhereInputSchema.optional(),
  })
  .strict();

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    data: z.union([
      AccountCreateInputSchema,
      AccountUncheckedCreateInputSchema,
    ]),
  })
  .strict();

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereUniqueInputSchema,
    create: z.union([
      AccountCreateInputSchema,
      AccountUncheckedCreateInputSchema,
    ]),
    update: z.union([
      AccountUpdateInputSchema,
      AccountUncheckedUpdateInputSchema,
    ]),
  })
  .strict();

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> =
  z
    .object({
      data: z.union([
        AccountCreateManyInputSchema,
        AccountCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        AccountCreateManyInputSchema,
        AccountCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereUniqueInputSchema,
  })
  .strict();

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    data: z.union([
      AccountUpdateInputSchema,
      AccountUncheckedUpdateInputSchema,
    ]),
    where: AccountWhereUniqueInputSchema,
  })
  .strict();

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> =
  z
    .object({
      data: z.union([
        AccountUpdateManyMutationInputSchema,
        AccountUncheckedUpdateManyInputSchema,
      ]),
      where: AccountWhereInputSchema.optional(),
    })
    .strict();

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> =
  z
    .object({
      where: AccountWhereInputSchema.optional(),
    })
    .strict();

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    data: z.union([
      SessionCreateInputSchema,
      SessionUncheckedCreateInputSchema,
    ]),
  })
  .strict();

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereUniqueInputSchema,
    create: z.union([
      SessionCreateInputSchema,
      SessionUncheckedCreateInputSchema,
    ]),
    update: z.union([
      SessionUpdateInputSchema,
      SessionUncheckedUpdateInputSchema,
    ]),
  })
  .strict();

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> =
  z
    .object({
      data: z.union([
        SessionCreateManyInputSchema,
        SessionCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        SessionCreateManyInputSchema,
        SessionCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereUniqueInputSchema,
  })
  .strict();

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    data: z.union([
      SessionUpdateInputSchema,
      SessionUncheckedUpdateInputSchema,
    ]),
    where: SessionWhereUniqueInputSchema,
  })
  .strict();

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> =
  z
    .object({
      data: z.union([
        SessionUpdateManyMutationInputSchema,
        SessionUncheckedUpdateManyInputSchema,
      ]),
      where: SessionWhereInputSchema.optional(),
    })
    .strict();

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> =
  z
    .object({
      where: SessionWhereInputSchema.optional(),
    })
    .strict();

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      data: z.union([
        VerificationTokenCreateInputSchema,
        VerificationTokenUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereUniqueInputSchema,
      create: z.union([
        VerificationTokenCreateInputSchema,
        VerificationTokenUncheckedCreateInputSchema,
      ]),
      update: z.union([
        VerificationTokenUpdateInputSchema,
        VerificationTokenUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenCreateManyInputSchema,
        VerificationTokenCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const VerificationTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenCreateManyInputSchema,
        VerificationTokenCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereUniqueInputSchema,
    })
    .strict();

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      data: z.union([
        VerificationTokenUpdateInputSchema,
        VerificationTokenUncheckedUpdateInputSchema,
      ]),
      where: VerificationTokenWhereUniqueInputSchema,
    })
    .strict();

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenUpdateManyMutationInputSchema,
        VerificationTokenUncheckedUpdateManyInputSchema,
      ]),
      where: VerificationTokenWhereInputSchema.optional(),
    })
    .strict();

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> =
  z
    .object({
      where: VerificationTokenWhereInputSchema.optional(),
    })
    .strict();

export const AuthenticatorCreateArgsSchema: z.ZodType<Prisma.AuthenticatorCreateArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      data: z.union([
        AuthenticatorCreateInputSchema,
        AuthenticatorUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const AuthenticatorUpsertArgsSchema: z.ZodType<Prisma.AuthenticatorUpsertArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereUniqueInputSchema,
      create: z.union([
        AuthenticatorCreateInputSchema,
        AuthenticatorUncheckedCreateInputSchema,
      ]),
      update: z.union([
        AuthenticatorUpdateInputSchema,
        AuthenticatorUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const AuthenticatorCreateManyArgsSchema: z.ZodType<Prisma.AuthenticatorCreateManyArgs> =
  z
    .object({
      data: z.union([
        AuthenticatorCreateManyInputSchema,
        AuthenticatorCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AuthenticatorCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AuthenticatorCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        AuthenticatorCreateManyInputSchema,
        AuthenticatorCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AuthenticatorDeleteArgsSchema: z.ZodType<Prisma.AuthenticatorDeleteArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      where: AuthenticatorWhereUniqueInputSchema,
    })
    .strict();

export const AuthenticatorUpdateArgsSchema: z.ZodType<Prisma.AuthenticatorUpdateArgs> =
  z
    .object({
      select: AuthenticatorSelectSchema.optional(),
      include: AuthenticatorIncludeSchema.optional(),
      data: z.union([
        AuthenticatorUpdateInputSchema,
        AuthenticatorUncheckedUpdateInputSchema,
      ]),
      where: AuthenticatorWhereUniqueInputSchema,
    })
    .strict();

export const AuthenticatorUpdateManyArgsSchema: z.ZodType<Prisma.AuthenticatorUpdateManyArgs> =
  z
    .object({
      data: z.union([
        AuthenticatorUpdateManyMutationInputSchema,
        AuthenticatorUncheckedUpdateManyInputSchema,
      ]),
      where: AuthenticatorWhereInputSchema.optional(),
    })
    .strict();

export const AuthenticatorDeleteManyArgsSchema: z.ZodType<Prisma.AuthenticatorDeleteManyArgs> =
  z
    .object({
      where: AuthenticatorWhereInputSchema.optional(),
    })
    .strict();

export const LanguageCreateArgsSchema: z.ZodType<Prisma.LanguageCreateArgs> = z
  .object({
    select: LanguageSelectSchema.optional(),
    include: LanguageIncludeSchema.optional(),
    data: z.union([
      LanguageCreateInputSchema,
      LanguageUncheckedCreateInputSchema,
    ]),
  })
  .strict();

export const LanguageUpsertArgsSchema: z.ZodType<Prisma.LanguageUpsertArgs> = z
  .object({
    select: LanguageSelectSchema.optional(),
    include: LanguageIncludeSchema.optional(),
    where: LanguageWhereUniqueInputSchema,
    create: z.union([
      LanguageCreateInputSchema,
      LanguageUncheckedCreateInputSchema,
    ]),
    update: z.union([
      LanguageUpdateInputSchema,
      LanguageUncheckedUpdateInputSchema,
    ]),
  })
  .strict();

export const LanguageCreateManyArgsSchema: z.ZodType<Prisma.LanguageCreateManyArgs> =
  z
    .object({
      data: z.union([
        LanguageCreateManyInputSchema,
        LanguageCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const LanguageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LanguageCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        LanguageCreateManyInputSchema,
        LanguageCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const LanguageDeleteArgsSchema: z.ZodType<Prisma.LanguageDeleteArgs> = z
  .object({
    select: LanguageSelectSchema.optional(),
    include: LanguageIncludeSchema.optional(),
    where: LanguageWhereUniqueInputSchema,
  })
  .strict();

export const LanguageUpdateArgsSchema: z.ZodType<Prisma.LanguageUpdateArgs> = z
  .object({
    select: LanguageSelectSchema.optional(),
    include: LanguageIncludeSchema.optional(),
    data: z.union([
      LanguageUpdateInputSchema,
      LanguageUncheckedUpdateInputSchema,
    ]),
    where: LanguageWhereUniqueInputSchema,
  })
  .strict();

export const LanguageUpdateManyArgsSchema: z.ZodType<Prisma.LanguageUpdateManyArgs> =
  z
    .object({
      data: z.union([
        LanguageUpdateManyMutationInputSchema,
        LanguageUncheckedUpdateManyInputSchema,
      ]),
      where: LanguageWhereInputSchema.optional(),
    })
    .strict();

export const LanguageDeleteManyArgsSchema: z.ZodType<Prisma.LanguageDeleteManyArgs> =
  z
    .object({
      where: LanguageWhereInputSchema.optional(),
    })
    .strict();

export const ProblemCreateArgsSchema: z.ZodType<Prisma.ProblemCreateArgs> = z
  .object({
    select: ProblemSelectSchema.optional(),
    include: ProblemIncludeSchema.optional(),
    data: z.union([
      ProblemCreateInputSchema,
      ProblemUncheckedCreateInputSchema,
    ]),
  })
  .strict();

export const ProblemUpsertArgsSchema: z.ZodType<Prisma.ProblemUpsertArgs> = z
  .object({
    select: ProblemSelectSchema.optional(),
    include: ProblemIncludeSchema.optional(),
    where: ProblemWhereUniqueInputSchema,
    create: z.union([
      ProblemCreateInputSchema,
      ProblemUncheckedCreateInputSchema,
    ]),
    update: z.union([
      ProblemUpdateInputSchema,
      ProblemUncheckedUpdateInputSchema,
    ]),
  })
  .strict();

export const ProblemCreateManyArgsSchema: z.ZodType<Prisma.ProblemCreateManyArgs> =
  z
    .object({
      data: z.union([
        ProblemCreateManyInputSchema,
        ProblemCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProblemCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        ProblemCreateManyInputSchema,
        ProblemCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemDeleteArgsSchema: z.ZodType<Prisma.ProblemDeleteArgs> = z
  .object({
    select: ProblemSelectSchema.optional(),
    include: ProblemIncludeSchema.optional(),
    where: ProblemWhereUniqueInputSchema,
  })
  .strict();

export const ProblemUpdateArgsSchema: z.ZodType<Prisma.ProblemUpdateArgs> = z
  .object({
    select: ProblemSelectSchema.optional(),
    include: ProblemIncludeSchema.optional(),
    data: z.union([
      ProblemUpdateInputSchema,
      ProblemUncheckedUpdateInputSchema,
    ]),
    where: ProblemWhereUniqueInputSchema,
  })
  .strict();

export const ProblemUpdateManyArgsSchema: z.ZodType<Prisma.ProblemUpdateManyArgs> =
  z
    .object({
      data: z.union([
        ProblemUpdateManyMutationInputSchema,
        ProblemUncheckedUpdateManyInputSchema,
      ]),
      where: ProblemWhereInputSchema.optional(),
    })
    .strict();

export const ProblemDeleteManyArgsSchema: z.ZodType<Prisma.ProblemDeleteManyArgs> =
  z
    .object({
      where: ProblemWhereInputSchema.optional(),
    })
    .strict();

export const ProblemLanguageCreateArgsSchema: z.ZodType<Prisma.ProblemLanguageCreateArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      data: z.union([
        ProblemLanguageCreateInputSchema,
        ProblemLanguageUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const ProblemLanguageUpsertArgsSchema: z.ZodType<Prisma.ProblemLanguageUpsertArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereUniqueInputSchema,
      create: z.union([
        ProblemLanguageCreateInputSchema,
        ProblemLanguageUncheckedCreateInputSchema,
      ]),
      update: z.union([
        ProblemLanguageUpdateInputSchema,
        ProblemLanguageUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const ProblemLanguageCreateManyArgsSchema: z.ZodType<Prisma.ProblemLanguageCreateManyArgs> =
  z
    .object({
      data: z.union([
        ProblemLanguageCreateManyInputSchema,
        ProblemLanguageCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemLanguageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProblemLanguageCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        ProblemLanguageCreateManyInputSchema,
        ProblemLanguageCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemLanguageDeleteArgsSchema: z.ZodType<Prisma.ProblemLanguageDeleteArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      where: ProblemLanguageWhereUniqueInputSchema,
    })
    .strict();

export const ProblemLanguageUpdateArgsSchema: z.ZodType<Prisma.ProblemLanguageUpdateArgs> =
  z
    .object({
      select: ProblemLanguageSelectSchema.optional(),
      include: ProblemLanguageIncludeSchema.optional(),
      data: z.union([
        ProblemLanguageUpdateInputSchema,
        ProblemLanguageUncheckedUpdateInputSchema,
      ]),
      where: ProblemLanguageWhereUniqueInputSchema,
    })
    .strict();

export const ProblemLanguageUpdateManyArgsSchema: z.ZodType<Prisma.ProblemLanguageUpdateManyArgs> =
  z
    .object({
      data: z.union([
        ProblemLanguageUpdateManyMutationInputSchema,
        ProblemLanguageUncheckedUpdateManyInputSchema,
      ]),
      where: ProblemLanguageWhereInputSchema.optional(),
    })
    .strict();

export const ProblemLanguageDeleteManyArgsSchema: z.ZodType<Prisma.ProblemLanguageDeleteManyArgs> =
  z
    .object({
      where: ProblemLanguageWhereInputSchema.optional(),
    })
    .strict();

export const ProblemTagCreateArgsSchema: z.ZodType<Prisma.ProblemTagCreateArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      data: z.union([
        ProblemTagCreateInputSchema,
        ProblemTagUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const ProblemTagUpsertArgsSchema: z.ZodType<Prisma.ProblemTagUpsertArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereUniqueInputSchema,
      create: z.union([
        ProblemTagCreateInputSchema,
        ProblemTagUncheckedCreateInputSchema,
      ]),
      update: z.union([
        ProblemTagUpdateInputSchema,
        ProblemTagUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const ProblemTagCreateManyArgsSchema: z.ZodType<Prisma.ProblemTagCreateManyArgs> =
  z
    .object({
      data: z.union([
        ProblemTagCreateManyInputSchema,
        ProblemTagCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemTagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProblemTagCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        ProblemTagCreateManyInputSchema,
        ProblemTagCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ProblemTagDeleteArgsSchema: z.ZodType<Prisma.ProblemTagDeleteArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      where: ProblemTagWhereUniqueInputSchema,
    })
    .strict();

export const ProblemTagUpdateArgsSchema: z.ZodType<Prisma.ProblemTagUpdateArgs> =
  z
    .object({
      select: ProblemTagSelectSchema.optional(),
      include: ProblemTagIncludeSchema.optional(),
      data: z.union([
        ProblemTagUpdateInputSchema,
        ProblemTagUncheckedUpdateInputSchema,
      ]),
      where: ProblemTagWhereUniqueInputSchema,
    })
    .strict();

export const ProblemTagUpdateManyArgsSchema: z.ZodType<Prisma.ProblemTagUpdateManyArgs> =
  z
    .object({
      data: z.union([
        ProblemTagUpdateManyMutationInputSchema,
        ProblemTagUncheckedUpdateManyInputSchema,
      ]),
      where: ProblemTagWhereInputSchema.optional(),
    })
    .strict();

export const ProblemTagDeleteManyArgsSchema: z.ZodType<Prisma.ProblemTagDeleteManyArgs> =
  z
    .object({
      where: ProblemTagWhereInputSchema.optional(),
    })
    .strict();

export const SubmissionCreateArgsSchema: z.ZodType<Prisma.SubmissionCreateArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      data: z.union([
        SubmissionCreateInputSchema,
        SubmissionUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const SubmissionUpsertArgsSchema: z.ZodType<Prisma.SubmissionUpsertArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereUniqueInputSchema,
      create: z.union([
        SubmissionCreateInputSchema,
        SubmissionUncheckedCreateInputSchema,
      ]),
      update: z.union([
        SubmissionUpdateInputSchema,
        SubmissionUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const SubmissionCreateManyArgsSchema: z.ZodType<Prisma.SubmissionCreateManyArgs> =
  z
    .object({
      data: z.union([
        SubmissionCreateManyInputSchema,
        SubmissionCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SubmissionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SubmissionCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        SubmissionCreateManyInputSchema,
        SubmissionCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SubmissionDeleteArgsSchema: z.ZodType<Prisma.SubmissionDeleteArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      where: SubmissionWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionUpdateArgsSchema: z.ZodType<Prisma.SubmissionUpdateArgs> =
  z
    .object({
      select: SubmissionSelectSchema.optional(),
      include: SubmissionIncludeSchema.optional(),
      data: z.union([
        SubmissionUpdateInputSchema,
        SubmissionUncheckedUpdateInputSchema,
      ]),
      where: SubmissionWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionUpdateManyArgsSchema: z.ZodType<Prisma.SubmissionUpdateManyArgs> =
  z
    .object({
      data: z.union([
        SubmissionUpdateManyMutationInputSchema,
        SubmissionUncheckedUpdateManyInputSchema,
      ]),
      where: SubmissionWhereInputSchema.optional(),
    })
    .strict();

export const SubmissionDeleteManyArgsSchema: z.ZodType<Prisma.SubmissionDeleteManyArgs> =
  z
    .object({
      where: SubmissionWhereInputSchema.optional(),
    })
    .strict();

export const SubmissionTestcaseCreateArgsSchema: z.ZodType<Prisma.SubmissionTestcaseCreateArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      data: z.union([
        SubmissionTestcaseCreateInputSchema,
        SubmissionTestcaseUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const SubmissionTestcaseUpsertArgsSchema: z.ZodType<Prisma.SubmissionTestcaseUpsertArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereUniqueInputSchema,
      create: z.union([
        SubmissionTestcaseCreateInputSchema,
        SubmissionTestcaseUncheckedCreateInputSchema,
      ]),
      update: z.union([
        SubmissionTestcaseUpdateInputSchema,
        SubmissionTestcaseUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const SubmissionTestcaseCreateManyArgsSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManyArgs> =
  z
    .object({
      data: z.union([
        SubmissionTestcaseCreateManyInputSchema,
        SubmissionTestcaseCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SubmissionTestcaseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SubmissionTestcaseCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        SubmissionTestcaseCreateManyInputSchema,
        SubmissionTestcaseCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const SubmissionTestcaseDeleteArgsSchema: z.ZodType<Prisma.SubmissionTestcaseDeleteArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      where: SubmissionTestcaseWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionTestcaseUpdateArgsSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateArgs> =
  z
    .object({
      select: SubmissionTestcaseSelectSchema.optional(),
      include: SubmissionTestcaseIncludeSchema.optional(),
      data: z.union([
        SubmissionTestcaseUpdateInputSchema,
        SubmissionTestcaseUncheckedUpdateInputSchema,
      ]),
      where: SubmissionTestcaseWhereUniqueInputSchema,
    })
    .strict();

export const SubmissionTestcaseUpdateManyArgsSchema: z.ZodType<Prisma.SubmissionTestcaseUpdateManyArgs> =
  z
    .object({
      data: z.union([
        SubmissionTestcaseUpdateManyMutationInputSchema,
        SubmissionTestcaseUncheckedUpdateManyInputSchema,
      ]),
      where: SubmissionTestcaseWhereInputSchema.optional(),
    })
    .strict();

export const SubmissionTestcaseDeleteManyArgsSchema: z.ZodType<Prisma.SubmissionTestcaseDeleteManyArgs> =
  z
    .object({
      where: SubmissionTestcaseWhereInputSchema.optional(),
    })
    .strict();

export const TagCreateArgsSchema: z.ZodType<Prisma.TagCreateArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    data: z.union([TagCreateInputSchema, TagUncheckedCreateInputSchema]),
  })
  .strict();

export const TagUpsertArgsSchema: z.ZodType<Prisma.TagUpsertArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
    create: z.union([TagCreateInputSchema, TagUncheckedCreateInputSchema]),
    update: z.union([TagUpdateInputSchema, TagUncheckedUpdateInputSchema]),
  })
  .strict();

export const TagCreateManyArgsSchema: z.ZodType<Prisma.TagCreateManyArgs> = z
  .object({
    data: z.union([TagCreateManyInputSchema, TagCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

export const TagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TagCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        TagCreateManyInputSchema,
        TagCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const TagDeleteArgsSchema: z.ZodType<Prisma.TagDeleteArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
  })
  .strict();

export const TagUpdateArgsSchema: z.ZodType<Prisma.TagUpdateArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    data: z.union([TagUpdateInputSchema, TagUncheckedUpdateInputSchema]),
    where: TagWhereUniqueInputSchema,
  })
  .strict();

export const TagUpdateManyArgsSchema: z.ZodType<Prisma.TagUpdateManyArgs> = z
  .object({
    data: z.union([
      TagUpdateManyMutationInputSchema,
      TagUncheckedUpdateManyInputSchema,
    ]),
    where: TagWhereInputSchema.optional(),
  })
  .strict();

export const TagDeleteManyArgsSchema: z.ZodType<Prisma.TagDeleteManyArgs> = z
  .object({
    where: TagWhereInputSchema.optional(),
  })
  .strict();

export const TestcaseCreateArgsSchema: z.ZodType<Prisma.TestcaseCreateArgs> = z
  .object({
    select: TestcaseSelectSchema.optional(),
    include: TestcaseIncludeSchema.optional(),
    data: z.union([
      TestcaseCreateInputSchema,
      TestcaseUncheckedCreateInputSchema,
    ]),
  })
  .strict();

export const TestcaseUpsertArgsSchema: z.ZodType<Prisma.TestcaseUpsertArgs> = z
  .object({
    select: TestcaseSelectSchema.optional(),
    include: TestcaseIncludeSchema.optional(),
    where: TestcaseWhereUniqueInputSchema,
    create: z.union([
      TestcaseCreateInputSchema,
      TestcaseUncheckedCreateInputSchema,
    ]),
    update: z.union([
      TestcaseUpdateInputSchema,
      TestcaseUncheckedUpdateInputSchema,
    ]),
  })
  .strict();

export const TestcaseCreateManyArgsSchema: z.ZodType<Prisma.TestcaseCreateManyArgs> =
  z
    .object({
      data: z.union([
        TestcaseCreateManyInputSchema,
        TestcaseCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const TestcaseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TestcaseCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        TestcaseCreateManyInputSchema,
        TestcaseCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const TestcaseDeleteArgsSchema: z.ZodType<Prisma.TestcaseDeleteArgs> = z
  .object({
    select: TestcaseSelectSchema.optional(),
    include: TestcaseIncludeSchema.optional(),
    where: TestcaseWhereUniqueInputSchema,
  })
  .strict();

export const TestcaseUpdateArgsSchema: z.ZodType<Prisma.TestcaseUpdateArgs> = z
  .object({
    select: TestcaseSelectSchema.optional(),
    include: TestcaseIncludeSchema.optional(),
    data: z.union([
      TestcaseUpdateInputSchema,
      TestcaseUncheckedUpdateInputSchema,
    ]),
    where: TestcaseWhereUniqueInputSchema,
  })
  .strict();

export const TestcaseUpdateManyArgsSchema: z.ZodType<Prisma.TestcaseUpdateManyArgs> =
  z
    .object({
      data: z.union([
        TestcaseUpdateManyMutationInputSchema,
        TestcaseUncheckedUpdateManyInputSchema,
      ]),
      where: TestcaseWhereInputSchema.optional(),
    })
    .strict();

export const TestcaseDeleteManyArgsSchema: z.ZodType<Prisma.TestcaseDeleteManyArgs> =
  z
    .object({
      where: TestcaseWhereInputSchema.optional(),
    })
    .strict();
