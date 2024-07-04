const sass = require("sass");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("html");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("favicon_io");
  eleventyConfig.htmlTemplateEngine = "ejs"
  
  // Fonts
  eleventyConfig.addPassthroughCopy("Apercu Regular.woff2");
  eleventyConfig.addPassthroughCopy("Apercu Mono.woff2");

  // SASS
  eleventyConfig.addTemplateFormats("scss");

  eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
	});

  // Creates the extension for use
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css", // optional, default: "html"

		// `compile` is called once per .scss file in the input directory
		compile: function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);

			let result = sass.compileString(inputContent, {
        loadPaths: [
          parsed.dir || ".",
          this.config.dir.includes
        ]
      });

			// This is the render function, `data` is the full data cascade
			return (data) => {
        return result.css;
      };
		},
	});

  return {
    passthroughFileCopy: true,
    dir: {
      input: "./",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
