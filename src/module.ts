import path from 'path'
import defu from 'defu'
import { Module } from '@nuxt/types'
import fse from 'fs-extra'
import Listr from 'listr'
import fetch, { RequestInit } from 'node-fetch'

export interface EnumRequest extends RequestInit {
  url: string
  saveAs: string
  beforeSave: (data: any) => any
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

  const options = defu<ModuleOptions, ModuleOptions>(
    this.options[CONFIG_KEY]!,
    moduleOptions,
    defaults
  )

  if (!Array.isArray(options.serviceCollection)) {
    warn(
      '[statics-prefetch] expected `serviceCollection` property to be an array'
    )
    return
  }

  if (options.serviceCollection.length === 0) {
    return
  }

  const saveJSON = (path: string, data: any) => fse.outputJson(path, data)

  const assignTasks = (builder: any) => {
    const tasks: any = []
    const isInvalid = options.serviceCollection.some(
      item => !item.url || !item.saveAs
    )

    if (isInvalid) {
      tasks.push({
        title: 'Config exception',
        task: () =>
          Promise.reject(
            new Error('Expected `url` and `saveAs` properties to be defined')
          )
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
            .then(item.beforeSave)
            .then(data => saveJSON(filePath, data))
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
