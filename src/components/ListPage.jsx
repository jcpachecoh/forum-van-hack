import React from 'react'
import { Link } from 'react-router-dom'
import Post from '../components/Post'
import { gql, graphql, withApollo } from 'react-apollo'
import { Table, Glyphicon } from 'react-bootstrap'

class ListPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      userId: localStorage.getItem('userId'),
      filter: '',
      filterpost: []
    }
    this._filterData = this._filterData.bind(this);
  }

  componentDidMount() {
    let userId = localStorage.getItem('userId');
    if (!userId) this.props.history.replace('/');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.data.refetch()
    }
  }

  _logOut = async () => {
    localStorage.setItem('userId', '');
    this.props.history.replace('/');
  }

  _filterData(valFilter) {
    this.setState({
      filter: valFilter
    });
    let dataFiltering = this.props.data.allPosts.filter((el) => {
      return el.title.match(this.state.filter)
    })
    this.setState({
      filterpost: dataFiltering
    })
  }

  render() {
    if (this.props.data.loading) {
      return (
        <div className='flex w-100 h-100 items-center justify-center pt7'>
          <div>
            <img alt="loading" src="http://blog.teamtreehouse.com/wp-content/uploads/2015/05/InternetSlowdown_Day.gif" />
          </div>
        </div>
      )
    }

    return (<div className="container">
      <div >
        <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={() => this._logOut()}>Log out</button>
        <center><h1>FORUM VAN HACK APP</h1></center>
        <Link
          to={`/create/${this.state.userId}`}
        >
          <button className="btn btn-default" ><Glyphicon glyph="plus" /> New Post</button>
        </Link>
        <div className="form-group">
          <input className="form-control" value={this.state.filter} placeholder="Search"
            onChange={(e) => this._filterData(e.target.value)} />
        </div>
        <Table striped bordered condensed hover >
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Created date</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.allPosts && !this.state.filter && this.props.data.allPosts.map(post => (
              <Post
                key={post.id}
                post={post}
                refresh={() => this.props.data.refetch()}
              />
            ))}
            {this.state.filterpost && this.state.filter &&  this.state.filterpost.map(post => (
              <Post
                key={post.id}
                post={post}
                refresh={() => this.props.data.refetch()}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    )
  }
}
const FeedQuery = gql`query {
        allPosts {
      id
    imageUrl
    title
    author {
        name
      }
      createdAt
    updatedAt
    comments {
        id
      }
      }
}`

const ListPageWithData = graphql(FeedQuery, {
  options: {
    fetchPolicy: 'network-only'
  },
})(ListPage)

export default withApollo(ListPageWithData)
