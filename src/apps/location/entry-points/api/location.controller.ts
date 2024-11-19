import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationService } from '../../domain/services/location.service';
import { AuthGuard } from '../../../auth/domain/guards/ auth.guard';
import { CreateLocationDto } from '../../domain/dto/create.location.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Location')
@Controller()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiOperation({
    summary: 'Get all locations for a user',
    description:
      'Fetches the list of all locations (cities) added by the authenticated user.',
  })
  @UseGuards(AuthGuard)
  @Get('locations')
  handleGetLocationRequest(@Request() req) {
    const id = req.user.sub;
    return this.locationService.getLocationsByUserId(id);
  }

  @ApiOperation({
    summary: 'Add locations for the user',
    description:
      'Allows the authenticated user to add cities as their locations.',
  })
  @UseGuards(AuthGuard)
  @Post('locations')
  async handlePostLocationRequest(
    @Request() req,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    const id = req.user.sub;
    return this.locationService.createLocation(id, createLocationDto);
  }

  @ApiOperation({
    summary: 'Delete a user location',
    description:
      "Deletes a specific location (city) from the authenticated user's list of locations.",
  })
  @UseGuards(AuthGuard)
  @Delete('locations/:id')
  async deleteLocation(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.locationService.deleteLocation(id);
  }
}
