const express = require("express");
const { PrismaClient } = require("@prisma/client");

const multer = require("multer");

const prisma = new PrismaClient();

const storage = multer.memoryStorage();

const upload = multer({ storage });

const app = express();
app.use(express.json());

app.post("/product", upload.single("file"), async (req, res) => {
  try {
    const { name, price, size, type } = req.body;

    if (!name || !price || !size || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        ...req.body,
        price: Number(price),
      },
    });

    return res.status(201).json(product);
  } catch (e) {
    return e;
  }
});

app.get("/product", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    res.json({
      data: products,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/product/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    res.json({
      message: "Produto deletado com sucesso",
      product: deletedProduct,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(500).json({ error: "Erro ao deletar o produto" });
  }
});

app.put("/product/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, size, type, status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        size,
        type,
        status,
      },
    });

    res.json({
      message: "Produto atualizado com sucesso",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(500).json({ error: "Erro ao atualizar o produto" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
