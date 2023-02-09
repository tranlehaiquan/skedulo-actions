import * as RP from 'request-promise'

export class NetworkingService {

  private _baseRequest = RP.defaults({
    headers: { Authorization: 'Bearer ' + this.authorizeData.token },
    timeout: 15000,
    gzip: true
  })

  private _apiRequest = this._baseRequest.defaults({
    baseUrl: this.authorizeData.API_SERVER,
    json: true
  })

  constructor(private authorizeData: {
    token: string,
    API_SERVER: string
  }) { }

  public getAPIRequest() {
    return this._apiRequest
  }

  public getRequest() {
    return this._baseRequest
  }
}
