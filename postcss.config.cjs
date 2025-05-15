/* eslint-disable @typescript-eslint/no-require-imports */
const postcssJitProps = require('postcss-jit-props');
const openProps = require('open-props');
const postcssCustomMedia = require('postcss-custom-media');

const config = {
	plugins: [postcssCustomMedia(), postcssJitProps(openProps)]
};

module.exports = config;
