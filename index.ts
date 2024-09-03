import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import fs from 'node:fs';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
})


async function main() {
    const image = './images/congrats-sailer.png'

    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! })

    const { data } = await agent.uploadBlob(fs.readFileSync(image), { encoding: 'image/png' })

    await agent.post({
        text: '',
        embed: {
            $type: 'app.bsky.embed.images',
            images: [
                {
                    alt: 'congratulations sailer you made it to friday!',
                    image: data.blob,
                    aspectRatio: {
                        width: 480,
                        height: 360
                    }
                }],
        }
    })
}

main();


// Run this on a cron job
const scheduleExpressionMinute = '* * * * *'; // Run once every minute for testing
const scheduleExpression = '0 12 * * 5'; // Run once every three hours in prod

const job = new CronJob(process.env.CRON_SCHEDULE!, main); // change to scheduleExpressionMinute for testing

job.start();