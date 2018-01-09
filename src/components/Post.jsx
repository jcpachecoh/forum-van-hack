import React from 'react'
import { Link } from 'react-router-dom'
import { gql, graphql } from 'react-apollo'
import { formatDate } from '../scripts'

class Post extends React.Component {

  componentDidMount() {
    let userId = localStorage.getItem('userId');
    if (!userId) this.props.history.replace('/');
  }

  render() {
    return (
      <tr>
        <td><Link
          to={`/Post/${this.props.post.id}`}
        >{this.props.post.title}
        </Link>
        </td>
        <td> {this.props.post.author.name} </td>
        <td> {formatDate(this.props.post.createdAt)} </td>
      </tr>
    )
  }
  //<span className='red f6 pointer dim' onClick={this.handleDelete}>Delete</span>

  // not currently used.
  handleDelete = async () => {
    await this.props.mutate({ variables: { id: this.props.post.id } })
    this.props.history.replace('/')
  }
}

const deleteMutation = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

const PostWithMutation = graphql(deleteMutation)(Post)

export default PostWithMutation
