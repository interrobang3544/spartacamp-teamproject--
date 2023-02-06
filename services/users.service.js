const UserRepository = require('../repositories/users.repository');
const ProductRepository = require('../repositories/products.repository');
const OrderRepository = require('../repositories/orders.repository');
const { User, Product, Order } = require('../models');

class UserService {
  userRepository = new UserRepository(User);
  productRepository = new ProductRepository(Product);
  orderRepository = new OrderRepository(Order);

  findById = async (id) => {
    try {
      const userById = await this.userRepository.findById(id);

      return userById.map((user) => {
        return {
          userId: user.userId,
          id: user.id,
          password: user.password,
          nickname: user.nickname,
          email: user.email,
          address: user.address,
        };
      });
    } catch (error) {
      throw error;
    }
  };

  findByUserId = async (userId) => {
    try {
      const userByUserId = await this.userRepository.getUserDataById(userId);

      return userByUserId.map((user) => {
        return {
          userId: user.userId,
          id: user.id,
          password: user.password,
          nickname: user.nickname,
          email: user.email,
          address: user.address,
        };
      });
    } catch (error) {
      throw error;
    }
  };

  findByNickname = async (nickname) => {
    try {
      const userByNIckname = await this.userRepository.findByNickname(nickname);

      // 얘는 다 불러와 줄 필요는 없음
      return userByNIckname.map((user) => {
        return {
          id: user.id,
          password: user.password,
          nickname: user.nickname,
          email: user.email,
          address: user.address,
        };
      });
    } catch (error) {
      throw error;
    }
  };

  createUser = async (id, hashed, nickname, email, address) => {
    try {
      const createUserData = await this.userRepository.createUser(
        id,
        hashed,
        nickname,
        email,
        address
      );

      return {
        id: createUserData.id,
        password: createUserData.password,
        nickname: createUserData.nickname,
        email: createUserData.email,
        address: createUserData.address,
      };
    } catch (error) {
      throw error;
    }
  };

  getUserDataById = async (userId) => {
    try {
      const userData = await this.userRepository.getUserDataById(userId);
      const orderData = await this.orderRepository.getOrderDataById(userId);

      if (userData.length < 1) {
        const error = new Error({ messaeg: '회원정보가 없습니다.' });
        throw error;
      }

      const user = userData.map((data) => {
        return {
          id: data.id,
          nickname: data.nickname,
          email: data.email,
          address: data.address,
        };
      });

      const order = await Promise.all(
        orderData.map(async (data) => {
          const orderCreateAt = data.createdAt;
          const productData = await this.productRepository.getProductDataById(
            data.productId
          );
          const orderList = await productData.map((data) => {
            return {
              productName: data.productName,
              productExp: data.productExp,
              price: data.price,
              productPhoto: data.productPhoto,
              orderCreateAt: orderCreateAt,
              userCount: data.userCount,
            };
          });
          return orderList;
        })
      );

      return { user, order };
    } catch (error) {
      throw error;
    }
  };

  changeUserData = async (userId, hashed, nickname, email, address) => {
    try {
      const changeUserData = await this.userRepository.changeUserData(
        userId,
        hashed,
        nickname,
        email,
        address
      );

      return changeUserData;
    } catch (error) {
      throw error;
    }
  };

  adminFindAllUsers = async (limit, offset) => {
    const users = await this.userRepository.adminFindAllUsers(limit, offset);

    return users;
  };

  adminFindUsersBySearchWord = async (searchWord) => {
    const users = await this.userRepository.adminFindUsersBySearchWord(
      searchWord
    );
    return users.map((user) => {
      return {
        userId: user.userId,
        id: user.id,
        password: user.password,
        nickname: user.nickname,
        email: user.email,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  };

  updateUser = async (userId, id, nickname, email, address) => {
    const findUser = await this.userRepository.findUserById(userId);
    if (!findUser) throw new Error("Review doesn't exist");

    await this.userRepository.updateUser(userId, id, nickname, email, address);

    const updateUser = await this.userRepository.findUserById(userId);

    return {
      userId: updateUser.userId,
      id: updateUser.id,
      nickname: updateUser.nickname,
      email: updateUser.email,
      address: updateUser.address,
      createdAt: updateUser.createdAt,
      updatedAt: updateUser.updatedAt,
    };
  };

  deleteUser = async (userId) => {
    const findUser = await this.userRepository.findUserById(userId);
    if (!findUser) throw new Error("Review doesn't exist");

    await this.userRepository.deleteUser(userId);

    return {
      userId: findUser.userId,
      id: findUser.id,
      password: findUser.password,
      nickname: findUser.nickname,
      email: findUser.email,
      address: findUser.address,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
    };
  };
}

module.exports = UserService;
