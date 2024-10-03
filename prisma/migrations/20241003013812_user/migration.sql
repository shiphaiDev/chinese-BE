-- CreateTable
CREATE TABLE "tbl_lineuid" (
    "id" SERIAL NOT NULL,
    "line_uid" TEXT NOT NULL,

    CONSTRAINT "tbl_lineuid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "mount" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "hrs" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sex" BOOLEAN NOT NULL,
    "lineId" INTEGER NOT NULL,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_lineuid_line_uid_key" ON "tbl_lineuid"("line_uid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_lineId_key" ON "tbl_user"("lineId");

-- AddForeignKey
ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "tbl_lineuid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
