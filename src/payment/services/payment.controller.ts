import { Body, Controller, Post } from '@nestjs/common';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    async createPayment(@Body() paymentDto: PaymentDto): Promise<{ paymentUrl: string }> {
        const paymentUrl = await this.paymentService.createPayment(paymentDto);
        return { paymentUrl };
    }
}