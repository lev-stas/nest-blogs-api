import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDtoType } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(adminCreation: boolean, dto: CreateUserDtoType) {
    const salt = await genSalt(10);
    const passHash = await hash(dto.password, salt);
    const userToCreate = {
      id: uuidv4(),
      login: dto.login,
      email: dto.email,
      salt: salt,
      passHash: passHash,
      createdAt: new Date().toISOString(),
      isConfirmed: adminCreation ? true : false,
      emailConfirmation: {},
    };
    const newUser = new this.userModel(userToCreate);
    const saveUserResult = await newUser.save();
    const userUserToResponse = await this.userModel.findOne(
      { id: userToCreate.id },
      {
        id: 1,
        login: 1,
        email: 1,
        createdAt: 1,
        _id: 0,
      },
    );
    if (!userUserToResponse) {
      throw new Error("User can't be created");
    }
    return userUserToResponse;
  }

  async getAllUsers(
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pageNumber = 1,
    pageSize = 10,
    searchLoginTerm = '/*',
    searchEmailTerm = '/*',
  ) {
    const directionOfSort = sortDirection === 'desc' ? -1 : 1;
    const skipNumber = pageNumber < 2 ? 0 : (pageNumber - 1) * pageSize;
    const totalUsers = await this.userModel.countDocuments({
      $and: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });
    const users = await this.userModel
      .find(
        {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        },
        {
          id: 1,
          login: 1,
          email: 1,
          createdAt: 1,
          _id: 0,
        },
      )
      .sort({ [sortBy]: directionOfSort })
      .skip(skipNumber)
      .limit(pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(totalUsers / pageSize),
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalUsers,
      items: users,
    };
  }

  async deleteUserById(id: string) {
    const deletionResult = await this.userModel.deleteOne({ id: id });
    console.log(deletionResult.deletedCount);
    return deletionResult.deletedCount > 0;
  }

  async deleteAllUsers() {
    return this.userModel.deleteMany({});
  }
}
