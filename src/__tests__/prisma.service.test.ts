import { PrismaService } from '../app/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeAll(() => {
    service = new PrismaService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}); 