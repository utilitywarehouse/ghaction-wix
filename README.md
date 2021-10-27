[![GitHub release](https://img.shields.io/github/release/utiltywarehouse/ghaction-wix.svg?style=flat-square)](https://github.com/utiltywarehouse/ghaction-wix/releases/latest)
[![CI workflow](https://img.shields.io/github/workflow/status/utiltywarehouse/ghaction-wix/test?label=ci&logo=github&style=flat-square)](https://github.com/utiltywarehouse/ghaction-wix/actions?workflow=ci)

## About

GitHub Action for [WiX Toolset](https://wixtoolset.org/), create Windows installation/MSI packages.

![GitHub Action for Wix](.github/ghaction-wix.png)

---

- [Usage](#usage)
- [Customizing](#customizing)
  - [inputs](#inputs)
- [Limitation](#limitation)
- [Contributing](#contributing)
- [License](#license)

## Usage

```yaml
on: push

jobs:
  test:
    runs-on: windows-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Choco help
        uses: utiltywarehouse/ghaction-wix@v1
        with:
          name: Multi
          sourceFiles: wix/component.wxs,wix/complex.wxs
          outputDir: msi
          architecture: x64
          extensions: WixUtilExtension
          candleExtraArguments: |
            -dlicensePath="./LICENSE"
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name                   | Type   | Description                                                                            |
| ---------------------- | ------ | -------------------------------------------------------------------------------------- |
| `name`                 | String | Name of the MSI package generated                                                      |
| `sourceFiles`          | String | Relative path of the source file. Use `,` for mutiple source files                     |
| `outputDir`            | String | Relative path of the output directory of the MSI                                       |
| `architecture`         | String | Architecture for package, components. Values: `x86`, `x64`, or `ia64` (default: `x86`) |
| `extensions`           | String | WiX Extension assembly                                                                 |
| `candleExtraArguments` | String | Extra arguments to add to the `candle` command                                         |
| `lightExtraArguments`  | String | Extra arguments to add to the `light` command                                          |
| `candleExecutable`     | String | Path/Name of the candle executable (default: `candle`)                                 |
| `lightExecutable`      | String | Path/Name of the candle executable (default: `light`)                                  |
| `image`                | String | Docker image to use (default `quay.io/utilitywarehouse/docker-wix`)                    |

## License

MIT. See `LICENSE` for more details.
