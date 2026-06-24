# E-Commerce Playwright Test

This project contains automated UI tests for a Pokémon-themed e-commerce storefront built with Playwright and TypeScript.

## Overview

The test suite validates core shopping flows such as:

- product search and filtering
- cart quantity and stock limits
- coupon/promo code handling
- checkout success flow

The tests interact with the local storefront page in [EcomPokemon.html](EcomPokemon.html) through a page object layer in [Pages/Locators.page.ts](Pages/Locators.page.ts).

## Tech Stack

- Node.js
- Playwright
- TypeScript

## Project Structure

- [EcomPokemon.html](EcomPokemon.html) – local storefront page used by the tests
- [Pages/Locators.page.ts](Pages/Locators.page.ts) – page object with reusable locators and actions
- [tests/testmysite.spec.ts](tests/testmysite.spec.ts) – main Playwright test suite
- [playwright.config.ts](playwright.config.ts) – Playwright configuration and browser settings

## Prerequisites

Make sure you have the following installed:

- Node.js (recommended: latest LTS)
- npm

## Installation

From the project root, run:

```bash
npm install
npx playwright install chromium
```

## Running Tests

Run the full suite:

```bash
npx playwright test
```

Run a single spec file:

```bash
npx playwright test tests/testmysite.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

## Reports

Playwright generates an HTML report after test runs. To view it:

```bash
npx playwright show-report
```

## Notes

- The tests open the storefront directly from the local HTML file, so no separate web server is required.
- Test artifacts such as traces, screenshots, and videos are stored under the generated output folders.
