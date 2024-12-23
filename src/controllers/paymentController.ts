import { RequestHandler } from "express";
import Razorpay from "razorpay";
import { razorpayConfig } from "../utils/razorpay.config";
import User from "../models/User";
import Land from "../models/Land";
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id || '',
  key_secret: razorpayConfig.key_secret || ''
});

// Generate payment link
export const generatePaymentLink: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    let {  amount, currency, customerName,landId } = req.body;  

    // Validation check
    if(req.user?.role=="user" || req.user?.role=="client"){
      const user=await User.findOne({_id:req.user.id})
      amount=10;
      currency="INR";
      customerName=user?.name;
    }
    if (!amount || !currency || !customerName ) {
      res.status(400).json({ message: "Missing required parameters" });
      return; // Ensuring it returns void
    }

    let callback_url
    if(req.user?.role=="client"){
       callback_url=`http://localhost:3000/payment/checking?landId=${landId}`;
    }else{
      callback_url=`http://localhost:3000/payment/checking/`;
    }

    const options = {
      amount: amount * 100, // Amount in smallest currency unit (paise for INR)
      currency: currency || "INR",
      description: "Payment for the order",
      customer: {
        name: customerName,
        // email: customerEmail,
      },
      notify: {
        // email: true,
        sms: true, // Enable notifications to customer via SMS and Email
      },
      callback_url: callback_url, // Optional: Your backend callback URL
    };


    // Use Razorpay's Payment Link API to create a payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: options.amount,
      currency: options.currency,
      description: options.description,
      customer: {
        name: options.customer.name,
        // email: options.customer.email,
      },
      notify: options.notify,
      callback_url: options.callback_url,
    });

   
     // Access the user id from req.user
     const userId = req?.user?.id; // Now TypeScript will know this exists

     if (!userId) {
        res.status(500).json({ message: "Failed to create payment link" });
        return;
     }else{
        await User.updateOne({_id:userId},{$set:{
            linkId:paymentLink.id
        }})
     }
 

    if (!paymentLink) {
      res.status(500).json({ message: "Failed to create payment link" });
      return; // Ensuring it returns void
    }

    res.status(201).json({
      success: true,
      paymentLink: paymentLink.short_url, // Payment link to be sent to the customer
      amount: paymentLink.amount,
      currency: paymentLink.currency,
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    next(error);
  }
};
export const callBackAfterPayment: RequestHandler = async (req, res, next) => {
    try {
      const { razorpay_payment_id,landId } = req.body;
      // Validate required parameters
      if (!razorpay_payment_id) {
         res.status(400).json({ message: "Missing required parameters: razorpay_payment_id" });
      }
  
      // Fetch payment details from Razorpay
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id as string);
  
      // Check the payment status
      if (paymentDetails.status === "captured") {
        // Payment is successful
        if(req.user?.role=="client" && landId){
          await Land.updateOne({client:req.user?.id,_id:landId},{
            $set:{
              paymentStatus:true
            }
          })
        }else{
          await User.updateOne({_id:req.user?.id},{
            $set:{
              approved:true
            }
          })
        }
        
         res.status(200).json({
          success: true,
          message: "Payment completed successfully",
          paymentId: razorpay_payment_id,
          paymentStatus: paymentDetails.status
        });
      } else if (paymentDetails.status === "failed") {
        // Payment failed
         res.status(400).json({
          success: false,
          message: "Payment failed",
          paymentId: razorpay_payment_id,
          paymentStatus: paymentDetails.status,
          reason: paymentDetails.error_description || "Unknown error"
        });
      } else {
        // Payment is still pending or in another state
         res.status(400).json({
          success: false,
          message: `Payment not completed. Current status: ${paymentDetails.status}`,
          paymentId: razorpay_payment_id,
          paymentStatus: paymentDetails.status
        });
      }
    } catch (error) {
      // Handle any errors
      console.error("Error fetching payment details:", error);
       next(error)
    }
  };