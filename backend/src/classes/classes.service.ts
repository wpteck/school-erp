import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassDto) {
    try {
      return await this.prisma.schoolClass.create({ data: dto });
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll() {
    return this.prisma.schoolClass.findMany({
      orderBy: [{ name: 'asc' }, { section: 'asc' }],
      include: { _count: { select: { students: true } } },
    });
  }

  async findOne(id: number) {
    const schoolClass = await this.prisma.schoolClass.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!schoolClass) throw new NotFoundException(`Class #${id} nahi mili`);
    return schoolClass;
  }

  async update(id: number, dto: UpdateClassDto) {
    try {
      return await this.prisma.schoolClass.update({ where: { id }, data: dto });
    } catch (error) {
      this.handleError(error, id);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.schoolClass.delete({ where: { id } });
    } catch (error) {
      this.handleError(error, id);
    }
  }

  // Prisma ke errors ko saaf HTTP errors mein badlo
  private handleError(error: unknown, id?: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new ConflictException('Ye class aur section pehle se maujood hai');
      if (error.code === 'P2025')
        throw new NotFoundException(`Class #${id} nahi mili`);
      if (error.code === 'P2003')
        throw new ConflictException(
          'Is class mein students hain, pehle unhein hatayein ya doosri class mein bhejein',
        );
    }
    throw error;
  }
}