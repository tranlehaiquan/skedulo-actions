import { PackageService, AuthorizeData } from './PackageService'
import * as dotenv from 'dotenv'

dotenv.config()

async function deployedPackages() {
  const packagePaths = process.env.PACKAGE_PATH ? process.env.PACKAGE_PATH.split(",") : ['main-pkg']

  const authorizeData: AuthorizeData = {
    token: process.env.SKEDULO_API_TOKEN || '',
    API_SERVER: process.env.SKEDULO_API_SERVER || 'https://api.skedulo.com/',
    ORG_NAME: process.env.ORG_NAME || 'Testing'
  }


  await Promise.all(
    packagePaths.map(async (packagePath) => {

      const packageService = new PackageService(packagePath, authorizeData)

      return await packageService.deploy((status) => console.log(status))
    })
  )
}

deployedPackages()
