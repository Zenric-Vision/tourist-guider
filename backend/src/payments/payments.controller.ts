import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create payment order' })
  @ApiResponse({ status: 200, description: 'Payment order created successfully' })
  async createOrder(@Body() body: { amount: number; currency?: string }) {
    return this.paymentsService.createOrder(body.amount, body.currency);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment signature' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyPayment(@Body() body: { paymentId: string; orderId: string; signature: string }) {
    return this.paymentsService.verifyPayment(body.paymentId, body.orderId, body.signature);
  }

  @Get('details/:paymentId')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Payment details retrieved successfully' })
  async getPaymentDetails(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentDetails(paymentId);
  }
} 