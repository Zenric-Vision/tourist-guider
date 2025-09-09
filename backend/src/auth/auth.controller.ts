import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TravelerSignupDto } from '../users/dto/traveler.dto';
import { GuiderSignupDto } from '../guides/dto/guider.dto';
import { TravelerLoginDto } from '../users/dto/traveler.dto';
import { GuiderLoginDto } from '../guides/dto/guider.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { 
  ApiAuthResponse, 
  ApiOtpResponse, 
  ApiSuccessResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse
} from '../common/decorators/api-response.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}


  // Traveler Authentication - Streamlined 2-API approach
  @Post('traveler/register')
  @ApiOperation({ summary: 'Register new traveler and send OTP' })
  @ApiAuthResponse('Traveler registered successfully, OTP sent', undefined, true)
  @ApiBadRequestResponse('Bad request')
  @ApiConflictResponse('User already exists')
  async registerTraveler(@Body() signupDto: TravelerSignupDto) {
    return this.authService.registerTraveler(signupDto);
  }

  @Post('traveler/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and complete registration' })
  @ApiAuthResponse('OTP verified, registration completed')
  @ApiUnauthorizedResponse('Invalid OTP')
  async verifyOtpAndCompleteRegistration(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtpAndCompleteRegistration(body.email, body.otp, 'traveler');
  }

  @Post('traveler/resend-otp')
  @ApiOperation({ summary: 'Resend OTP for unverified traveler' })
  @ApiOtpResponse('OTP resent successfully')
  @ApiBadRequestResponse('Bad request')
  async resendOtpForTraveler(@Body() body: { email: string; userName?: string; actionType?: 'registration' | 'login' }) {
    return this.authService.resendOtp(body.email, 'traveler', body.userName, body.actionType || 'registration');
  }

  @Post('traveler/login')
  @ApiOperation({ summary: 'Login traveler' })
  @ApiAuthResponse('Login successful')
  @ApiUnauthorizedResponse('Invalid credentials or account not verified')
  async loginTraveler(@Body() loginDto: TravelerLoginDto) {
    return this.authService.loginTraveler(loginDto);
  }

  // Guider Authentication - Streamlined 2-API approach
  @Post('guider/register')
  @ApiOperation({ summary: 'Register new guider and send OTP' })
  @ApiAuthResponse('Guider registered successfully, OTP sent', undefined, true)
  @ApiBadRequestResponse('Bad request')
  @ApiConflictResponse('User already exists')
  async registerGuider(@Body() signupDto: GuiderSignupDto) {
    return this.authService.registerGuider(signupDto);
  }

  @Post('guider/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and complete guider registration' })
  @ApiAuthResponse('OTP verified, registration completed')
  @ApiUnauthorizedResponse('Invalid OTP')
  async verifyOtpAndCompleteGuiderRegistration(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtpAndCompleteRegistration(body.email, body.otp, 'guider');
  }

  @Post('guider/resend-otp')
  @ApiOperation({ summary: 'Resend OTP for unverified guider' })
  @ApiOtpResponse('OTP resent successfully')
  @ApiBadRequestResponse('Bad request')
  async resendOtpForGuider(@Body() body: { email: string; userName?: string; actionType?: 'registration' | 'login' }) {
    return this.authService.resendOtp(body.email, 'guider', body.userName, body.actionType || 'registration');
  }

  @Post('guider/login')
  @ApiOperation({ summary: 'Login guider' })
  @ApiAuthResponse('Login successful')
  @ApiUnauthorizedResponse('Invalid credentials or account not verified')
  async loginGuider(@Body() loginDto: GuiderLoginDto) {
    return this.authService.loginGuider(loginDto);
  }

  // Password Management
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiSuccessResponse('Password changed successfully')
  @ApiBadRequestResponse('Bad request')
  @ApiUnauthorizedResponse('Unauthorized')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.sub,
      req.user.userType,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
} 