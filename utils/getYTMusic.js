
import * as ytMusic from "node-youtube-music";

export const getYTMusic = async (query) => {
    const musics = await ytMusic.searchMusics(query);
    
    return musics[0].youtubeId;
}

