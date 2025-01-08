import { Prisma } from "@prisma/client";
import { auth } from "../auth";
import { cache } from "react";

// Cache getCurrentUser với react cache
const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user?.id ?? null;
});

// Tối ưu việc check model fields bằng Map
const modelAuditFields = new Map<string, Set<string>>();

// Scan models một lần và lưu vào Map
Prisma.dmmf.datamodel.models.forEach((model) => {
  const auditFields = new Set<string>();

  model.fields.forEach((field) => {
    if (
      [
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
        "deletedBy",
      ].includes(field.name)
    ) {
      auditFields.add(field.name);
    }
  });

  if (auditFields.size > 0) {
    modelAuditFields.set(model.name, auditFields);
  }
});

// Helper functions để check fields
const hasField = (modelName: string, fieldName: string): boolean => {
  return modelAuditFields.get(modelName)?.has(fieldName) ?? false;
};

const addAuditFields = async (
  modelName: string,
  data: any,
  isCreate: boolean,
): Promise<any> => {
  const fields = modelAuditFields.get(modelName);

  if (!fields) return data;
  const currentUser = await getCurrentUser();

  const result = { ...data };

  if (isCreate) {
    if (fields.has("createdAt")) result.createdAt = new Date();
    if (fields.has("createdBy")) result.createdBy = currentUser;
  }

  if (fields.has("updatedAt")) result.updatedAt = new Date();
  if (fields.has("updatedBy")) result.updatedBy = currentUser;

  return result;
};

export const auditMiddleware: Prisma.Middleware = async (params, next) => {
  const modelName = params.model;
  if (!modelName || !modelAuditFields.has(modelName)) {
    return next(params);
  }

  try {
    switch (params.action) {
      case "create": {
        if ("data" in params.args) {
          params.args.data = await addAuditFields(
            modelName,
            params.args.data,
            true,
          );
        }
        break;
      }

      case "createMany": {
        if ("data" in params.args && Array.isArray(params.args.data)) {
          params.args.data = await Promise.all(
            params.args.data.map((item: any) =>
              addAuditFields(modelName, item, true),
            ),
          );
        }
        break;
      }

      case "update":
      case "updateMany": {
        if ("data" in params.args) {
          params.args.data = await addAuditFields(
            modelName,
            params.args.data,
            false,
          );
        }
        break;
      }
    }
  } catch (error) {
    console.error("Error in audit middleware:", error);
  }

  return next(params);
};
