import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseUtil } from '../common/utils/response.util';
import { ApiHealthResponse } from '../common/decorators/api-response.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiHealthResponse('Health check successful')
  check() {
    return ResponseUtil.health(
      'ok',
      process.uptime(),
      process.env.npm_package_version || '1.0.0',
      process.env.NODE_ENV || 'development'
    );
  }
}
