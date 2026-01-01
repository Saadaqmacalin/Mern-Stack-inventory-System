import Products from "../Models/products.js";
import { StatusCodes } from "http-status-codes";

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
        .json({ message: "All fields must be provided, including an image" });
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
    console.error("Error occurred while adding a product:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: "Something went wrong while adding the product",
        message: error.message,
      });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    if (products === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Not Found any product" });
    }
    res.status(StatusCodes.OK).json({ products });
  } catch (error) {
    console.error(`Error ocured while retreiving products: ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wronge while getting all the products",
    });
  }
};

const updateProduct = async (req,res)=>{
  
}

export { addProduct, getProducts };
