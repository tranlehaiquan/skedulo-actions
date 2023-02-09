import * as fs from 'fs'
import * as path from 'path'

import { getFileHash, createTarBall } from './utils/tar'

import { NetworkingService } from './NetworkingService'

import * as winston from 'winston'

import * as fsExtra from "fs-extra";

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});


enum USE_PKGR {
  YES = 'YES',
  NO = 'NO'
}


export enum DATA_SOURCE_TYPE {
  STANDALONE = 'standalone',
  ELASTIC_SERVER = 'elasticserver'
}

export interface AuthorizeData {
  token: string
  API_SERVER: string
  ORG_NAME: string
}

function tarballFileFilter(filePath: string) {
  return !(/node_modules|pre_deploy_assets|__shared|__generated|\.git/.test(filePath))
}

export class PackageService {
  private apiRequest = (new NetworkingService(this.authorizeData)).getAPIRequest()

  static at(packagePath: string, authorizeData: AuthorizeData) {
    return new PackageService(packagePath, authorizeData)
  }

  constructor(public packagePath: string, private authorizeData: AuthorizeData) {

  }

  private bundlePackage() {
    const buildAssetsPath = path.join(this.packagePath, '/pre_deploy_assets')

    if (!fs.existsSync(buildAssetsPath)) {
      fs.mkdirSync(buildAssetsPath)
    }

    const targetPackageFile = path.join(buildAssetsPath, '/package.tar.gz')
    return createTarBall(this.packagePath, targetPackageFile, tarballFileFilter)
  }

  private getPackageUrlBasedOnFlag = (path: string, usePkgr: USE_PKGR = USE_PKGR.NO) => {
    return usePkgr === USE_PKGR.YES ? `/pkgr${path}?source=standalone` : `/pkg${path}`
  }

  private getBuildUrlBasedOnFlag = (path: string, usePkgr: USE_PKGR = USE_PKGR.NO) => {
    const sourceType = usePkgr === USE_PKGR.YES ? DATA_SOURCE_TYPE.STANDALONE : DATA_SOURCE_TYPE.ELASTIC_SERVER
    return `/pkgr${path}?source=${sourceType}`
  }

  private getProjectDataPath() {
    return path.join('../', this.packagePath, '/sked.pkg.json')
  }

  private getProjectData() {
    try {
      const projData = fs.readFileSync(this.getProjectDataPath(), 'utf8')
      return JSON.parse(projData)
    } catch (error) {
      console.error('Project file sked.pkg.json not found.')
      throw error
    }
  }

  private async uploadPackage(bundlePath: string, pkg: any): Promise<any> {
    const metadata = pkg

    const formData = {
      name: pkg.name,
      hash: getFileHash(bundlePath),
      source: fs.createReadStream(bundlePath),
      metadata: JSON.stringify(metadata)
    }

    const payload = {
      url: this.getPackageUrlBasedOnFlag(`/source/${encodeURIComponent(metadata.name)}`, process.env.USE_PKGR as USE_PKGR),
      formData,
      json: true
    }

    return this.apiRequest.post(payload).then(res => res.result as any)
  }

  private startBuild(name: string, hash: string) {
    const payload = {
      url: this.getBuildUrlBasedOnFlag(`/build`, process.env.USE_PKGR as USE_PKGR),
      body: {
        name, hash, action: 'deploy'
      }
    }

    return this.apiRequest.post(payload)
  }

  private installPackage(packageId: string) {
    return this.apiRequest.post(`/pkgr/build/install/${packageId}`)
  }

  public getPackages() {
    return this.apiRequest.get('/pkg/available')
  }

