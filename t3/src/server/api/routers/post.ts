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

export const postRouter = createTRPCRouter({
  title: publicProcedure
    .query(async () => {

      const url = 'https://google.com';

      let options = {};

      if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
          args: [
            ...chrome.args,
            "--hide-scrollbars",
            "--disable-web-security"
          ],
          defaultViewport: await chrome.defaultViewport,
          executablePath: await chrome.executablePath,
          headless: true,
          ignoreHTTPSErrors: true,
        }
      }

      try {
        var browser = await puppeteer.launch(options);
      } catch(err) {
        return 'erro 1'
      }

      try {
        var page = await browser.newPage();
      } catch(err) {
        return 'erro 2'
      }

      try {
        await page.goto(url);
      } catch(err) {
        return 'erro 3'
      }

      try {
        return page.title();
      } catch(err) {
        return 'erro 4'
      }
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  // getLatest: publicProcedure.query(() => {
  //   return post;
  // }),
});
