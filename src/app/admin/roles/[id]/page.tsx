import { trpc } from "@/trpc/server";
import EditForm from "./form";
import { notFound } from "next/navigation";

const RoleManagement = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const role = await trpc.roles.getRole({ roleId: id });
  if (!role) {
    notFound();
  }
  return <EditForm role={role} />;
};

export default RoleManagement;
