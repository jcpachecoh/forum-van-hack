import React from 'react'
import ReactDOM from 'react-dom'
import ListPage from './components/ListPage'
import CreatePage from './components/CreatePage'
import DetailPage from './components/DetailPage'
import Login from './components/Login'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
import 'tachyons'
import './style/style.css'

const networkInterface = createNetworkInterface({
    // __SIMPLE_API_ENDPOINT__ looks similar to: `https://api.graph.cool/simple/v1/<PROJECT_ID>`
    uri: 'https://api.graph.cool/simple/v1/cjc0mwb9x46zw0198q77yiq0u'
})

const client = new ApolloClient({ networkInterface })


ReactDOM.render(<ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path='/' component={Login} />
        <Route exact path='/ListPage' component={ListPage} />
        <Route path='/create' component={CreatePage} />
        <Route path='/Post/:id' component={DetailPage} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)