import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Endpoint para fazer login' })
  @Post()
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }
}
