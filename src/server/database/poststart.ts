import { createMongoAbility } from "@casl/ability";
import { Prisma, PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const subject: Prisma.ResourceCreateInput[] = [
  {
    resourceId: "Hint",
    resourceName: "Gợi ý bài toán",
    validActionIds: ["read"],
  },
  {
    resourceId: "Submission",
    resourceName: "Bài nộp",
    validActionIds: [
      "try",
      "read:own",
      "read:any",
      "update:own",
      "update:any",
      "delete:own",
      "delete:any",
      "create",
    ],
  },
];

const action: Prisma.ActionCreateInput[] = [
  {
    actionId: "read",
    actionName: "Đọc",
  },
  {
    actionId: "read:own",
    actionName: "Đọc của bản thân",
  },
  {
    actionId: "read:any",
    actionName: "Đọc tất cả",
  },
  {
    actionId: "try",
    actionName: "Chạy thử",
  },
  {
    actionId: "create",
    actionName: "Tạo",
  },
  {
    actionId: "update:own",
    actionName: "Sửa của bản thân",
  },
  {
    actionId: "update:any",
    actionName: "Sửa tất cả",
  },
  {
    actionId: "delete:own",
    actionName: "Xóa của bản thân",
  },
  {
    actionId: "delete:any",
    actionName: "Xóa tất cả",
  },
  {
    actionId: "manage",
    actionName: "Quản lý",
  },
];

await db.$connect();
await db.resource.deleteMany();
await db.action.deleteMany();
await db.resource.createMany({
  data: subject,
});
await db.action.createMany({
  data: action,
});

// await db.role.create({
//   data: {
//     roleId: "admin",
//     roleName: "Quản trị",
//     rules: [
//       {
//         action: ["manage"],
//         subject: ["all"],
//       },
//     ],
//   },
// });

await db.role.deleteMany({
  where: {
    roleId: "everyone",
  },
});
await db.role.deleteMany({
  where: {
    roleId: "loggedIn",
  },
});

const everyoneRole: Prisma.RoleCreateInput = {
  roleId: "everyone",
  roleName: "everyone",
  description: "Mọi người đều có role này",
  createdAt: new Date(),
  rules: [],
};
type CreateMongoAbilityFirstArg = Parameters<typeof createMongoAbility>[0];
const loggedInRole: Prisma.RoleCreateInput = {
  roleId: "loggedIn",
  roleName: "loggedIn",
  description: "Người dùng đã đăng nhập có role này",
  createdAt: new Date(),
  rules: [
    {
      action: ["read"],
      subject: ["Hint"],
    },
    {
      action: ["try", "read:own", "read:any", "update:own", "create"], // người dùng có thể tạo bài nộp, đọc bài nộp của mình và của người khác, sửa bài nộp của mình
      subject: ["Submission"],
    },
  ],
};

await db.role.create({
  data: everyoneRole,
});
await db.role.create({
  data: loggedInRole,
});
