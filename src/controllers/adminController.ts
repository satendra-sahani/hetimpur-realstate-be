import { RequestHandler } from "express";
import User from "../models/User";
import Land from "../models/Land";

export const getUserList: RequestHandler = async (req, res, next) => {
    try {
        const { userType } = req.params;
        const { isPaymentRequest } = req.query;

        let filter: any = {};
        if (isPaymentRequest) {
            filter.isPaymentRequest = { $exists: true };
        }
        if (userType) {
            filter.role = userType.toLowerCase();
        }
        const data = await User.find(filter).select({ password: 0 }).sort({createdAt:-1}).lean();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

export const getDashboard: RequestHandler = async (req, res, next) => {
    try {
        const clients = await User.countDocuments({role:"client"});
        const users = await User.countDocuments({role:"user"});
        const totalPost = await Land.countDocuments();
        res.status(200).json({
            data:{
                clients,
                users,
                totalPost
            }
        });
    } catch (error) {
        next(error);
    }
};
