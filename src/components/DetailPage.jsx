import React from 'react'
import { gql, graphql } from 'react-apollo'
import Modal from 'react-modal'
import modalStyle from '../constants/modalStyle'
import { withRouter } from 'react-router-dom'
import { Glyphicon } from 'react-bootstrap'

const detailModalStyle = {
  overlay: modalStyle.overlay,
  content: {
    ...modalStyle.content,
    height: 661,
  },
}

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
    }
  }

  componentDidMount() {
    let userId = localStorage.getItem('userId');
    if (!userId) this.props.history.replace('/');
  }

  render() {
    if (this.props.data.loading) {
      return (
        <div className='flex w-100 h-100 items-center justify-center pt7'>
          <div>
            <img alt="loading" src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/09b24e31234507.564a1d23c07b4.gif" />

          </div>
        </div>
      )
    }

    const { Post } = this.props.data
    return (
      <Modal
        isOpen
        contentLabel='Create post'
        style={detailModalStyle}
        onRequestClose={this.props.history.goBack}
      >
        <div
          className='close fixed right-0 top-0 pointer'
          onClick={this.props.history.goBack}
        >

          <img src={require('../assets/close.svg')} alt='' />
        </div>
        <div
          className='delete ttu white pointer fw6 absolute left-0 top-0 br2'
          onClick={this.handleDelete}
        >
          Delete
        </div>
        <div
          className='bg-white detail flex flex-column no-underline br2 h-100'
        >
          <center><h2>{Post.title}</h2> <h3>created by {Post.author.name}</h3></center>
          <div
            className=''
            style={{
              backgroundImage: `url(${Post.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '600px'
            }}
          />
        </div>
        <div className='postInfo'>
          <p><Glyphicon glyph="ok" /> {Post.topic.title}</p>
          <p>{Post.content}</p>
        </div>
      </Modal>
    )
  }
  formatDate(dateData) {
    return new Date(dateData);
  }
  // would be nice to trigger a "deleting... -> deleted." snackbar-style notification
  // while this runs
  handleDelete = async () => {
    await this.props.mutate({ variables: { id: this.props.data.variables.id } })

    // post is gone, so remove it from history stack
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

const PostQuery = gql`
  query post($id: ID!) {
  Post(id: $id){
    id
    title
    content
    imageUrl
    topic {
      title
    }
    author {
      name
    }
  }
}
`

// update w/ react-router v4 url params api
//
// see documentation on computing query variables from props in wrapper
// http://dev.apollodata.com/react/queries.html#options-from-props
const DetailPageWithData = graphql(PostQuery, {
  options: ({ match }) => ({
    variables: {
      id: match.params.id,
    },
  }),
})(DetailPage)

const DetailPageWithDelete = graphql(deleteMutation)(DetailPageWithData)

export default withRouter(DetailPageWithDelete)
