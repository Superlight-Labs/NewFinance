# Local Dev Setup

## Prerequisites

1. [Volta](https://volta.sh/) is installed
2. [Homebrew](https://brew.sh/index_de) is installed
   - `brew install ruby@2.7`
3. XCode is installed
4. [React Native Local Setup](https://reactnative.dev/docs/environment-setup?guide=native) is completed
5. Install `turborepo` globally with `npm i turbo -g`
6. Run `yarn prep` to install node module in setup database

   On error `xcrun: error: SDK "iphoneos" cannot be located` it may be necessray to run `npx pod-install` in the `mobile` app folder

7. Copy `.env.example` and rename to `.env`
8. Start development with `yarn dev`

## Mobile Debugging

The Debugging experience in React native per default is not optimal. For example the network tab does not show the actual requests
that are happening. To fix that we have setup [Reactotron](https://github.com/infinitered/reactotron)

Follow the instructions there to get a full Debugging experience

## Clean Up

Sometimes its necessary to wipe the local setup to get rid of unwanted cache behaviour, or just after switching a branch.
To completely wipe local data and get a fresh setup run

`yarn reset`
