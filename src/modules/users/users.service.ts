import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    private users = [
        { id: 1, name: 'Felipe' },
        { id: 2, name: 'Test User'}
    ];

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        const user = this.users.find(user => user.id === id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    create(name: string) {
        const newUser = {
            id: this.users.length +1,
            name,
        };

        this.users.push(newUser);

        return newUser;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        const user = this.findOne(id);

        if (updateUserDto.name !== undefined) {
            user.name = updateUserDto.name;
        }

        return user;
    }

    remove(id: number) {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.users.splice(index, 1);
    }
}
