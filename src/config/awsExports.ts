import { Platform } from 'react-native';

// The published AppSync API key returns 401, so the app reads listZellerCustomers
// from the mock server in mock-server/ (yarn mock, port 9002).
// Android emulator: 10.0.2.2 is the host machine. iOS simulator: localhost.
const mockHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const awsConfig = {
  aws_appsync_graphqlEndpoint: `http://${mockHost}:9002/graphql`,
  aws_appsync_region: 'ap-southeast-2',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: 'da2-d46dkkw5xnfbxkxkhi6twfb7re',
};

export default awsConfig;
