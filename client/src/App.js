import React from 'react'
import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Home from './components/pages/Home'
import Show from './components/pages/Show'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})

const App = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/show" component={Show} exact />
      </Switch>
    </ApolloProvider>
  </BrowserRouter>
)
export default App
