import Categories from "../Models/category.js";
import { StatusCodes } from "http-status-codes";

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body || {};
    if (!name || !description) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "name and description must be provide" });
    }
    const exists = await Categories.findOne({ name });
    if (exists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "category already added" });
    }
    const category = await Categories.create({ ...req.body });
    res
      .status(StatusCodes.OK)
      .json({ messge: "Category added succeesfully", category });
  } catch (error) {
    console.log("error ocured while adding category", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "something went wronge while adding category",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find({});
    if (categories === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "not found any category" });
    }
    res
      .status(StatusCodes.OK)
      .json({ totalCategories: categories.length, categories });
  } catch (error) {
    console.log("error ocured while getting the categories", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wronge while getting the categories" });
  }
};
const getaSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findById(id);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "not found the category " });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "the category is found ", category });
  } catch (error) {
    console.log(`error ocured while getting a single category ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      messge: "something went wronge while getting a single category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name && !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "please provide at least one feild to update",
      });
    }
    const category = await Categories.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "the category you want to update does not exist" });
    }
    res.status(StatusCodes.OK).json({ message: "category updated", category });
  } catch (error) {
    console.log(`error ocured while updatting a category ${error}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: "something went wronge while updating a category",
        error: error.message,
      });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "the category does not exists" });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "the category has been deleted ", category });
  } catch (error) {
    console.log(`error ocured while deleting a category ${error}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: "something went wronge while deleting a category",
        error: error.message,
      });
  }
};

export {
  addCategory,
  getAllCategories,
  getaSingleCategory,
  updateCategory,
  deleteCategory
};
