import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (ban/unban)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateUserStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.adminService.updateUserStatus(id, body.isActive);
  }
} 