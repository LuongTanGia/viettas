import { useRef, useState, useEffect } from "react";

const ResizableDiv = () => {
    const resizableDivRef = useRef(null);
    const [resizing, setResizing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    useEffect(() => {
        const doDrag = (e) => {
            if (resizing) {
                e.preventDefault();
                const newWidth = startWidth + e.clientX - startX;
                resizableDivRef.current.style.width = `${newWidth}px`;
            }
        };

        const stopDrag = () => {
            setResizing(false);
        };

        if (resizing) {
            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);
        }

        return () => {
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
        };
    }, [resizing, startWidth, startX]);

    const startResizing = (e) => {
        e.preventDefault();
        setResizing(true);
        setStartX(e.clientX);
        setStartWidth(resizableDivRef.current.clientWidth);
    };

    return (
        <div
            ref={resizableDivRef}
            style={{
                width: "200px",
                height: "100px",
                backgroundColor: "lightblue",
                // resize: "both",
                overflow: "auto",
            }}
            onMouseDown={startResizing}
        ></div>
    );
};

export default ResizableDiv;
