-- CreateTable
CREATE TABLE "page" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "template" VARCHAR(100),
    "metadata" JSONB,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_locale" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,

    CONSTRAINT "page_locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_version" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "page_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "featuredImage" VARCHAR(500),
    "metadata" JSONB,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_locale" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,

    CONSTRAINT "post_locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_version" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "post_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "category" VARCHAR(100),
    "featuredImage" VARCHAR(500),
    "metadata" JSONB,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_locale" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,

    CONSTRAINT "news_locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_version" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "news_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "location" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "label" JSONB NOT NULL,
    "url" VARCHAR(500),
    "pageId" TEXT,
    "postId" TEXT,
    "newsId" TEXT,
    "target" VARCHAR(20) NOT NULL DEFAULT '_self',
    "cssClass" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_collection" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "link_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" JSONB NOT NULL,
    "description" JSONB,
    "url" VARCHAR(500) NOT NULL,
    "imageUrl" VARCHAR(500),
    "target" VARCHAR(20) NOT NULL DEFAULT '_self',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "pageId" TEXT,
    "postId" TEXT,
    "newsId" TEXT,
    "parentId" TEXT,
    "authorName" VARCHAR(255) NOT NULL,
    "authorEmail" VARCHAR(255) NOT NULL,
    "authorUrl" VARCHAR(500),
    "authorIp" VARCHAR(45),
    "content" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "moderatedBy" VARCHAR(255),
    "moderatedAt" TIMESTAMP(3),
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slug_redirect" (
    "id" TEXT NOT NULL,
    "contentType" VARCHAR(20) NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "fromSlug" VARCHAR(255) NOT NULL,
    "toDocumentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slug_redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "permissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "userId" VARCHAR(255) NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateIndex
CREATE INDEX "page_status_idx" ON "page"("status");

-- CreateIndex
CREATE INDEX "page_parentId_idx" ON "page"("parentId");

-- CreateIndex
CREATE INDEX "page_documentId_idx" ON "page"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "page_documentId_status_key" ON "page"("documentId", "status");

-- CreateIndex
CREATE INDEX "page_locale_locale_idx" ON "page_locale"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "page_locale_pageId_locale_key" ON "page_locale"("pageId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "page_locale_locale_slug_key" ON "page_locale"("locale", "slug");

-- CreateIndex
CREATE INDEX "page_version_documentId_idx" ON "page_version"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "page_version_documentId_version_key" ON "page_version"("documentId", "version");

-- CreateIndex
CREATE INDEX "post_status_idx" ON "post"("status");

-- CreateIndex
CREATE INDEX "post_documentId_idx" ON "post"("documentId");

-- CreateIndex
CREATE INDEX "post_publishedAt_idx" ON "post"("publishedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "post_documentId_status_key" ON "post"("documentId", "status");

-- CreateIndex
CREATE INDEX "post_locale_locale_idx" ON "post_locale"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "post_locale_postId_locale_key" ON "post_locale"("postId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "post_locale_locale_slug_key" ON "post_locale"("locale", "slug");

-- CreateIndex
CREATE INDEX "post_version_documentId_idx" ON "post_version"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "post_version_documentId_version_key" ON "post_version"("documentId", "version");

-- CreateIndex
CREATE INDEX "news_status_idx" ON "news"("status");

-- CreateIndex
CREATE INDEX "news_documentId_idx" ON "news"("documentId");

-- CreateIndex
CREATE INDEX "news_category_idx" ON "news"("category");

-- CreateIndex
CREATE INDEX "news_publishedAt_idx" ON "news"("publishedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "news_documentId_status_key" ON "news"("documentId", "status");

-- CreateIndex
CREATE INDEX "news_locale_locale_idx" ON "news_locale"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "news_locale_newsId_locale_key" ON "news_locale"("newsId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "news_locale_locale_slug_key" ON "news_locale"("locale", "slug");

-- CreateIndex
CREATE INDEX "news_version_documentId_idx" ON "news_version"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "news_version_documentId_version_key" ON "news_version"("documentId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "menu_name_key" ON "menu"("name");

-- CreateIndex
CREATE INDEX "menu_item_menuId_idx" ON "menu_item"("menuId");

-- CreateIndex
CREATE INDEX "menu_item_parentId_idx" ON "menu_item"("parentId");

-- CreateIndex
CREATE INDEX "menu_item_menuId_order_idx" ON "menu_item"("menuId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "link_collection_name_key" ON "link_collection"("name");

-- CreateIndex
CREATE INDEX "link_collectionId_idx" ON "link"("collectionId");

-- CreateIndex
CREATE INDEX "link_collectionId_order_idx" ON "link"("collectionId", "order");

-- CreateIndex
CREATE INDEX "comment_pageId_idx" ON "comment"("pageId");

-- CreateIndex
CREATE INDEX "comment_postId_idx" ON "comment"("postId");

-- CreateIndex
CREATE INDEX "comment_newsId_idx" ON "comment"("newsId");

-- CreateIndex
CREATE INDEX "comment_parentId_idx" ON "comment"("parentId");

-- CreateIndex
CREATE INDEX "comment_status_idx" ON "comment"("status");

-- CreateIndex
CREATE INDEX "comment_createdAt_idx" ON "comment"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "slug_redirect_toDocumentId_idx" ON "slug_redirect"("toDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "slug_redirect_contentType_locale_fromSlug_key" ON "slug_redirect"("contentType", "locale", "fromSlug");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE INDEX "user_role_userId_idx" ON "user_role"("userId");

-- CreateIndex
CREATE INDEX "user_role_roleId_idx" ON "user_role"("roleId");

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_locale" ADD CONSTRAINT "page_locale_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_locale" ADD CONSTRAINT "post_locale_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_locale" ADD CONSTRAINT "news_locale_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menu_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link" ADD CONSTRAINT "link_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "link_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
