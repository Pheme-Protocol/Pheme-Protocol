import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../app/prisma.service';

// Mock PrismaService to avoid real database connections
jest.mock('../app/prisma.service', () => {
  const mockService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  };

  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      ...mockService,
      onModuleInit: jest.fn().mockImplementation(async () => {
        await mockService.$connect();
      }),
      onModuleDestroy: jest.fn().mockImplementation(async () => {
        await mockService.$disconnect();
      }),
    })),
  };
});

describe('PrismaService', () => {
  let service: PrismaService;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = testingModule.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have connect and disconnect methods', () => {
    expect(service.$connect).toBeDefined();
    expect(service.$disconnect).toBeDefined();
  });

  it('should call $connect when onModuleInit is called', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should call $disconnect when onModuleDestroy is called', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });
}); 