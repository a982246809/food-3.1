import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { Role } from '../generated/prisma/client.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.userName || body.username, body.password);
    if (!user) {
      return { code: '8888', msg: 'Invalid credentials', data: null };
    }
    const tokenData = await this.authService.login(user);
    return {
      token: tokenData.access_token,
      refreshToken: tokenData.access_token
    };
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserInfo')
  getUserInfo(@Request() req: any) {
    const user = req.user;
    return {
      userId: user.id || user.sub,
      userName: user.username,
      roles: [user.role],
      buttons: []
    };
  }
}
