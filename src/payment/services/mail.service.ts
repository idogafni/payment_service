import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {
    }

    async sendPaymentConfirmation(to: string): Promise<void> {
        const emailUser = this.configService.get<string>('EMAIL_USER');
        const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

        const transporter = nodemailer.createTransport
    }
}