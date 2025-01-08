// package:
// file: execution_service.proto

/* eslint-disable */

import * as jspb from "google-protobuf";

export class Language extends jspb.Message {
  getSourceFileExt(): string;
  setSourceFileExt(value: string): Language;
  getBinaryFileExt(): string;
  setBinaryFileExt(value: string): Language;
  getCompileCommand(): string;
  setCompileCommand(value: string): Language;
  getRunCommand(): string;
  setRunCommand(value: string): Language;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Language.AsObject;
  static toObject(includeInstance: boolean, msg: Language): Language.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Language,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Language;
  static deserializeBinaryFromReader(
    message: Language,
    reader: jspb.BinaryReader,
  ): Language;
}

export namespace Language {
  export type AsObject = {
    sourceFileExt: string;
    binaryFileExt: string;
    compileCommand: string;
    runCommand: string;
  };
}

export class SubmissionResult extends jspb.Message {
  getSubmissionId(): string;
  setSubmissionId(value: string): SubmissionResult;
  getTestCaseId(): string;
  setTestCaseId(value: string): SubmissionResult;
  getStatus(): string;
  setStatus(value: string): SubmissionResult;
  getStdout(): string;
  setStdout(value: string): SubmissionResult;
  getMemoryUsage(): number;
  setMemoryUsage(value: number): SubmissionResult;
  getTimeUsage(): number;
  setTimeUsage(value: number): SubmissionResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmissionResult.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SubmissionResult,
  ): SubmissionResult.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SubmissionResult,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SubmissionResult;
  static deserializeBinaryFromReader(
    message: SubmissionResult,
    reader: jspb.BinaryReader,
  ): SubmissionResult;
}

export namespace SubmissionResult {
  export type AsObject = {
    submissionId: string;
    testCaseId: string;
    status: string;
    stdout: string;
    memoryUsage: number;
    timeUsage: number;
  };
}

export class TestCase extends jspb.Message {
  getId(): string;
  setId(value: string): TestCase;
  getInput(): string;
  setInput(value: string): TestCase;
  getExpectOutput(): string;
  setExpectOutput(value: string): TestCase;
  getInputFile(): string;
  setInputFile(value: string): TestCase;
  getOutputFile(): string;
  setOutputFile(value: string): TestCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TestCase.AsObject;
  static toObject(includeInstance: boolean, msg: TestCase): TestCase.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TestCase,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TestCase;
  static deserializeBinaryFromReader(
    message: TestCase,
    reader: jspb.BinaryReader,
  ): TestCase;
}

export namespace TestCase {
  export type AsObject = {
    id: string;
    input: string;
    expectOutput: string;
    inputFile: string;
    outputFile: string;
  };
}

export class Submission extends jspb.Message {
  getId(): string;
  setId(value: string): Submission;

  hasLanguage(): boolean;
  clearLanguage(): void;
  getLanguage(): Language | undefined;
  setLanguage(value?: Language): Submission;
  getCode(): string;
  setCode(value: string): Submission;
  getTimeLimit(): number;
  setTimeLimit(value: number): Submission;
  getMemoryLimit(): number;
  setMemoryLimit(value: number): Submission;
  clearTestCasesList(): void;
  getTestCasesList(): Array<TestCase>;
  setTestCasesList(value: Array<TestCase>): Submission;
  addTestCases(value?: TestCase, index?: number): TestCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Submission.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: Submission,
  ): Submission.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Submission,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Submission;
  static deserializeBinaryFromReader(
    message: Submission,
    reader: jspb.BinaryReader,
  ): Submission;
}

export namespace Submission {
  export type AsObject = {
    id: string;
    language?: Language.AsObject;
    code: string;
    timeLimitInMs: number;
    memoryLimitInKb: number;
    testCasesList: Array<TestCase.AsObject>;
  };
}