  private async bundlePackageWithByPassCompile() {

    const pkg = this.getProjectData()
    const pgkName = pkg.name;
    const buildAssetsPath = path.join('../', this.packagePath, `/pre_deploy_assets`);

    if (!fs.existsSync(buildAssetsPath)) {
      fs.mkdirSync(buildAssetsPath);
    }
    // folder projects using for copy all project to outDIR
    const outDIR = path.join(`../built/${pgkName}`);
    if (!fs.existsSync(outDIR)) {
      fs.mkdirSync(outDIR);
    }

    // empty outDIR
    // await fsExtra.emptyDir(outDIR); 

    // copy folder to the current working directory outDIR
    await fsExtra.copy('../' + this.packagePath, `${outDIR}`, {
      filter: tarballFileFilter,
      overwrite: true
    });

    // read file /${outDIR}/sked.pkg.json
    const file = await fsExtra.readFile(`${outDIR}/sked.pkg.json`, "utf8");
    const config = JSON.parse(file);

    const webpages = config.components.webpages?.items || [];
    const libraries = config.components.libraries?.items || [];
    const functions = config.components.functions?.items || [];

    const items = [...webpages, ...libraries, ...functions];

    await items.map(async (project) => {
      // skip if build and dist folder does not exist
      if (project == 'shared' || !fs.existsSync(`${outDIR}/${project}/build`) && !fs.existsSync(`${outDIR}/${project}/dist`)) {
        return;
      }

      // update package.json in each project
      // dependencies and devDependencies to empty object
      // scripts bootstrap, compile to echo 'bootstrap/compile'
      const packageJson = await fsExtra.readFile(
        `${outDIR}/${project}/package.json`,
        "utf8"
      );
      const packageJsonConfig = JSON.parse(packageJson);
      packageJsonConfig.dependencies = {};
      packageJsonConfig.devDependencies = {};

      packageJsonConfig.scripts = {
        bootstrap: "echo 'bootstrap'",
        compile: "echo 'compile'",
      };

      await fsExtra.writeFile(
        `${outDIR}/${project}/package.json`,
        JSON.stringify(packageJsonConfig, null, 2)
      );
    });


    const targetPackageFile = path.join(buildAssetsPath, "/package.tar.gz");
    const tar = createTarBall(
      outDIR,
      targetPackageFile,
      tarballFileFilter
    );

    // TODO: need update to node 14
    // remove folder outDIR 
    // await fsExtra.emptyDir(outDIR);
    return tar;
  }

  private async getBuildStatus(id: string) {
    const { result } = await this.apiRequest.get(`pkg/builds/${id}`)

    return result
  }

  async deploy(setDeployStatus: (status: string | null) => void) {
    const pkg = this.getProjectData()

    try {
      // const bundlePath = await this.bundlePackage()
      const bundlePath = await this.bundlePackageWithByPassCompile()
      if (bundlePath) {
        setDeployStatus(`${this.authorizeData.ORG_NAME} ${pkg.name} Bundle success!`)
        logger.log({
          level: 'info',
          message: `${this.authorizeData.ORG_NAME} ${pkg.name} Bundle success!`
        })
      }

      const deployedPackage = await this.uploadPackage(bundlePath, pkg)

      const { name, hash } = deployedPackage
      if (name && hash) {
        setDeployStatus(`${this.authorizeData.ORG_NAME} ${name} Upload success!`)
        logger.log({
          level: 'info',
          message: `${this.authorizeData.ORG_NAME} ${name} Upload success!`
        })
      }

      const { result } = await this.startBuild(name, hash)

      setDeployStatus(`${this.authorizeData.ORG_NAME} ${name} startBuild success!`)
      logger.log({
        level: 'info',
        message: `${this.authorizeData.ORG_NAME} ${name} startBuild success!`
      })

      const { id: buildId } = result
      // Check build status every 5 minutes maximum 3 times
      // Install if build status passed
      let checkTime = 0

      const installBuild = setInterval(async () => {
        checkTime++
        const { status } = await this.getBuildStatus(buildId)
        console.log(`running interval check - ${name} build status is`, status)
        if (status == 'Passed') {

          await this.installPackage(buildId)

          setDeployStatus(`${this.authorizeData.ORG_NAME} ${name} Install success!`)
          logger.log({
            level: 'info',
            message: `${this.authorizeData.ORG_NAME} ${name} Install success!`
          })

          clearInterval(installBuild)
        }

        if (checkTime == 3 || status == 'Failed') {
          setDeployStatus(`${this.authorizeData.ORG_NAME} ${name} build failed!`)
          logger.log({
            level: 'error',
            message: `${this.authorizeData.ORG_NAME} ${name} build failed!`
          })
          clearInterval(installBuild)
          throw new Error(`${this.authorizeData.ORG_NAME} ${name} build failed!`)
        }

      }, 1000 * 60 * 5)
    } catch (error) {
      if (error instanceof Error) {
        console.log(`${this.authorizeData.ORG_NAME} there is an error!!! ${error.message}`)
        logger.log({
          level: 'error',
          message: `${this.authorizeData.ORG_NAME} there is an error!!! ${error.message}`
        })
        throw error.message
      }
      throw error
    }
  }
}