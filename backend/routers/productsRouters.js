const express = require("express");
const router = express.Router();

const { addProduct } = require("../controllers/products");

router.route("/").post(addProduct)