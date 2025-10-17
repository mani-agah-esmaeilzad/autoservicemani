-- CreateTable Category
CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "image" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable Brand
CREATE TABLE "Brand" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logo" TEXT,
  "country" TEXT,
  "founded" INTEGER,
  "tagline" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable Product
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "longDescription" TEXT,
  "price" INTEGER NOT NULL,
  "brand" TEXT NOT NULL,
  "image" TEXT,
  "categoryId" TEXT NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "inStock" INTEGER NOT NULL DEFAULT 0,
  "tags" TEXT[] NOT NULL,
  "sku" TEXT NOT NULL,
  "highlights" TEXT[] NOT NULL,
  "gallery" JSONB,
  "specifications" JSONB,
  "compatibility" TEXT[] NOT NULL,
  "warranty" TEXT,
  "shipping" TEXT,
  "maintenanceTips" TEXT[] NOT NULL,
  "faqs" JSONB,
  "questions" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "brandId" TEXT,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable Order
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "total" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "items" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
