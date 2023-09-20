# Local Dev Setup

WARNING
Setup has only been tested on Apple Silicon M1 Macs. Linux could work but is not tested. Windows is expected to have problems with the native dependencies.

## Setup

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
5. [Docker & Docker compose](https://www.docker.com/products/docker-desktop/) are installed and running
6. Install `turborepo` globally with `npm i turbo -g`
7. Install yarn globally with `volta install yarn@1.22`
8. Copy the `env.example`file and adapt to your needs (DB URL is set to match the docker-compose file in the database package)
9. Run `yarn prep` to install node module and setup database

On error `xcrun: error: SDK "iphoneos" cannot be located` it may be necessray to run `npx pod-install` in the `mobile` app folder

8. Start development with `yarn dev`

CONGRATS - now you have setup the project for Development.
Since the App is hooked up with external API's etc. it is necessary to do a few more steps to actually interact with the blockchain. See [here](#secrets)

### Android

1. Install CMAKE 3.10.2.... via Android Studio SDK Manager -> SDK Tools -> Show Pacakge Details -> Select 3.10.2...

## Secrets

The Api relies on some Secrets for talking with external API's. You have to create secrets and copy the values to the `.env` file with following secrets:

| Secret Name      | Website                     |
| ---------------- | --------------------------- |
| TATUM_TEST_TOKEN | https://dashboard.tatum.io/ |
| TATUM_MAIN_TOKEN | https://dashboard.tatum.io/ |

## Testing Address

To have funds for testing purposes, import one of those seed and make sure that main net is disabled in the settings

| Seed                                                                        | Address                                    |
| --------------------------------------------------------------------------- | ------------------------------------------ |
| tide thrive exotic acquire gloom upon soon east warm blossom wheat bread    | tb1qjxw4mxeprse3aet7yg7m3qlryed8a2wvz5m6re |
| tide thrive exotic acquire gloom upon soon east warm blossom wheat accident | tb1q8xc532tmuddh6yleswgncmws6k5sye4938g6s6 |

## Mobile Debugging

The Debugging experience in React native per default is not optimal. For example the network tab does not show the actual requests
that are happening. To fix that we have setup [Reactotron](https://github.com/infinitered/reactotron)

Follow the instructions there to get a full Debugging experience

## Clean Up

Sometimes its necessary to wipe the local setup to get rid of unwanted cache behaviour, or just after switching a branch.
To completely wipe local data and get a fresh setup run

`yarn reset`

CAREFUL - This will delete your database and `.env` Files in the root and mobile directory
