import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { QueryStudentDto } from './dto/query-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const { dateOfBirth, ...rest } = dto;
    try {
      return await this.prisma.student.create({
        data: {
          ...rest,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        },
        include: { schoolClass: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(query: QueryStudentDto) {
    const { classId, search } = query;
    return this.prisma.student.findMany({
      where: {
        classId,
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { rollNo: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { schoolClass: { select: { name: true, section: true } } },
      orderBy: [{ classId: 'asc' }, { rollNo: 'asc' }],
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { schoolClass: true },
    });
    if (!student) throw new NotFoundException(`Student #${id} nahi mila`);
    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    const { dateOfBirth, ...rest } = dto;
    try {
      return await this.prisma.student.update({
        where: { id },
        data: {
          ...rest,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        },
        include: { schoolClass: true },
      });
    } catch (error) {
      this.handleError(error, id);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.student.delete({ where: { id } });
    } catch (error) {
      this.handleError(error, id);
    }
  }

  private handleError(error: unknown, id?: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new ConflictException('Is class mein ye roll number pehle se maujood hai');
      if (error.code === 'P2025')
        throw new NotFoundException(`Student #${id} nahi mila`);
      if (error.code === 'P2003')
        throw new NotFoundException('Ye classId maujood nahi hai');
    }
    throw error;
  }
}