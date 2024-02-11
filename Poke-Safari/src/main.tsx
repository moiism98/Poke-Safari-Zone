import ReactDOM from 'react-dom/client'
import './main.css'
import App from './components/App/App'
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import AppContext from './context/AppContext';

const POKE_API = new HttpLink({ uri: "https://graphql-pokeapi.graphcdn.app/", useGETForQueries: true });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: POKE_API
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={ client }>
    <AppContext>
      <App/>
    </AppContext>
  </ApolloProvider>,
)
