import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    private removePassword(user: any) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(user => this.removePassword(user));
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.removePassword(user);
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: await bcrypt.hash(createUserDto.password, 10),
                },
            });
    
            return this.removePassword(user);
        
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            )  {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });
    }
}
