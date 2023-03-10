import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../services/payment.service';
import { PaymentDto } from '../dto/payment.dto';
import axios from 'axios';

jest.mock('axios');

describe('PaymentService', () => {
    let service: PaymentService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => `test_${key}`),
                    },
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createPayment', () => {
        const paymentDto: PaymentDto = {
            amount: 10,
            description: 'Test payment',
            buyerName: 'John Doe',
            buyerEmail: 'john.doe@example.com',
        };

        it('should create payment and return payment URL', async () => {
            const paymentUrl = 'https://checkout.unipaas.com/payments/123';
            axios.post.mockResolvedValueOnce({ data: { data: { payment_url: paymentUrl } } });

            const result = await service.createPayment(paymentDto);

            expect(result).toEqual(paymentUrl);
            expect(axios.post).toHaveBeenCalledWith(
                'https://api.unipaas.com/v1/payments',
                expect.any(Object),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'Bearer test_UNIPAAS_API_KEY.test_UNIPAAS_API_SECRET',
                    },
                },
            );
        });

        it('should throw an error when create payment fails', async () => {
            const error = new Error('Create payment failed');
            axios.post.mockRejectedValueOnce(error);

            await expect(service.createPayment(paymentDto)).rejects.toThrow(error);
        });
    });
});