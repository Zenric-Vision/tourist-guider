import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor() {
    const Razorpay = require('razorpay');
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string = 'INR') {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return {
        orderId: order.id,
        amount: amount,
        currency: currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    const text = `${orderId}|${paymentId}`;
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature === signature) {
      return {
        verified: true,
        paymentId: paymentId,
        orderId: orderId,
      };
    } else {
      throw new Error('Payment verification failed');
    }
  }

  async getPaymentDetails(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        id: payment.id,
        amount: Number(payment.amount) / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        captured: payment.captured,
        description: payment.description,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at,
      };
    } catch (error) {
      throw new Error(`Failed to fetch payment details: ${error.message}`);
    }
  }
} 