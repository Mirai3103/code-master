import * as grpc from "@grpc/grpc-js";
import {
  ExecutionServiceClient,
  Language,
  Submission,
  TestCase,
} from "./generated/execution_service";

async function main() {
  // Khởi tạo client

  const client = new ExecutionServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure(),
  );

  const language = new Language({
    binary_file_ext: ".out",
    compile_command: "g++ $SourceFileName -o $BinaryFileName",
    source_file_ext: ".cpp",
    run_command: "$BinaryFileName",
  });

  const testCase1 = new TestCase({
    id: "1",
    input: "0",
    expect_output: "0",
  });
  const testCase2 = new TestCase({
    id: "2",
    input: "1",
    expect_output: "1",
  });
  const testCase3 = new TestCase({
    id: "3",
    input: "5",
    expect_output: "5",
  });
  const testCase4 = new TestCase({
    id: "4",
    input: "100",
    expect_output: "3736710778780434371",
  });

  const submission = new Submission({
    id: "123",
    language: language,
    memory_limit: 1024,
    time_limit: 10,
    code: `
#include <iostream>
using namespace std;

long long fibonacci(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1, c;
    for (int i = 2; i <= n; ++i) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    int n;
    cin >> n;
    cout << fibonacci(n);
    return 0;
}
`,
    test_cases: [testCase1, testCase2, testCase3, testCase4],
  });

  const stream = client.Execute(submission);

  // Xử lý kết quả
  stream.on("data", (result) => {
    console.log({
      submissionId: result.submission_id,
      testCaseId: result.test_case_id,
      status: result.status,
      stdout: result.stdout,
      memoryUsage: result.memory_usage,
      timeUsage: result.time_usage,
    });
  });

  stream.on("error", (error) => {
    console.error("Error:", error);
  });

  stream.on("end", () => {
    console.log("Stream ended");
  });
}

main().catch(console.error);
