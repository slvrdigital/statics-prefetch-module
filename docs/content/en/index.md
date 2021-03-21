---
title: Introduction
description: 'Reduce network request and unexpected API responses with static data prefetching'
category: ''
position: 0
items:
  - Prefetch and auto-save data in statics
  - Mutate response data before save
  - Fetch API support (node-fetch)
---

<img src="/preview.svg" class="light-img" alt="Logo light" />
<img src="/preview-dark.svg" class="dark-img" alt="Logo dark" />

[Nuxt](https://nuxtjs.org) module for static data prefetching.

Reduce network request and unexpected API responses with static data prefetching.

## Key features

<list :items="items"></list>

<br>

## Usecase

Your app is dependent on some initial global scope data which exposed to you by REST API endpoint (for example 'countries' list).
You'll normally make a get request in `nuxtServerInit` hook and then commit it in related store module.

<br>

But there are few cons:

- API request will be dispatched each time user vistit your site or refresh the page
- possibility that your API request will fail due unexpected network error

<br>

**In case, when data is not updated frequently** you can prefetch it and save as **JSON** file in statics or assets folder. Then, you can import it in related store module or component
