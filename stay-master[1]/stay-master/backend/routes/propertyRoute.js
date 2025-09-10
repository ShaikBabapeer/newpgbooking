import express from "express";
import { createProperty ,getAllProperties,getPropertyById,getMyListings, deletePropertyByOwner} from "../controllers/propertyController.js";
import upload from "../middleware/multer.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const propertyRouter = express.Router()

propertyRouter.post(
  "/property/create",
  isAuthenticated,
  upload.array("images", 5),
  createProperty
);
propertyRouter.get("/property/all", getAllProperties);
propertyRouter.get("/property/my", isAuthenticated, getMyListings);
propertyRouter.get("/property/:id", getPropertyById);
propertyRouter.delete("/property/:id", isAuthenticated, deletePropertyByOwner);
export default propertyRouter