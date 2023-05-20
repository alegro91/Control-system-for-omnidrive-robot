# Control-system-for-omnidrive-robot

Our app connects to omnidrive robots, making it possible to manually control them.

## Requirements

- Node.js
- npm (Node Package Manager)
- Expo CLI (`npm install -g expo-cli`)
- React Native CLI (`npm install -g react-native-cli`)

## Getting Started

1. Clone this repository to your local machine:

```
git clone https://github.com/alegro91/Control-system-for-omnidrive-robot.git
```

2. Move into the project directory:

```
cd Control-system-for-omnidrive-robot
```

3. Install the project dependencies:

Client:

```
cd client
npm install
```

Server:

```
cd server
npm install
```

4. Start the app on an emulator or physical device:

```
npm start # Scan the QR code and open the app in Expo Go (on mobile device)
```

For Node.js 16+ use:

For Unix based systems:

```
NODE_OPTIONS=--openssl-legacy-provider expo start --web
```

For Windows:

```
set NODE_OPTIONS=--openssl-legacy-provider
expo start --web
```

If you're using Node.js 16, run:

```
npm run start
```

If you encounter any errors with `npm run start` try:

```
npx expo start --dev-client
```

If errors persist, you can try starting Expo and clearing the Babel cache for a full rebuild:

```
npx expo start --dev-client -c
```

If you experience issues with the `node_modules` directory:

1. Remove the existing `node_modules` directory:

```
rm -rf node_modules
```

2. Install the dependencies again:

```
npm i
```

## Setting Up

To configure notification permissions, please follow this step:

1. Read the documentation on how to get credentials for development builds:

   - [Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/#get-credentials-for-development-builds)
   - [Create Development Builds](https://docs.expo.dev/development/create-development-builds/#on-a-device)

2. For the server to properly connect to the frontend, create a `.env` file in the server folder and add a `PORT` variable.

## Application

Default login credentials:

```
admin
```
