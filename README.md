<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="./public/images/lollipop.png" alt="Project logo"></a>
</p>

<h1 align="center" style="margin-bottom: 30px;">Popfolio.</h3>    

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/hanahem/popfolio/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/hanahem/popfolio/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> A light off-chain crypto portfolio tracker
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](./TODO.md)
- [Contributing](./CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Popfolio is for hodlers who don't make too many trades and want to keep track of all their assets in the same browser.
It's a convenient way of tracking your assets right between swiss-knife dashboards and spreadsheets.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
node
yarn
next
vercel
```

### Installing

The development env doesn't require a lot, there are no ENVs, APIs or other dependencies.

After cloning the repo, you can install the deps

```
yarn
```

And start your dev server

```
yarn run dev
OR
next
```

End with an example of getting some data out of the system or using it for a little demo.

## 🎈 Usage <a name="usage"></a>

The app uses Redux for app state management, and Dexie.js to manage an IndexedDb instance.  
IndexedDb uses your browser storage to save your assets and wallets. If you encounter problems or want to wipe your data, just clean your app's memory through the inspector.  
Otherwise you can add wallets and assets to your profile and monitor them.

## 🚀 Deployment <a name = "deployment"></a>

You can deploy the app using [Vercel](https://www.vercel.com/).

## ⛏️ Built Using <a name = "built_using"></a>

- [Next with Typescript](https://www.nextjs.org/) - React Framework
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Dexie](https://dexie.org/) - IndexedDb Wrapper
- [Redux](https://redux.js.org/) - React State Container

## ✍️ Authors <a name = "authors"></a>

- [@hanahem](https://github.com/hanahem) - Idea & Initial work

See also the list of [contributors](https://github.com/hanahem/popfolio/graphs/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- [@TBouder](https://github.com/TBouder) for some ideas and inspiration
- Inspiration: Uniswap, Zapper.fi, Zerion
- References: [This Dribble Design](https://cdn.dribbble.com/users/2716253/screenshots/15516075/media/611362828179bf2bfffe5ab7485c54c4.png?compress=1&resize=1600x1200) and [this one](https://cdn.dribbble.com/users/2716253/screenshots/15516075/media/611362828179bf2bfffe5ab7485c54c4.png?compress=1&resize=1600x1200)
