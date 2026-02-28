import { PrismaClient } from '../src/generated/prisma/client.js';
import { Role } from '../src/generated/prisma/enums.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'canteen',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // hash 密码统一为 123456
  const password = await bcrypt.hash('123456', 10);

  console.log('开始初始化数据...');

  console.log('清空旧数据避免重复...');
  await prisma.order.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.window.deleteMany();
  // 先把商户绑定的食堂解除，以免因为外键约束无法删除食堂
  await prisma.user.updateMany({
    where: { role: Role.MERCHANT },
    data: { canteenId: null },
  });
  await prisma.canteen.deleteMany();

  // 1. 创建管理员 (已使用upsert)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password,
      role: Role.ADMIN,
    },
  });
  console.log('✅ 管理员创建成功 (admin / 123456)');

  // 2. 创建食堂
  const canteen1 = await prisma.canteen.create({
    data: { name: '第一食堂' },
  });

  const canteen2 = await prisma.canteen.create({
    data: { name: '第二食堂' },
  });
  console.log('✅ 食堂创建成功');

  // 3. 创建窗口
  const window1 = await prisma.window.create({
    data: {
      name: '黄焖鸡米饭',
      canteenId: canteen1.id,
    },
  });

  const window2 = await prisma.window.create({
    data: {
      name: '兰州拉面',
      canteenId: canteen1.id,
    },
  });
  console.log('✅ 窗口创建成功');

  // 4. 创建商户
  const merchant = await prisma.user.upsert({
    where: { username: 'merchant' },
    update: { canteenId: canteen1.id },
    create: {
      username: 'merchant',
      password,
      role: Role.MERCHANT,
      canteenId: canteen1.id,
    },
  });
  console.log('✅ 商户账号创建成功 (merchant / 123456)');

  // 5. 创建学生
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: {
      username: 'student',
      password,
      role: Role.STUDENT,
      balance: 100.00,
    },
  });
  console.log('✅ 学生账号创建成功 (student / 123456)');

  // 6. 创建菜品 (带有真实的 Unsplash 菜品图片)
  await prisma.dish.createMany({
    data: [
      {
        name: '大份黄焖鸡',
        price: 18.0,
        stock: 50,
        windowId: window1.id,
        isSpecial: true,
        imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80', // 鸡肉类图片
      },
      {
        name: '小份黄焖鸡',
        price: 15.0,
        stock: 50,
        windowId: window1.id,
        imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4fe43f11e?w=500&q=80', // 另一张鸡肉类图片
      },
      {
        name: '牛肉拉面',
        price: 12.0,
        stock: 100,
        windowId: window2.id,
        imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&q=80', // 拉面图片
      },
      {
        name: '羊肉烩面',
        price: 15.0,
        stock: 30,
        windowId: window2.id,
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80', // 面汤图片
      },
    ],
  });
  console.log('✅ 菜品初始数据创建成功 (包含图片)');

  console.log('所有假数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('初始化数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
