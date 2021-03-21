module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("html");
  eleventyConfig.addPassthroughCopy("_redirects");
  return {
    passthroughFileCopy: true,
  };
};
