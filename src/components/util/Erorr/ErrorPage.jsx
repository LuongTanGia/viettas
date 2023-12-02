import { Result } from "antd";
import { Link } from "react-router-dom";
const App = () => (
    <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
            <Link type="primary" to="/">
                Back Home
            </Link>
        }
    />
);
export default App;
