import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const graphqlClient = new ApolloClient({
	link: new HttpLink({
		uri: process.env.REACT_APP_GRAPHQL_ENDPOINT as string,
	}),
	cache: new InMemoryCache(),
});

export default graphqlClient;
