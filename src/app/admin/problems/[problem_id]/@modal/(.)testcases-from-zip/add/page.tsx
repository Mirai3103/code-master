"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  LuCircleCheck as CheckCircle2,
  LuLoader as Loader2,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
interface IFormState {
  file?: File;
}

export default function CreateTestcaseFromZipModal({
  params,
}: {
  params: Promise<{ problem_id: string }>;
}) {
  const { back, refresh } = useRouter();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const form = useForm<IFormState>({
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: IFormState) => {
    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", data.file!);
    formData.append("problemId", (await params).problem_id);

    // Simulating file upload with a delay
    // Replace this with your actual upload logic
    try {
      await fetch("/api/testcases/from-zip", {
        method: "POST",
        body: formData,
      });

      setUploadStatus("success");

      back();
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      form.setError("file", {
        type: "manual",
        message: "An error occurred during upload.",
      });
      alert("An error occurred during upload.");
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        back();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tải lên testcases từ file .zip</DialogTitle>
          <DialogDescription>
            Tải xuống các trường hợp kiểm thử mẫu từ thử thách Hello World để
            hiểu định dạng tệp .zip.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              rules={{
                required: "Vui lòng chọn file .zip",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                      placeholder="Chọn file .zip"
                      disabled={uploadStatus === "uploading"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {uploadStatus === "success" && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>File uploaded successfully!</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={
                uploadStatus === "uploading" || uploadStatus === "success"
              }
            >
              {uploadStatus === "uploading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải lên ...
                </>
              ) : uploadStatus === "success" ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Đã tải lên
                </>
              ) : (
                "Tải lên"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
