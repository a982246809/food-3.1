import { Controller, Post, Body, UseGuards, Request, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { Role } from '../generated/prisma/client.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.userName || body.username, body.password);
    if (!user) {
      return { code: '1001', msg: '账号或密码错误', data: null };
    }
    const tokenData = await this.authService.login(user);
    const { password, ...userWithoutPassword } = user;
    return {
      token: tokenData.access_token,
      refreshToken: tokenData.access_token,
      user: userWithoutPassword
    };
  }

  @Post('register')
  async register(@Body() body: any) {
    const data = await this.authService.register(body);
    return {
      token: data.access_token,
      refreshToken: data.access_token,
      user: data.user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserInfo')
  getUserInfo(@Request() req: any) {
    const user = req.user;
    
    // Map backend Prisma roles to frontend expected roles
    let userRole = user.role;
    if (user.role === Role.ADMIN) {
      userRole = 'R_SUPER'; // Map to Soybean Admin's VITE_STATIC_SUPER_ROLE
    } else if (user.role === Role.MERCHANT) {
      userRole = 'R_MERCHANT'; 
    }

    return {
      userId: user.id || user.sub,
      userName: user.username,
      roles: [userRole],
      buttons: []
    };
  }
}
