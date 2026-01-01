import Products from "../Models/products.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      image,
      categoryId,
      supplierId,
      description,
      price,
      costPrice,
      status,
    } = req.body || {};
    // const image = req.file ? req.file.path : null;

    if (
      !productName ||
      !image ||
      !categoryId ||
      !supplierId ||
      !description ||
      !price ||
      !costPrice ||
      !status
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields must be provided" });
    }

    const product = await Products.create({
      productName,
      image,
      categoryId,
      supplierId,
      description,
      price,
      costPrice,
      status,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Products.find({})
      .populate("categoryId", "name")
      .populate("supplierId", "name");

    if (products.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No products found" });
    }

    res.status(StatusCodes.OK).json({ products });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving products",
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Products.findById(id)
      .populate("categoryId", "name")
      .populate("supplierId", "name");

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    console.error(`Error ocured while getting a single prodct`, error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wronge while getting a single error",
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.body.price <= req.body.costPrice) {
      return res.status(400).json({
        message: "price must be greater than cost price",
      });
    }

    Object.assign(product, req.body);

    await product.save(); // ✅ full document validation works

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
