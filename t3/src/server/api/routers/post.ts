import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

let post = {
	id: 1,
	name: "Hello World",
};

let chrome = {} as any;
let puppeteer: any;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
	chrome = require('chrome-aws-lambda');
	puppeteer = require('puppeteer-core');
} else {
	puppeteer = require('puppeteer');
}

const chromium = require('chrome-aws-lambda');

export const postRouter = createTRPCRouter({
	title: publicProcedure
		.query(async () => {
			let result = null;
			let browser = null;

			try {
				browser = await chromium.puppeteer.launch({
					args: chromium.args,
					defaultViewport: chromium.defaultViewport,
					executablePath: await chromium.executablePath,
					headless: true,
					ignoreHTTPSErrors: true,
				});

				let page = await browser.newPage();

				await page.goto('https://google.com');

				result = await page.title();
			} catch (error) {
				return 'erro 1';
			}

			if (browser !== null) {
				await browser.close();
			}

			return result;
		}),
});
