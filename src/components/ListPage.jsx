import React from 'react'
import { Link } from 'react-router-dom'
import Post from '../components/Post'
import { gql, graphql, withApollo } from 'react-apollo'

class ListPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: ''
    }
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
    localStorage.setItem('userId','');
    this.props.history.replace('/');
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

    let blurClass = ''

    if (this.props.location.pathname !== '/ListPage') {
      blurClass = ' blur'
    }

    return (<div >
      <div className={'w-100 flex justify-center pa6' + blurClass}>
        <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={() => this._logOut()}>Log out</button>
        <div className='w-100 flex flex-wrap' style={{ maxWidth: 1150 }}>
          <Link
            to={`/create/${this.state.userId}`}
            className='ma3 box new-post br2 flex flex-column items-center justify-center ttu fw6 f20 black-30 no-underline'
          >
            <img
              src={require('../assets/plus.svg')}
              alt=''
              className='plus mb3'
            />
            <div>New Post</div>
          </Link>
          {this.props.data.allPosts && this.props.data.allPosts.map(post => (
            <Post
              key={post.id}
              post={post}
              refresh={() => this.props.data.refetch()}
            />
          ))}
        </div>
        {this.props.children}
      </div>
      }
    </div>
    )
  }
}
const FeedQuery = gql`query {
  allPosts {
    id
    imageUrl
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
