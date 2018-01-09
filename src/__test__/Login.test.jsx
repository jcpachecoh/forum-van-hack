import Login from '../components/Login';
import renderer from 'react-test-renderer';


test('Should render login component', () => {
    const cmp = renderer.create(
        <Login />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})