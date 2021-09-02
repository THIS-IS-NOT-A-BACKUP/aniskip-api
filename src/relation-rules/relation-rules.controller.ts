import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  GetRelationRulesRequestParams,
  GetRelationRulesResponse,
} from './models';
import { RelationRulesService } from './relation-rules.service';

@Controller({
  path: 'relation-rules',
  version: '2',
})
@ApiTags('relation-rules')
export class RelationRulesControllerV2 {
  constructor(private relationRulesService: RelationRulesService) {}

  @UseGuards(ThrottlerGuard)
  // Maximum 120 times in 1 minute.
  @Throttle(120, 60)
  @Get('/:animeId')
  @ApiOperation({
    description: 'Retrieves anime episode number redirection rules',
  })
  @ApiOkResponse({
    type: GetRelationRulesResponse,
    description: 'Rules object',
  })
  getRules(
    @Param() params: GetRelationRulesRequestParams
  ): GetRelationRulesResponse {
    const episodeRules = this.relationRulesService.getRule(params.animeId);

    const response = new GetRelationRulesResponse();
    const found = episodeRules.length !== 0;
    response.statusCode = found ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    response.message = found
      ? `Successfully found rules for animeId '${params.animeId}'`
      : `No rules found for animeId '${params.animeId}'`;
    response.found = found;
    response.rules = episodeRules;

    if (!found) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }
}
