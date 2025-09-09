import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Guider, GuiderDocument } from '../../guides/schemas/guider.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Guider.name) private guiderModel: Model<GuiderDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const { sub: userId, userType } = payload;

    let user;
    
    if (userType === 'traveler') {
      user = await this.userModel.findById(userId).select('-passwordHash');
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid or inactive traveler account');
      }
    } else if (userType === 'guider') {
      user = await this.guiderModel.findById(userId).select('-passwordHash');
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid or inactive guider account');
      }
    } else {
      throw new UnauthorizedException('Invalid user type');
    }

    return {
      ...user.toObject(),
      sub: user._id,
      userType,
    };
  }
} 