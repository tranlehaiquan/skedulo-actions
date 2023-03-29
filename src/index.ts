import { PackageService, AuthorizeData } from "./PackageService";
import * as dotenv from "dotenv";
import * as core from "@actions/core";
import * as fs from 'fs'; 

dotenv.config();

async function deployedPackages() {
  const packagePath =
    process.env.PACKAGE_PATH || core.getInput("PACKAGE_PATH") || "main-pkg";
  const packagePaths = packagePath.split(",");
  fs.readdir('.', console.log);
  
  const authorizeData: AuthorizeData = {
    token:
      process.env.SKEDULO_API_TOKEN || core.getInput("SKEDULO_API_TOKEN") || "",
    API_SERVER:
      process.env.SKEDULO_API_SERVER ||
      core.getInput("SKEDULO_API_SERVER") ||
      "https://api.skedulo.com/",
    ORG_NAME: process.env.ORG_NAME || core.getInput("ORG_NAME") || "Testing",
  };

  await Promise.all(
    packagePaths.map(async (packagePath) => {
      const packageService = new PackageService(packagePath, authorizeData);

      return await packageService.deploy((status) => console.log(status));
    })
  );
}

(async () => {
  try {
    const time = new Date().toTimeString();
    core.setOutput("Start time", time);
    await deployedPackages();
  } catch (error: any) {
    core.setFailed(error.message);
  }
})();
