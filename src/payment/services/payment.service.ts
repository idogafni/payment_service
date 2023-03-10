import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as querystring from 'querystring';
import { PaymentDto } from '../dto/payment.dto';

@Injectable()
export class PaymentService {
    constructor(private readonly configService: ConfigService) {}

    async createPayment(paymentDto: PaymentDto): Promise<string> {
        const apiUrl = 'https://api.unipaas.com/v1/payments';
        const apiKey = this.configService.get<string>('UNIPAAS_API_KEY');
        const apiSecret = this.configService.get<string>('UNIPAAS_API_SECRET');

        const data = {
            merchant_id: merchantId,
            amount: paymentDto.amount,
            currency: 'USD',
            description: paymentDto.description,
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            callback_url: 'http://localhost:3000/callback',
            buyer_name: paymentDto.buyerName,
            buyer_email: paymentDto.buyerEmail,
        };

        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${apiKey}.${apiSecret}`,
            },
        };

        const response = await axios.post(
            apiUrl,
            querystring.stringify(data),
            options,
        );

        return response.data.data.payment_url;
    }
}