-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rules" JSONB;

-- CreateTable
CREATE TABLE "Role" (
    "roleId" VARCHAR(100) NOT NULL,
    "roleName" TEXT NOT NULL,
    "description" TEXT,
    "rules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "Resource" (
    "resourceId" VARCHAR(100) NOT NULL,
    "resourceName" TEXT NOT NULL,
    "description" TEXT,
    "fields" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("resourceId")
);

-- CreateTable
CREATE TABLE "Action" (
    "actionId" VARCHAR(100) NOT NULL,
    "actionName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("actionId")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" VARCHAR(100) NOT NULL,
    "B" VARCHAR(100) NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleName_key" ON "Role"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_resourceName_key" ON "Resource"("resourceName");

-- CreateIndex
CREATE UNIQUE INDEX "Action_actionName_key" ON "Action"("actionName");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
