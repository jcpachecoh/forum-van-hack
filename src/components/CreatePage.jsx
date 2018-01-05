import React from 'react'
import { withRouter } from 'react-router-dom'
import { gql, graphql } from 'react-apollo'
import Modal from 'react-modal'
import modalStyle from '../constants/modalStyle'

import { Glyphicon } from 'react-bootstrap'




class CreatePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: '',
      title: '',
      imageUrl: '',
      topicId: '',
      authorId: localStorage.getItem('userId')
    }
  }

  componentDidMount() {
    let userId = localStorage.getItem('userId');
    if (!userId) this.props.history.replace('/');
  }


  render() {
    return (
      <Modal
        isOpen
        contentLabel='Create Post'
        style={modalStyle}
        onRequestClose={this.props.history.goBack}
      >
        <div
          className='close fixed right-0 top-0 pointer'
          onClick={this.props.history.goBack}
        >
          <img src={require('../assets/close.svg')} alt='' />
        </div>
        <div className='pa4 flex justify-center bg-white'>
          <div style={{ maxWidth: 400 }} className=''>
            {this.state.imageUrl &&
              <img alt="presentation"
                src={this.state.imageUrl}
                role='presentation'
                className='w-100 mv3'
              />}
            <Glyphicon glyph="glass" /> Post Title <input
              className='w-100 pa3 mv2'
              value={this.state.title}
              placeholder='post Name'
              onChange={e => this.setState({ title: e.target.value })}
              autoFocus
            />
            <Glyphicon glyph="folder-open" /> Image Post
            <input
              className='w-100 pa3 mv2'
              value={this.state.image}
              placeholder='copy and paste the Image Url'
              onChange={e => this.setState({ imageUrl: e.target.value })}
              autoFocus
            />
            <div className="item">
              <Glyphicon glyph="list-alt" /> Content
              <textarea
                className='w-100 pa3 mv2'
                value={this.state.content}
                placeholder='please fill the post content'
                onChange={e => this.setState({ content: e.target.value })}
              />
            </div>

            <Glyphicon glyph="list" /> Topic

              <select
              className='w-100 pa3 mv2'
              value={this.state.topic}
              onChange={e => this.setState({ topic: e.target.value })}
            >
              <option value="">Select a Topic</option>
              <option value="cjc0o9855tqyu0153xpvw8l1v">Tecnhology</option>
              <option value="cjc0paqtp5vy30187ya0hdqqp">Sports</option>
            </select>
            {
              <button
                className='pa3 bg-black-10 bn dim ttu pointer'
                onClick={this.handlePost}
              >
                Add Post
              </button>}
          </div>
        </div>
      </Modal>
    )
  }

  handlePost = async () => {
    const { title, content, imageUrl, topicId, authorId } = this.state;
    await this.props.addPost({ variables: { title, content, imageUrl, topicId, authorId } })
      .then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    //window.location.pathname = '/ListPage'
  }
}

const addMutation = gql`
  mutation addPost(
    $title: String!,
    $content: String!,
    $imageUrl: String!,
    $topicId: ID!,
    $authorId: ID!) {
  createPost(
    title: $title,
    content: $content,
    imageUrl: $imageUrl,
    topicId: $topicId,
    authorId: $authorId) {
    id
  }
}
`



const PageWithMutation = graphql(addMutation, { name: 'addPost' })(CreatePage)

export default withRouter(PageWithMutation)
