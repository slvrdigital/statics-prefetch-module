import defu from 'defu'
import { Module } from '@nuxt/types'
import fse from 'fs-extra'
import path from 'path'
// import chalk from 'chalk'
import Listr from 'listr'
import fetch from 'node-fetch'

export interface EnumRequest extends RequestInit {
  url: string
  saveAs: string
  onDone: void
}

export interface ModuleOptions {
  dest: string
  stopOnFail: boolean
  serviceCollection: Array<EnumRequest>
}

const warn = console.warn
const error = console.error

const CONFIG_KEY = 'staticsPrefetch'
const DEST_FOLDER = '/static/data'

const nuxtModule: Module<ModuleOptions> = function(moduleOptions) {
  const { nuxt } = this

  const defaults: ModuleOptions = {
    dest: DEST_FOLDER,
    stopOnFail: true,
    serviceCollection: []
  }

  const options = defu<ModuleOptions>(
    this.options[CONFIG_KEY],
    moduleOptions,
    defaults
  )

  if (!Array.isArray(options.serviceCollection)) {
    warn(
      '[statics-prefetch] `serviceCollection` property value should be an array'
    )
    return
  }

  if (options.serviceCollection.length === 0) {
    return
  }

  const saveFile = (path: string, data: any) =>
    fse.outputFile(path, JSON.stringify(data))

  const assignTasks = (builder: any) => {
    const tasks: any = []
    const isInvalid = options.serviceCollection.some(
      item => !item.url || !item.saveAs
    )

    if (isInvalid) {
      tasks.push({
        title: 'Expected `url` and `saveAs` properties to be defined',
        task: () => Promise.reject()
      })

      return tasks
    }

    for (const item of options.serviceCollection) {
      const filePath = path.join(
        builder.nuxt.options.rootDir,
        options.dest,
        item.saveAs
      )

      tasks.push({
        title: item.saveAs,
        task: () =>
          fetch(item.url, item)
            .then(res => res.json())
            .then(item.onDone)
            .then(data => saveFile(filePath, data))
            .catch(error => Promise.reject(error))
      })
    }

    return tasks
  }

  nuxt.hook('build:before', async (builder: any) => {
    const statics = assignTasks(builder)

    const tasks = new Listr([
      {
        title: 'Statics prefetch',
        task: () => new Listr(statics)
      }
    ])

    await tasks.run().catch(exception => {
      if (options.stopOnFail) {
        return Promise.reject(exception)
      }
    })
  })
}
;(nuxtModule as any).meta = require('../package.json')

declare module '@nuxt/types' {
  interface NuxtConfig {
    [CONFIG_KEY]?: ModuleOptions
  } // Nuxt 2.14+
  interface Configuration {
    [CONFIG_KEY]?: ModuleOptions
  } // Nuxt 2.9 - 2.13
}

export default nuxtModule
