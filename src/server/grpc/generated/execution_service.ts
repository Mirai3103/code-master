/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.6.1
 * source: execution_service.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export class Language extends pb_1.Message {
  #one_of_decls: number[][] = [];
  constructor(
    data?:
      | any[]
      | {
          source_file_ext?: string;
          binary_file_ext?: string;
          compile_command?: string;
          run_command?: string;
        },
  ) {
    super();
    pb_1.Message.initialize(
      this,
      Array.isArray(data) ? data : [],
      0,
      -1,
      [],
      this.#one_of_decls,
    );
    if (!Array.isArray(data) && typeof data == "object") {
      if ("source_file_ext" in data && data.source_file_ext != undefined) {
        this.source_file_ext = data.source_file_ext;
      }
      if ("binary_file_ext" in data && data.binary_file_ext != undefined) {
        this.binary_file_ext = data.binary_file_ext;
      }
      if ("compile_command" in data && data.compile_command != undefined) {
        this.compile_command = data.compile_command;
      }
      if ("run_command" in data && data.run_command != undefined) {
        this.run_command = data.run_command;
      }
    }
  }
  get source_file_ext() {
    return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
  }
  set source_file_ext(value: string) {
    pb_1.Message.setField(this, 3, value);
  }
  get binary_file_ext() {
    return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
  }
  set binary_file_ext(value: string) {
    pb_1.Message.setField(this, 4, value);
  }
  get compile_command() {
    return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
  }
  set compile_command(value: string) {
    pb_1.Message.setField(this, 5, value);
  }
  get run_command() {
    return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
  }
  set run_command(value: string) {
    pb_1.Message.setField(this, 6, value);
  }
  static fromObject(data: {
    source_file_ext?: string;
    binary_file_ext?: string;
    compile_command?: string;
    run_command?: string;
  }): Language {
    const message = new Language({});
    if (data.source_file_ext != null) {
      message.source_file_ext = data.source_file_ext;
    }
    if (data.binary_file_ext != null) {
      message.binary_file_ext = data.binary_file_ext;
    }
    if (data.compile_command != null) {
      message.compile_command = data.compile_command;
    }
    if (data.run_command != null) {
      message.run_command = data.run_command;
    }
    return message;
  }
  toObject() {
    const data: {
      source_file_ext?: string;
      binary_file_ext?: string;
      compile_command?: string;
      run_command?: string;
    } = {};
    if (this.source_file_ext != null) {
      data.source_file_ext = this.source_file_ext;
    }
    if (this.binary_file_ext != null) {
      data.binary_file_ext = this.binary_file_ext;
    }
    if (this.compile_command != null) {
      data.compile_command = this.compile_command;
    }
    if (this.run_command != null) {
      data.run_command = this.run_command;
    }
    return data;
  }
  serialize(): Uint8Array;
  serialize(w: pb_1.BinaryWriter): void;
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter();
    if (this.source_file_ext.length)
      writer.writeString(3, this.source_file_ext);
    if (this.binary_file_ext.length)
      writer.writeString(4, this.binary_file_ext);
    if (this.compile_command.length)
      writer.writeString(5, this.compile_command);
    if (this.run_command.length) writer.writeString(6, this.run_command);
    if (!w) return writer.getResultBuffer();
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Language {
    const reader =
        bytes instanceof pb_1.BinaryReader
          ? bytes
          : new pb_1.BinaryReader(bytes),
      message = new Language();
    while (reader.nextField()) {
      if (reader.isEndGroup()) break;
      switch (reader.getFieldNumber()) {
        case 3:
          message.source_file_ext = reader.readString();
          break;
        case 4:
          message.binary_file_ext = reader.readString();
          break;
        case 5:
          message.compile_command = reader.readString();
          break;
        case 6:
          message.run_command = reader.readString();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary(): Uint8Array {
    return this.serialize();
  }
  static deserializeBinary(bytes: Uint8Array): Language {
    return Language.deserialize(bytes);
  }
}
export class SubmissionResult extends pb_1.Message {
  #one_of_decls: number[][] = [];
  constructor(
    data?:
      | any[]
      | {
          submission_id?: string;
          test_case_id?: string;
          status?: string;
          stdout?: string;
          memory_usage?: number;
          time_usage?: number;
        },
  ) {
    super();
    pb_1.Message.initialize(
      this,
      Array.isArray(data) ? data : [],
      0,
      -1,
      [],
      this.#one_of_decls,
    );
    if (!Array.isArray(data) && typeof data == "object") {
      if ("submission_id" in data && data.submission_id != undefined) {
        this.submission_id = data.submission_id;
      }
      if ("test_case_id" in data && data.test_case_id != undefined) {
        this.test_case_id = data.test_case_id;
      }
      if ("status" in data && data.status != undefined) {
        this.status = data.status;
      }
      if ("stdout" in data && data.stdout != undefined) {
        this.stdout = data.stdout;
      }
      if ("memory_usage" in data && data.memory_usage != undefined) {
        this.memory_usage = data.memory_usage;
      }
      if ("time_usage" in data && data.time_usage != undefined) {
        this.time_usage = data.time_usage;
      }
    }
  }
  get submission_id() {
    return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
  }
  set submission_id(value: string) {
    pb_1.Message.setField(this, 1, value);
  }
  get test_case_id() {
    return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
  }
  set test_case_id(value: string) {
    pb_1.Message.setField(this, 2, value);
  }
  get status() {
    return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
  }
  set status(value: string) {
    pb_1.Message.setField(this, 3, value);
  }
  get stdout() {
    return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
  }
  set stdout(value: string) {
    pb_1.Message.setField(this, 4, value);
  }
  get memory_usage() {
    return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
  }
  set memory_usage(value: number) {
    pb_1.Message.setField(this, 5, value);
  }
  get time_usage() {
    return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
  }
  set time_usage(value: number) {
    pb_1.Message.setField(this, 6, value);
  }
  static fromObject(data: {
    submission_id?: string;
    test_case_id?: string;
    status?: string;
    stdout?: string;
    memory_usage?: number;
    time_usage?: number;
  }): SubmissionResult {
    const message = new SubmissionResult({});
    if (data.submission_id != null) {
      message.submission_id = data.submission_id;
    }
    if (data.test_case_id != null) {
      message.test_case_id = data.test_case_id;
    }
    if (data.status != null) {
      message.status = data.status;
    }
    if (data.stdout != null) {
      message.stdout = data.stdout;
    }
    if (data.memory_usage != null) {
      message.memory_usage = data.memory_usage;
    }
    if (data.time_usage != null) {
      message.time_usage = data.time_usage;
    }
    return message;
  }
  toObject() {
    const data: {
      submission_id?: string;
      test_case_id?: string;
      status?: string;
      stdout?: string;
      memory_usage?: number;
      time_usage?: number;
    } = {};
    if (this.submission_id != null) {
      data.submission_id = this.submission_id;
    }
    if (this.test_case_id != null) {
      data.test_case_id = this.test_case_id;
    }
    if (this.status != null) {
      data.status = this.status;
    }
    if (this.stdout != null) {
      data.stdout = this.stdout;
    }
    if (this.memory_usage != null) {
      data.memory_usage = this.memory_usage;
    }
    if (this.time_usage != null) {
      data.time_usage = this.time_usage;
    }
    return data;
  }
  serialize(): Uint8Array;
  serialize(w: pb_1.BinaryWriter): void;
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter();
    if (this.submission_id.length) writer.writeString(1, this.submission_id);
    if (this.test_case_id.length) writer.writeString(2, this.test_case_id);
    if (this.status.length) writer.writeString(3, this.status);
    if (this.stdout.length) writer.writeString(4, this.stdout);
    if (this.memory_usage != 0) writer.writeFloat(5, this.memory_usage);
    if (this.time_usage != 0) writer.writeFloat(6, this.time_usage);
    if (!w) return writer.getResultBuffer();
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SubmissionResult {
    const reader =
        bytes instanceof pb_1.BinaryReader
          ? bytes
          : new pb_1.BinaryReader(bytes),
      message = new SubmissionResult();
    while (reader.nextField()) {
      if (reader.isEndGroup()) break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.submission_id = reader.readString();
          break;
        case 2:
          message.test_case_id = reader.readString();
          break;
        case 3:
          message.status = reader.readString();
          break;
        case 4:
          message.stdout = reader.readString();
          break;
        case 5:
          message.memory_usage = reader.readFloat();
          break;
        case 6:
          message.time_usage = reader.readFloat();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary(): Uint8Array {
    return this.serialize();
  }
  static deserializeBinary(bytes: Uint8Array): SubmissionResult {
    return SubmissionResult.deserialize(bytes);
  }
}
export class TestCase extends pb_1.Message {
  #one_of_decls: number[][] = [];
  constructor(
    data?:
      | any[]
      | {
          id?: string;
          input?: string;
          expect_output?: string;
          input_file?: string;
          output_file?: string;
        },
  ) {
    super();
    pb_1.Message.initialize(
      this,
      Array.isArray(data) ? data : [],
      0,
      -1,
      [],
      this.#one_of_decls,
    );
    if (!Array.isArray(data) && typeof data == "object") {
      if ("id" in data && data.id != undefined) {
        this.id = data.id;
      }
      if ("input" in data && data.input != undefined) {
        this.input = data.input;
      }
      if ("expect_output" in data && data.expect_output != undefined) {
        this.expect_output = data.expect_output;
      }
      if ("input_file" in data && data.input_file != undefined) {
        this.input_file = data.input_file;
      }
      if ("output_file" in data && data.output_file != undefined) {
        this.output_file = data.output_file;
      }
    }
  }
  get id() {
    return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
  }
  set id(value: string) {
    pb_1.Message.setField(this, 1, value);
  }
  get input() {
    return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
  }
  set input(value: string) {
    pb_1.Message.setField(this, 2, value);
  }
  get expect_output() {
    return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
  }
  set expect_output(value: string) {
    pb_1.Message.setField(this, 3, value);
  }
  get input_file() {
    return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
  }
  set input_file(value: string) {
    pb_1.Message.setField(this, 4, value);
  }
  get output_file() {
    return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
  }
  set output_file(value: string) {
    pb_1.Message.setField(this, 5, value);
  }
  static fromObject(data: {
    id?: string;
    input?: string;
    expect_output?: string;
    input_file?: string;
    output_file?: string;
  }): TestCase {
    const message = new TestCase({});
    if (data.id != null) {
      message.id = data.id;
    }
    if (data.input != null) {
      message.input = data.input;
    }
    if (data.expect_output != null) {
      message.expect_output = data.expect_output;
    }
    if (data.input_file != null) {
      message.input_file = data.input_file;
    }
    if (data.output_file != null) {
      message.output_file = data.output_file;
    }
    return message;
  }
  toObject() {
    const data: {
      id?: string;
      input?: string;
      expect_output?: string;
      input_file?: string;
      output_file?: string;
    } = {};
    if (this.id != null) {
      data.id = this.id;
    }
    if (this.input != null) {
      data.input = this.input;
    }
    if (this.expect_output != null) {
      data.expect_output = this.expect_output;
    }
    if (this.input_file != null) {
      data.input_file = this.input_file;
    }
    if (this.output_file != null) {
      data.output_file = this.output_file;
    }
    return data;
  }
  serialize(): Uint8Array;
  serialize(w: pb_1.BinaryWriter): void;
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter();
    if (this.id.length) writer.writeString(1, this.id);
    if (this.input.length) writer.writeString(2, this.input);
    if (this.expect_output.length) writer.writeString(3, this.expect_output);
    if (this.input_file.length) writer.writeString(4, this.input_file);
    if (this.output_file.length) writer.writeString(5, this.output_file);
    if (!w) return writer.getResultBuffer();
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TestCase {
    const reader =
        bytes instanceof pb_1.BinaryReader
          ? bytes
          : new pb_1.BinaryReader(bytes),
      message = new TestCase();
    while (reader.nextField()) {
      if (reader.isEndGroup()) break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.id = reader.readString();
          break;
        case 2:
          message.input = reader.readString();
          break;
        case 3:
          message.expect_output = reader.readString();
          break;
        case 4:
          message.input_file = reader.readString();
          break;
        case 5:
          message.output_file = reader.readString();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary(): Uint8Array {
    return this.serialize();
  }
  static deserializeBinary(bytes: Uint8Array): TestCase {
    return TestCase.deserialize(bytes);
  }
}
export class Submission extends pb_1.Message {
  #one_of_decls: number[][] = [];
  constructor(
    data?:
      | any[]
      | {
          id?: string;
          language?: Language;
          code?: string;
          time_limit?: number;
          memory_limit?: number;
          test_cases?: TestCase[];
        },
  ) {
    super();
    pb_1.Message.initialize(
      this,
      Array.isArray(data) ? data : [],
      0,
      -1,
      [6],
      this.#one_of_decls,
    );
    if (!Array.isArray(data) && typeof data == "object") {
      if ("id" in data && data.id != undefined) {
        this.id = data.id;
      }
      if ("language" in data && data.language != undefined) {
        this.language = data.language;
      }
      if ("code" in data && data.code != undefined) {
        this.code = data.code;
      }
      if ("time_limit" in data && data.time_limit != undefined) {
        this.time_limit = data.time_limit;
      }
      if ("memory_limit" in data && data.memory_limit != undefined) {
        this.memory_limit = data.memory_limit;
      }
      if ("test_cases" in data && data.test_cases != undefined) {
        this.test_cases = data.test_cases;
      }
    }
  }
  get id() {
    return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
  }
  set id(value: string) {
    pb_1.Message.setField(this, 1, value);
  }
  get language() {
    return pb_1.Message.getWrapperField(this, Language, 2);
  }
  set language(value: Language) {
    pb_1.Message.setWrapperField(this, 2, value);
  }
  get has_language() {
    return pb_1.Message.getField(this, 2) != null;
  }
  get code() {
    return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
  }
  set code(value: string) {
    pb_1.Message.setField(this, 3, value);
  }
  get time_limit() {
    return pb_1.Message.getFieldWithDefault(this, 4, 0) as number;
  }
  set time_limit(value: number) {
    pb_1.Message.setField(this, 4, value);
  }
  get memory_limit() {
    return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
  }
  set memory_limit(value: number) {
    pb_1.Message.setField(this, 5, value);
  }
  get test_cases() {
    return pb_1.Message.getRepeatedWrapperField(this, TestCase, 6);
  }
  set test_cases(value: TestCase[]) {
    pb_1.Message.setRepeatedWrapperField(this, 6, value);
  }
  static fromObject(data: {
    id?: string;
    language?: ReturnType<typeof Language.prototype.toObject>;
    code?: string;
    time_limit?: number;
    memory_limit?: number;
    test_cases?: ReturnType<typeof TestCase.prototype.toObject>[];
  }): Submission {
    const message = new Submission({});
    if (data.id != null) {
      message.id = data.id;
    }
    if (data.language != null) {
      message.language = Language.fromObject(data.language);
    }
    if (data.code != null) {
      message.code = data.code;
    }
    if (data.time_limit != null) {
      message.time_limit = data.time_limit;
    }
    if (data.memory_limit != null) {
      message.memory_limit = data.memory_limit;
    }
    if (data.test_cases != null) {
      message.test_cases = data.test_cases.map((item) =>
        TestCase.fromObject(item),
      );
    }
    return message;
  }
  toObject() {
    const data: {
      id?: string;
      language?: ReturnType<typeof Language.prototype.toObject>;
      code?: string;
      time_limit?: number;
      memory_limit?: number;
      test_cases?: ReturnType<typeof TestCase.prototype.toObject>[];
    } = {};
    if (this.id != null) {
      data.id = this.id;
    }
    if (this.language != null) {
      data.language = this.language.toObject();
    }
    if (this.code != null) {
      data.code = this.code;
    }
    if (this.time_limit != null) {
      data.time_limit = this.time_limit;
    }
    if (this.memory_limit != null) {
      data.memory_limit = this.memory_limit;
    }
    if (this.test_cases != null) {
      data.test_cases = this.test_cases.map((item: TestCase) =>
        item.toObject(),
      );
    }
    return data;
  }
  serialize(): Uint8Array;
  serialize(w: pb_1.BinaryWriter): void;
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter();
    if (this.id.length) writer.writeString(1, this.id);
    if (this.has_language)
      writer.writeMessage(2, this.language, () =>
        this.language.serialize(writer),
      );
    if (this.code.length) writer.writeString(3, this.code);
    if (this.time_limit != 0) writer.writeInt32(4, this.time_limit);
    if (this.memory_limit != 0) writer.writeInt32(5, this.memory_limit);
    if (this.test_cases.length)
      writer.writeRepeatedMessage(6, this.test_cases, (item: TestCase) =>
        item.serialize(writer),
      );
    if (!w) return writer.getResultBuffer();
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Submission {
    const reader =
        bytes instanceof pb_1.BinaryReader
          ? bytes
          : new pb_1.BinaryReader(bytes),
      message = new Submission();
    while (reader.nextField()) {
      if (reader.isEndGroup()) break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.id = reader.readString();
          break;
        case 2:
          reader.readMessage(
            message.language,
            () => (message.language = Language.deserialize(reader)),
          );
          break;
        case 3:
          message.code = reader.readString();
          break;
        case 4:
          message.time_limit = reader.readInt32();
          break;
        case 5:
          message.memory_limit = reader.readInt32();
          break;
        case 6:
          reader.readMessage(message.test_cases, () =>
            pb_1.Message.addToRepeatedWrapperField(
              message,
              6,
              TestCase.deserialize(reader),
              TestCase,
            ),
          );
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary(): Uint8Array {
    return this.serialize();
  }
  static deserializeBinary(bytes: Uint8Array): Submission {
    return Submission.deserialize(bytes);
  }
}
interface GrpcUnaryServiceInterface<P, R> {
  (
    message: P,
    metadata: grpc_1.Metadata,
    options: grpc_1.CallOptions,
    callback: grpc_1.requestCallback<R>,
  ): grpc_1.ClientUnaryCall;
  (
    message: P,
    metadata: grpc_1.Metadata,
    callback: grpc_1.requestCallback<R>,
  ): grpc_1.ClientUnaryCall;
  (
    message: P,
    options: grpc_1.CallOptions,
    callback: grpc_1.requestCallback<R>,
  ): grpc_1.ClientUnaryCall;
  (message: P, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
}
interface GrpcStreamServiceInterface<P, R> {
  (
    message: P,
    metadata: grpc_1.Metadata,
    options?: grpc_1.CallOptions,
  ): grpc_1.ClientReadableStream<R>;
  (message: P, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
}
interface GrpWritableServiceInterface<P, R> {
  (
    metadata: grpc_1.Metadata,
    options: grpc_1.CallOptions,
    callback: grpc_1.requestCallback<R>,
  ): grpc_1.ClientWritableStream<P>;
  (
    metadata: grpc_1.Metadata,
    callback: grpc_1.requestCallback<R>,
  ): grpc_1.ClientWritableStream<P>;
  (
    options: grpc_1.CallOptions,
    callback: grpc_1.requestCallback<R>,
  ): grpc_1.ClientWritableStream<P>;
  (callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
}
interface GrpcChunkServiceInterface<P, R> {
  (
    metadata: grpc_1.Metadata,
    options?: grpc_1.CallOptions,
  ): grpc_1.ClientDuplexStream<P, R>;
  (options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
}
interface GrpcPromiseServiceInterface<P, R> {
  (
    message: P,
    metadata: grpc_1.Metadata,
    options?: grpc_1.CallOptions,
  ): Promise<R>;
  (message: P, options?: grpc_1.CallOptions): Promise<R>;
}
export abstract class UnimplementedExecutionServiceService {
  static definition = {
    Execute: {
      path: "/ExecutionService/Execute",
      requestStream: false,
      responseStream: true,
      requestSerialize: (message: Submission) =>
        Buffer.from(message.serialize()),
      requestDeserialize: (bytes: Buffer) =>
        Submission.deserialize(new Uint8Array(bytes)),
      responseSerialize: (message: SubmissionResult) =>
        Buffer.from(message.serialize()),
      responseDeserialize: (bytes: Buffer) =>
        SubmissionResult.deserialize(new Uint8Array(bytes)),
    },
  };
  [method: string]: grpc_1.UntypedHandleCall;
  abstract Execute(
    call: grpc_1.ServerWritableStream<Submission, SubmissionResult>,
  ): void;
}
export class ExecutionServiceClient extends grpc_1.makeGenericClientConstructor(
  UnimplementedExecutionServiceService.definition,
  "ExecutionService",
  {},
) {
  constructor(
    address: string,
    credentials: grpc_1.ChannelCredentials,
    options?: Partial<grpc_1.ChannelOptions>,
  ) {
    super(address, credentials, options);
  }
  Execute: GrpcStreamServiceInterface<Submission, SubmissionResult> = (
    message: Submission,
    metadata?: grpc_1.Metadata | grpc_1.CallOptions,
    options?: grpc_1.CallOptions,
  ): grpc_1.ClientReadableStream<SubmissionResult> => {
    // @ts-ignore
    return super.Execute(message, metadata, options);
  };
}
