# Local Dev Setup

## Prerequisites

1. [Volta](https://volta.sh/) is installed
2. [Homebrew](https://brew.sh/index_de) is installed and used for dependencies

   - `brew install ruby@2.7`
   - `brew install openssl@3`

     - Add Compiler Flags to your shell profile (like ~/.zshrc)

     ```
         # OPENSSL

         export LDFLAGS="-L/opt/homebrew/opt/openssl@3/lib"
         export CPPFLAGS="-I/opt/homebrew/opt/openssl@3/include"
         export PATH="/opt/homebrew/opt/openssl@3/bin:$PATH"

         # RUBY

         export PATH="/opt/homebrew/opt/ruby@2.7/bin:$PATH"
         export LDFLAGS="-L/opt/homebrew/opt/ruby@2.7/lib"
         export CPPFLAGS="-I/opt/homebrew/opt/ruby@2.7/include"
     ```

3. XCode is installed
4. [React Native Local Setup](https://reactnative.dev/docs/environment-setup?guide=native) is completed
5. Install `turborepo` globally with `npm i turbo -g`
6. Install yarn globally with `volta install yarn@1.22`
7. Run `yarn prep` to install node module

On error `xcrun: error: SDK "iphoneos" cannot be located` it may be necessray to run `npx pod-install` in the `mobile` app folder

8. Copy `.env.example` and rename to `.env`
9. Run `yarn db:reset` to setup database
10. Start development with `yarn dev`

## Mobile Debugging

The Debugging experience in React native per default is not optimal. For example the network tab does not show the actual requests
that are happening. To fix that we have setup [Reactotron](https://github.com/infinitered/reactotron)

Follow the instructions there to get a full Debugging experience

## Clean Up

Sometimes its necessary to wipe the local setup to get rid of unwanted cache behaviour, or just after switching a branch.
To completely wipe local data and get a fresh setup run

`yarn reset`
