import YoutubeMp3Downloader from "youtube-mp3-downloader";
import url from "url";
import { isURL } from "./helpers/index.js";

const videoDownload = (videoIdOrLink, fileName, downloader) => {
  return new Promise((resolve, reject) => {
    if (!videoIdOrLink) {
      throw new Error("Please enter a valid video id or link");
    }

    let videoId = videoIdOrLink;

    if (isURL(videoIdOrLink)) {
      let urlQueryObj = url.parse(videoIdOrLink).query;
      videoId = urlQueryObj.replace("v=", "");
    }
    downloader.download(videoId, fileName);
    downloader.on("finished", (err, data) => {
      resolve(data);
    });
    downloader.on("error", (err) => {
      reject(err);
    });
  });
};

export const videoConverter = (
  outputPath,
  videoIdOrLink,
  fileName,
  spinner
) => {
  const downloader = new YoutubeMp3Downloader({
    ffmpegPath: "/usr/bin/ffmpeg",
    outputPath,
    youtubeVideoQuality: "highest",
    queueParallelism: 3,
    progressTimeout: 5000,
  });
  downloader.on("progress", (progressObj) => {
    spinner.text = `${Number(progressObj.progress.percentage).toFixed(
      2
    )}% done`;
  });

  return videoDownload(videoIdOrLink, fileName, downloader);
};
