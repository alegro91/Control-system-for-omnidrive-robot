# Control-system-for-omnidrive-robot

Our app connects to omnidrive robots, which makes it possible
to manually control them.

## Requirements

- Node.js
- npm (Node Package Manager)
- React Native CLI (`npm install -g react-native-cli`)
- Expo CLI (`npm install expo-cli --global`)

## Getting Started

1. Clone this repository to your local machine:

```
git clone https://github.com/alegro91Control-system-for-omnidrive-robot.git
```

2. Move into the project directory:

```
cd Control-system-for-omnidrive-robot
```

3. Install the project dependencies:

```
npm install
```

4. Start the app on an emulator or physical device:

```
npm start #scan code & open app in Expo Go (on mobile device)
```

for node 16+ use:

For Unix:

```
NODE_OPTIONS=--openssl-legacy-provider expo start --web
```

For Windows:

```
set NODE_OPTIONS=--openssl-legacy-provider
```

node 16:

```
npm run start
```

If errors occur, some useful commands:

Start expo and clear the babel cache for full rebuild

```
npx expo start --dev-client -c
```

Errors with node_modules:

1.

```
rm -rf node_modules
```

2.

```
npm i
```

## Read these for notification permission

https://docs.expo.dev/push-notifications/push-notifications-setup/#get-credentials-for-development-builds
https://docs.expo.dev/development/create-development-builds/#on-a-device

5. For the server to properly connect to the frontend, create a .env file in the server
   folder. Add a PORT variable.
