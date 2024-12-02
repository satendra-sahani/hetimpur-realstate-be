import { RequestHandler } from "express";
import User from "../models/User";
export const getUser: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
        }
        const user = await User.findOne({ _id: userId }).select({password:0,approved:0}).lean();
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};