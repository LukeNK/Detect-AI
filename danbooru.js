import got from 'got';
import fs from 'fs';
import Jimp from 'jimp'

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// tags to download
const tags = [
    'hatsune_miku',
    'megumin',
    'aqua_(konosuba)',
    'idolmaster_cinderella_girls_starlight_stage',
    'kagamine_rin',
    'kagamine_len',
    'megurine_luka',
    'ai-generated status:deleted',
]
let links = [];
let allPosts = []
for (const tag of tags) {
    const posts = await got(
        'https://danbooru.donmai.us/posts.json', {
        searchParams: {
            tags: tag, // + 1boy 1girl
            limit: 200,
        }
    }).json();
    for (const post of posts) {
        const postUrl = post.preview_file_url;
        if (!postUrl) continue;
        if (postUrl?.includes('.jpg') || postUrl?.includes('.png'))
            links.push(postUrl + ' ' + tag);
    }
}

shuffle(links); // shuffle array for randomize training data
links = links.join('\n');
fs.writeFileSync('links.txt', links, 'utf-8');
links = links.split('\n');