import { ShardingManager, Shard } from 'discord.js';

const manager = new ShardingManager(`${__dirname}/bot.js`, { token: process.env.TOKEN });

manager.on('shardCreate', (shard: Shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();