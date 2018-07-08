const withSass = require('@zeit/next-sass')
module.exports = withSass({
	sassLoaderOptions: {
		includePaths: ["static/scss"]
	}
})
