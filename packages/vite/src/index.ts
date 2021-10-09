import { Plugin } from 'vite'
import { createGenerator, presetUno, UserConfigDefaults } from 'unocss'
import { loadConfig } from '@unocss/config'
import { ChunkModeBuildPlugin } from './chunk-build'
import { GlobalModeDevPlugin } from './global-dev'
import { PerModuleModePlugin } from './per-module'
import { UnocssUserOptions } from './types'
import { VueScopedPlugin } from './vue-scoped'

export * from './types'
export * from './chunk-build'
export * from './global-dev'
export * from './per-module'
export * from './vue-scoped'

export default function UnocssPlugin(
  configOrPath: UnocssUserOptions | string,
  defaults: UserConfigDefaults = {
    presets: [
      presetUno(),
    ],
  },
): Plugin[] {
  const { config = {} } = loadConfig(configOrPath)

  const mode = config.mode ?? 'global'
  const uno = createGenerator(config, defaults)

  if (mode === 'per-module') {
    return [PerModuleModePlugin(uno, config)]
  }

  else if (mode === 'vue-scoped') {
    return [VueScopedPlugin(uno, config)]
  }

  else if (mode === 'global') {
    return [
      ChunkModeBuildPlugin(uno, config),
      GlobalModeDevPlugin(uno, config),
    ]
  }

  else {
    throw new Error(`[unocss] unknown mode "${mode}"`)
  }
}
