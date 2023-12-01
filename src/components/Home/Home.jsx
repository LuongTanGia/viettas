import { useSelector } from "react-redux";
import { dataSelector } from "../../redux/selector";

function Home() {
    const data = useSelector(dataSelector);

    console.log(data);
    return <div>Home</div>;
}

export default Home;
