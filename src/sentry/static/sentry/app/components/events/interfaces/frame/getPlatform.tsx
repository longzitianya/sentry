import {PlatformType} from './types';

function getPlatform(dataPlatform: PlatformType, platform: string) {
  // prioritize the frame platform but fall back to the platform
  // of the stacktrace / exception
  return dataPlatform || platform;
}

export default getPlatform;
