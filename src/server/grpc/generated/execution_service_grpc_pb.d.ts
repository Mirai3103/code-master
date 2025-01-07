// package:
// file: execution_service.proto

/* eslint-disable */

import * as grpc from "grpc";
import * as execution_service_pb from "./execution_service_pb";

interface IExecutionServiceService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  execute: IExecutionServiceService_IExecute;
}

interface IExecutionServiceService_IExecute
  extends grpc.MethodDefinition<
    execution_service_pb.Submission,
    execution_service_pb.SubmissionResult
  > {
  path: "/ExecutionService/Execute";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<execution_service_pb.Submission>;
  requestDeserialize: grpc.deserialize<execution_service_pb.Submission>;
  responseSerialize: grpc.serialize<execution_service_pb.SubmissionResult>;
  responseDeserialize: grpc.deserialize<execution_service_pb.SubmissionResult>;
}

export const ExecutionServiceService: IExecutionServiceService;

export interface IExecutionServiceServer {
  execute: grpc.handleServerStreamingCall<
    execution_service_pb.Submission,
    execution_service_pb.SubmissionResult
  >;
}

export interface IExecutionServiceClient {
  execute(
    request: execution_service_pb.Submission,
    options?: Partial<grpc.CallOptions>,
  ): grpc.ClientReadableStream<execution_service_pb.SubmissionResult>;
  execute(
    request: execution_service_pb.Submission,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>,
  ): grpc.ClientReadableStream<execution_service_pb.SubmissionResult>;
}

export class ExecutionServiceClient
  extends grpc.Client
  implements IExecutionServiceClient
{
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: object,
  );
  public execute(
    request: execution_service_pb.Submission,
    options?: Partial<grpc.CallOptions>,
  ): grpc.ClientReadableStream<execution_service_pb.SubmissionResult>;
  public execute(
    request: execution_service_pb.Submission,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>,
  ): grpc.ClientReadableStream<execution_service_pb.SubmissionResult>;
}
