-- CreateEnum
CREATE TYPE "TipoTweet" AS ENUM ('TWEET', 'REPLY');

-- CreateTable
CREATE TABLE "Tweet" (
    "id" UUID NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoTweet" NOT NULL DEFAULT 'TWEET',
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "usuarioId" UUID NOT NULL,
    "tweetId" UUID NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("usuarioId","tweetId")
);

-- CreateTable
CREATE TABLE "Reply" (
    "tweetId" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("tweetId","usuarioId")
);

-- CreateTable
CREATE TABLE "Follow" (
    "usuarioId" UUID NOT NULL,
    "followerId" UUID NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("usuarioId","followerId")
);

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
