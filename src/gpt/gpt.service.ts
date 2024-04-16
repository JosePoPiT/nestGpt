import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';

import {
  ImageGenerationUseCase,
  audioToTextUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserUseCase,
  prosConsStreamUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
} from './dtos';
import OpenAI from 'openai';
import { TranslateDto } from './dtos/translate.dto';
import { TextToAudioDto } from './dtos/text-to-audio.dto';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  // Solo va a llamar casos de uso

  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsStreamUseCase(this.openai, { prompt });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt: prompt,
      voice: voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    const filepPath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filepPath);

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filepPath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await ImageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  imageGeneratedGetter(imageId: string) {
    const filepPath = path.resolve('./', './generated/images/', imageId);

    const wasFound = fs.existsSync(filepPath);

    if (!wasFound) throw new NotFoundException(`File ${imageId} not found`);

    return filepPath;
  }

  async generateImageVariation({ baseImage }: ImageVariationDto) {
    return imageVariationUseCase(this.openai, { baseImage });
  }
}
