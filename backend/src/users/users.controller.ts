import { Controller, Get, Patch, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getMyProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateMyProfile(@Request() req, @Body() profileData: any) {
    return this.usersService.updateProfile(req.user.sub, profileData);
  }

  @Patch('me/profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiResponse({ status: 200, description: 'Profile picture uploaded successfully' })
  async uploadProfilePicture(@Request() req, @Body() body: { profilePictureUrl: string }) {
    return this.usersService.uploadProfilePicture(req.user.sub, body.profilePictureUrl);
  }

  @Patch('me/travel-preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update travel preferences (travelers only)' })
  @ApiResponse({ status: 200, description: 'Travel preferences updated successfully' })
  async updateTravelPreferences(@Request() req, @Body() preferences: any) {
    return this.usersService.updateTravelPreferences(req.user.sub, preferences);
  }

  @Get('me/tourist-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get traveler profile (travelers only)' })
  @ApiResponse({ status: 200, description: 'Traveler profile retrieved successfully' })
  async getTouristProfile(@Request() req) {
    return this.usersService.getTouristProfile(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.usersService.getAllUsers(limit, offset);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  async searchUsers(
    @Query('q') searchTerm: string,
    @Query('limit') limit?: number
  ) {
    return this.usersService.searchUsers(searchTerm, limit);
  }

  @Get('by-role/:role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users by role' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getUsersByRole(
    @Param('role') role: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.usersService.getUsersByRole(role, limit, offset);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status (admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean }
  ) {
    return this.usersService.updateUserStatus(id, body.isActive);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
} 