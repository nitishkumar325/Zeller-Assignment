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
yarn start
yarn ios        # or yarn android
```

The AppSync URL and API key live in `src/config/awsExports.ts`. They come from the challenge brief.

## Tests

```bash
yarn test
```

The tests cover the form rules, the tab and search filtering, how a refresh merges server data with local edits, and the GraphQL paging.

## How the data moves

1. On launch, and when you pull to refresh, the app runs `listZellerCustomers`.
2. Those rows are written into Realm. A user you edited or deleted on the device is left as you left them.
3. The list re-renders from Realm.

If the network call fails, the last saved list stays on screen.
