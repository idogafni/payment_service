import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../services/mail.service';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
    let service: MailService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => `test_${key}`),
                    },
                },
            ],
        }).compile();

        service = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});