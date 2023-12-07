import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie() {
    return (
        <PieChart
            margin={{ top: 0, bottom: 100, left: 20, right: 20 }}
            series={[
                {
                    data: [
                        {
                            id: 0,
                            value: 10,
                            label: "series A",
                            color: "#0088FE",
                        },
                        {
                            id: 1,
                            value: 15,
                            label: "series B",
                            color: "#00C49F",
                        },
                        {
                            id: 2,
                            value: 20,
                            label: "series C",
                            color: "#FFBB28",
                        },
                        {
                            id: 3,
                            value: 20,
                            label: "series D",
                            color: "#FF8042",
                        },
                    ],
                },
            ]}
            width={250}
            height={400}
            slotProps={{
                legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "left" },
                },
            }}
        />
    );
}
