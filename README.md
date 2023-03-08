<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Aboudoc/Uniswap-v2.git">
    <img src="images/logo1.png" alt="Logo" width="100" height="80">
  </a>

<h3 align="center">Uniswap V2</h3>

  <p align="center">
    Uniswap V2
    <br />
    <a href="https://github.com/Aboudoc/Uniswap-v2"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Aboudoc/Uniswap-v2">View Demo</a>
    ·
    <a href="https://github.com/Aboudoc/Uniswap-v2/issues">Report Bug</a>
    ·
    <a href="https://github.com/Aboudoc/Uniswap-v2/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#Uniswap-v2">Constant Product AMM</a></li>
    <li><a href="#Time-Weighted-Average-Price">Time Weighted Average Price</a></li>
    <li><a href="#Uniswap-V2-Price-Oracle">Uniswap V2 Price Oracle</a></li>
    <li><a href="#Uniswap-v2-Spot-Price-Examples">Constant Product AMM Spot Price Examples</a></li>
    <li><a href="#Uniswap-V3-Price-Oracle">Uniswap V3 Price Oracle</a></li>
    <li><a href="#Geometric-Mean">Geometric Mean</a></li>
    <li><a href="#Uniswap-V3-TWAP-and-Geometric-Mean">Uniswap V3 TWAP and Geometric Mean</a></li>
    <li><a href="#Uniswap-V3-TWAP-Inverse-Price">Uniswap V3 TWAP Inverse Price</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project shows how to interact with the main functions of Uniswap V2

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Hardhat][Hardhat]][Hardhat-url]
- [![Ethers][Ethers.js]][Ethers-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm

  ```sh
  npm install npm@latest -g
  ```

- hardhat

  ```sh
  npm install --save-dev hardhat
  ```

  ```sh
  npm install @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle
  ```

  run:

  ```sh
  npx hardhat
  ```

  verify:

  ```sh
  npx hardhat verify --network goerli "contract address" "pair address"
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Aboudoc/Uniswap-v2.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Dependencies

   ```sh
   npm i @uniswap/v2-core @uniswap/v2-periphery
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

If you need testnet funds, use the [Alchemy testnet faucet](https://goerlifaucet.com/).

**This project shows how to swap, add and remove liquidity**

## Constant Product AMM

Uniswap V2 is a Constant product AMM (automated market maker) <=> a decentralized exchange where 2 tokens are traded.
You can find a deep overview of CPAMM in [this repo](https://github.com/Aboudoc/Constant-Product-AMM)

## Uniswap V2 Single Hop Swap

This contract introduces 2 functions to swap tokens on Uniswap V2

`swapExactTokensForTokens` - Sell all of input token.
`swapTokensForExactTokens` - Buy specific amount of output token.

### State variables

1. Address of tokens (2 or 3) and the address of the router
2. Set interfaces for tokens and router

### Function swapSingleHopExactAmountIn

1. Transfer `amountIn` from `msg.sender`
2. Approve `amountIn` to `router`
3. Set the `path`
4. Call `swapExactTokensFor Tokens` on IUniswapV2Router

### Function swapSingleHopExactAmountOut

1. Transfer `amountInMax`from `msg.sender`
2. Approve `amountInMax` to `router`
3. Set the `path``
4. Call `swapTokensForExactTokens` on IUniswapV2Router and store amount of WETH spent by Uniswap in amounts (uint[])
5. Refund excess WETH to `msg.sender`. Amount of WETH spent by Uniswap is stored in amounts[0]

## Uniswap V2 Multi Hop Swap

Sell DAI and buy CRV.

However there is no DAI - CRV pool, so we will execute multi hop swaps, DAI to WETH and then WETH to CRV.

### State variables

1. Address of tokens and the address of the router
2. Set interfaces for tokens and router

### Function swapMultiHopExactAmountIn

This function will swap `all` of DAI for `maximum amount` of CRV. It will execute multi hop swaps from DAI to WETH and then WETH to CRV.

1. Transfer `amountIn` from `msg.sender`
2. Approve `amountIn` to `router`
3. Setup the swapping `path`
4. Send CRV to msg.sender

### Function swapMultiHopExactAmountOut

This function will swap `minimum` DAI to obtain a `specific amount` of CRV. It will execute multi hop swaps from DAI to WETH and then WETH to CRV.

1. Transfer `amountInMax`from `msg.sender`
2. Approve `amountInMax` to `router`
3. Setup the swapping `path``
4. Call `swapTokensForExactTokens` on IUniswapV2Router and store amount of DAI spent by Uniswap in amounts (uint[])
5. Refund DAI to `msg.sender` if not all of DAI was spent. Amount of DAI spent by Uniswap is stored in amounts[0]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Uniswap V2 Add and Remove Liquidity

Deposit your tokens into an Uniswap V2 pool to earn trading fees.

This is called adding liquidity.

Remove liquidity to withdraw your tokens and claim your trading fees.

### State variables

1. Address of tokens and the addresses of the router and the factory
2. Set interfaces for tokens and pair, router and factory

### Constructor

1. Setup pair (IERC20) by calling getPair on factory

### Function

This function adds liquidity to the Uniswap WETH - DAI pool.

### Function

This function removes liquidity from the Uniswap WETH - DAI pool.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Uniswap V2 Flash Swap

Tokens in the pool can be borrowed as long as they are repaid in the same transaction plus fee on borrow.

This is called flash swap.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Forking mainnet

When we fork 🍴 the mainnet, we have the current state of the blockchain running locally on our system, including all contracts deployed on it and all transactions performed on it.

1. Setup hardhat.config
2. Find a whale on etherscan

`hardhat.config.js`

```sh
  networks: {
        hardhat: {
          forking: {
            url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
       },
     },
  }
```

Note: Replace the `${}` component of the URL with your personal [Alchemy](https://www.alchemy.com/) API key.

`.config`

```js
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_WHALE = process.env.DAI_WHALE;

module.exports = {
  DAI,
  DAI_WHALE,
};
```

`.env`

```sh
ALCHEMY_API_KEY=...
```

`Terminal 1`

```sh
npx hardhat test --network localhost
```

`Terminal 2`

```sh
ALCHEMY_API_KEY=...
npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Note

This contract assumes that token0 and token1 both have same decimals

Consider Uniswap trading fee = 0.3%

### Further reading

(...soon)

### Sources

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Uniswap V3 TWAP
- [ ] Further reading
- [ ] Deploy script
- [ ] Unit test

See the [open issues](https://github.com/Aboudoc/Uniswap-v2.git/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Reda Aboutika - [@twitter](https://twitter.com/AboutikaR) - reda.aboutika@gmail.com

Project Link: [https://github.com/Aboudoc/Uniswap-v2.git](https://github.com/Aboudoc/Uniswap-v2.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Smart Contract Engineer](https://www.smartcontract.engineer/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Aboudoc/Uniswap-v2.svg?style=for-the-badge
[contributors-url]: https://github.com/Aboudoc/Uniswap-v2/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Aboudoc/Uniswap-v2.svg?style=for-the-badge
[forks-url]: https://github.com/Aboudoc/Uniswap-v2/network/members
[stars-shield]: https://img.shields.io/github/stars/Aboudoc/Uniswap-v2.svg?style=for-the-badge
[stars-url]: https://github.com/Aboudoc/Uniswap-v2/stargazers
[issues-shield]: https://img.shields.io/github/issues/Aboudoc/Uniswap-v2.svg?style=for-the-badge
[issues-url]: https://github.com/Aboudoc/Uniswap-v2/issues
[license-shield]: https://img.shields.io/github/license/Aboudoc/Uniswap-v2.svg?style=for-the-badge
[license-url]: https://github.com/Aboudoc/Uniswap-v2/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/r%C3%A9da-aboutika-34305453/?originalSubdomain=fr
[product-screenshot]: https://ethereum.org/static/28214bb68eb5445dcb063a72535bc90c/9019e/hero.webp
[Hardhat]: https://img.shields.io/badge/Hardhat-20232A?style=for-the-badge&logo=hardhat&logoColor=61DAFB
[Hardhat-url]: https://hardhat.org/
[Ethers.js]: https://img.shields.io/badge/ethers.js-000000?style=for-the-badge&logo=ethersdotjs&logoColor=white
[Ethers-url]: https://docs.ethers.org/v5/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

```

```
