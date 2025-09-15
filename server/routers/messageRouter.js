import express from "express";
import { getMessage, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users",protectRoute ,getUserForSidebar);
messageRouter.get("/:id",protectRoute ,getMessage);
messageRouter.get("/mark/:id",protectRoute ,markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;