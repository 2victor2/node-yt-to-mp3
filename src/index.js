import { videoConverter } from "./downloader.js";
import { program } from "commander";
import ora from "ora";

const spinner = ora("Downloading...").start();
spinner.color = "green";

program.version("0.0.1").description("A simple node-cli youtube downloader");

program
  .command("node-ytd")
  .requiredOption("-o, --output <output>", "Output path of the download")
  .requiredOption("-l, --link <link>", "A youtube video link or id")
  .option("-n, --name [name]", "Name of the downloaded file")
  .action((cmdObj) => {
    const { output, link, name } = cmdObj;
    videoConverter(output, link, name, spinner)
      .then((finishedObj) => {
        spinner.succeed(
          `Finished downloading ${finishedObj.videoTitle} in ${finishedObj.stats.runtime} seconds!`
        );
      })
      .catch((err) => {
        spinner.fail("Could not download the video. An Error occurred.");
        console.error(err);
      });
  });

program.parse(process.argv);
