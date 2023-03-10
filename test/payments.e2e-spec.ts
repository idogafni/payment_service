import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PaymentDto } from '../dto/payment.dto';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('PaymentController (e2e)', () => {
    let app: INestApplication;
    let paymentId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/payments (POST)', async () => {
        const paymentDto: PaymentDto = {
            amount: 10,
            description: 'Test payment',
            buyerName: 'John Doe',
            buyerEmail: 'john.doe@example.com',
        };
        const response = await request(app.getHttpServer())
            .post('/payments')
            .send(paymentDto)
            .expect(201);
        expect(response.body.paymentUrl).toBeDefined();
        const paymentUrl = response.body.paymentUrl;
        expect(paymentUrl).toContain('https://checkout.unipaas.com/payments/');
        paymentId = paymentUrl.split('/').pop();
    });

    it('/success (GET)', async () => {
        await request(app.getHttpServer())
            .get('/success')
            .query({ payment_id: paymentId })
            .expect(200);
    });

    it('/cancel (GET)', async () => {
        await request(app.getHttpServer())
            .get('/cancel')
            .query({ payment_id: paymentId })
            .expect(200);
    });

    it('/callback (POST)', async () => {
        await request(app.getHttpServer())
            .post('/callback')
            .send({ payment_id: paymentId, status: 'success' })
            .expect(201);
    });
});