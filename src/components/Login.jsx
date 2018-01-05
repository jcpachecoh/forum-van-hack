import React from 'react'
import { gql, graphql, withApollo } from 'react-apollo'
import { Alert, Jumbotron } from 'react-bootstrap'

const userQuery = gql`
  query userQuery($username: String, $password: String) {
    allUsers (filter: {
        username: $username
        password: $password
    }){
        id
    }
  }
`
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            userId: ''
        }
        this._signinUser = this._signinUser.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.key !== nextProps.location.key) {
            this.props.data.refetch()
        }
    }

    _signinUser = async () => {
        const { username, password } = this.state
        const result = await this.props.client.query({
            query: userQuery,
            variables: { username, password }
        })
        if (result.data.allUsers.length > 0) {
            this.setState({ userId: result.data.allUsers[0].id });

            if (this.state.userId) {
                this.setState({
                    username: '',
                    password: ''
                });
                localStorage.setItem("userId", result.data.allUsers[0].id);
                this.props.history.replace('/ListPage');
            }
        }
        else {
            this.setState({
                error: "Wrong userName and/or password"
            })
        }
    }

    render() {
        if (this.props.userQuery.loading) {
            return (
                <div className='flex w-100 h-100 items-center justify-center pt7'>
                    <div>
                        <img alt="login" src="http://blog.teamtreehouse.com/wp-content/uploads/2015/05/InternetSlowdown_Day.gif" />
                    </div>
                </div>
            )
        }

        return (<div>
            <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                    <Jumbotron>
                        <center><h1>FORUM APP</h1></center>
                    </Jumbotron>
                    <input
                        className='w-100 pa3 mv2'
                        value={this.state.email}
                        placeholder='Email'
                        onChange={(e) => this.setState({ username: e.target.value })}
                    />
                    <input
                        className='w-100 pa3 mv2'
                        type='password'
                        value={this.state.password}
                        placeholder='Password'
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                    {this.state.error &&
                        <Alert bsStyle="danger">{this.state.error}</Alert>}
                    <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={() => this._signinUser()}>Log in</button>
                </div>
            </div>
        </div>
        )
    }
}

const LoginMutation = graphql(userQuery, { name: 'userQuery' })(Login)

export default withApollo(LoginMutation)