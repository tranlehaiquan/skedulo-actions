# Hello world javascript action

This action bundle and deploy Packages to Skedulo Platform. You need to build packages first then upload to artifact.

## Inputs

### `SKEDULO_API_SERVER`

**Required** Skedulo API Server example: https://api.skedulo.com.

### `SKEDULO_API_TOKEN`

**Required** Skedulo token API using to run deploy.

### `ORG_NAME`

**Required** Skedulo org name, example: Cx training.

### `PACKAGE_PATH`

**Required** Path to the packages folder (the folder must contain sked.pkg.json).

Example: example

```
example
├── myReactApp
├── sked.pkg.json
```
## Example usage

Here: `.github/workflows/deploy-pks-action.yml`

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
  - uses: actions/download-artifact@v3
    with:
      path: built
  - uses: tranlehaiquan/skedulo-actions@main
    with:
      SKEDULO_API_SERVER: ${{ vars.SKEDULO_API_SERVER }}
      SKEDULO_API_TOKEN: ${{ secrets.SKEDULO_API_TOKEN }}
      ORG_NAME: ${{ vars.ORG_NAME }}
      PACKAGE_PATH: ${{ vars.PACKAGE_PATH }}
```