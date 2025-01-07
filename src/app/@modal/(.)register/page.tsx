"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExternalLogin from "../external-login";

const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "Tên người dùng phải có ít nhất 3 ký tự.",
    }),
    email: z.string().email({
      message: "Vui lòng nhập một địa chỉ email hợp lệ.",
    }),
    password: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterModal() {
  const { back, replace } = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormValues) {
    // Giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Đăng ký thành công!",
      description: "Tài khoản của bạn đã được tạo.",
    });
    console.log(data);
    back();
  }

  return (
    <Dialog open={true} onOpenChange={() => back()}>
      <DialogContent>
        <ScrollArea className="max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Đăng ký</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input placeholder="nguyenvana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nguyenvana@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-2 w-full">
                Đăng ký
              </Button>
            </form>
          </Form>
          <ExternalLogin state="register" />
          <div className="mt-2 text-center">
            <Button variant="link" onClick={() => replace("/login")}>
              Đã có tài khoản? Đăng nhập ngay
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
