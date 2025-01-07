import * as grpc from "@grpc/grpc-js";
import { ExecutionServiceClient } from "./generated/execution_service";
export const executionServiceClient = new ExecutionServiceClient(
  process.env.GRPC_ENDPOINT || "localhost:50051",
  grpc.credentials.createInsecure(),
);
