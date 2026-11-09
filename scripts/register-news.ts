import {getCliClient} from 'sanity/cli';
import items from './news-seed.json';
const client = getCliClient({apiVersion: '2026-11-06'});
async function main() {
  if(client.config().projectId !== 'r3e6hitc' || client.config().dataset !== 'development') throw Error('Development only');
  for (const item of items) {
    if (await client.getDocument(item._id)) continue;
    const response = await fetch(item.image);
    if (!response.ok) throw Error(`Image download failed: ${response.status}`);
    const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {filename: item.image.split('/').pop()});
    const {image, ...fields} = item;
    await client.createIfNotExists({...fields, _type: 'newsArticle', thumbnail: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: item.title}});
    console.log(`Registered ${item._id}`);
  }
}
main().catch(error => {console.error(error.message);process.exitCode = 1;});
