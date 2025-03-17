-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "validActionIds" TEXT[] DEFAULT ARRAY['read', 'create', 'update', 'delete']::TEXT[];
