export default {
  modules: ['../src/module.ts'],

  staticsPrefetch: {
    stopOnFail: false,
    serviceCollection: [
      {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        saveAs: 'post-1.json',
        beforeSave: data => {
          return {
            ...data,
            title: data?.title?.toUpperCase()
          }
        }
      },
      {
        url: 'https://jsonplaceholder.typicode.com/posts/2',
        saveAs: 'post-2.json'
      },
      {
        url: 'https://jsonplaceholder.typicode.com/posts',
        saveAs: 'posts.json'
      },
      {
        url: 'https://restcountries.eu/rest/v2/all',
        saveAs: 'countries.json'
      }
    ]
  }
}
