import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Table from "../Table/Table";

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div>
                <Table />
            </div>
        );
    }
}

const PrintButton = () => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <ComponentToPrint ref={componentRef} />

            <button onClick={handlePrint}>Print this component</button>
        </div>
    );
};

export default PrintButton;
