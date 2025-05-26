module.exports = {
  ci: {
    collect: {
      url: ['https://pheme-protocol.vercel.app/'],
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['accessibility'],
        preset: 'desktop'
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}; 