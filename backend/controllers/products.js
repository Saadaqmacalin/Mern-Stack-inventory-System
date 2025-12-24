const products = require("../Models/products");
const { StatusCodes } = require("http-status-codes");

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      categoryId,
      supplierId,
      description,
      price,
      costPrice,
      status,
    } = req.body || {};

    if (
      !productName ||
      !categoryId ||
      !supplierId ||
      !description ||
      !price ||
      !costPrice ||
      !status
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All feilds must be provided" });
    }
    const product = await products.create({ ...req.body });
    res
      .status(StatusCodes.OK)
      .json({ message: "Product add successfully", product });
  } catch (error) {
    console.error("error ocured while adding  aproduct", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wronge while adding category" });
  }
};




module.exports={
    addProduct
}