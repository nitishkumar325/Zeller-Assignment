# Zeller customers

A small React Native app that lists Zeller customers, filters them, and keeps a copy on the phone so the list still opens offline.

Users are loaded with the `listZellerCustomers` GraphQL query, saved in Realm, and the screens read from that local database. Adding, editing and deleting a user only changes Realm. There is no API mutation.

## What you can do

- Swipe between **All**, **Admin** and **Manager**. The blue pill follows the swipe.
- Search by name.
- Pull to refresh.
- Add a user, edit one by tapping the row, or delete one from the edit screen.
- The form checks that the name is not empty, uses only letters and spaces, stays within 50 characters, and that an email (if you type one) looks valid.

## Setup

- Node 18 or newer
- Yarn
- Xcode for iOS, or Android Studio with an emulator for Android

```bash
yarn install
cd ios && pod install && cd ..   # iOS only
yarn mock       # local GraphQL on port 9002
yarn start
yarn ios        # or yarn android
```

The AppSync API key in the challenge returns 401, so the app posts `listZellerCustomers` to the mock server instead (`http://localhost:9002/graphql` on the iOS simulator, `http://10.0.2.2:9002/graphql` on the Android emulator). Start it with `yarn mock` before opening the app. The response is saved in Realm, and the list reads that local copy.

## Tests

```bash
yarn test
```

The tests cover the form rules, the tab and search filtering, how a refresh merges server data with local edits, and the GraphQL paging.

## How the data moves

1. On launch, and when you pull to refresh, a Redux thunk sends `listZellerCustomers` to the mock server.
2. Those rows are written into Realm. A user you edited or deleted on the device is left as you left them.
3. A Realm listener copies the table into the Redux store, and the list renders from that.

If the network call fails, the last saved list stays on screen.
