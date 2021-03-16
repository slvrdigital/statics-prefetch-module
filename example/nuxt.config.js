export default {
  modules: ['../src/module.ts'],

  staticsPrefetch: {
    stopOnFail: false,
    serviceCollection: [
      {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        fileName: 'post-1.json',
        onDone: data => ({
          // handle response
          ...data,
          title: data?.title?.toUpperCase()
        })
      },
      {
        url: 'https://jsonplaceholders.typicode.com/posts/2',
        fileName: 'post-2.json'
      },
      {
        url: 'https://jsonplaceholder.typicode.com/posts',
        fileName: 'posts.json'
      }
    ]
  }
}
