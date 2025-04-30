const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
