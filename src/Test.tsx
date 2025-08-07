import { useEffect, useState } from "react";
import type { ChartOptions } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { apiV2 } from "./utils/axios";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement
);

// === Types ===
interface StatResponse {
    overall: {
        total_answers: number;
        total_errors: number;
        accuracy: number;
        average_time_seconds: number;
    };
    categories: {
        labels: string[];
        datasets: {
            total_errors: number[];
            error_percentages: number[];
            average_time_seconds: number[];
        };
    };
    topics: {
        labels: string[];
        datasets: {
            total_errors: number[];
            error_percentages: number[];
            average_time_seconds: number[];
        };
    };
    answer_distribution: {
        labels: string[];
        datasets: {
            counts: number[];
        };
    };
    topic_accuracy: {
        labels: string[];
        datasets: {
            correct: number[];
            incorrect: number[];
            accuracy_percentage: number[];
        };
    };
}

// === Chart Options ===
const topicAccuracyOptions: ChartOptions<"line"> = {
    responsive: true,
    scales: {
        y: {
            type: "linear",
            position: "left",
            title: {
                display: true,
                text: "Count",
            },
        },
        y1: {
            type: "linear",
            position: "right",
            min: 0,
            max: 100,
            title: {
                display: true,
                text: "Accuracy (%)",
            },
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const StatisticsDashboard = () => {
    const [stats, setStats] = useState<StatResponse | null>(null);

    useEffect(() => {
        apiV2
            .get("/quiz/statistics")
            .then((res) => setStats(res.data))
            .catch((err) => console.error(err));
    }, []);

    if (!stats) return <p>Loading statistics...</p>;

    // === Chart Data ===

    const categoryErrorChartData = {
        labels: stats.categories.labels,
        datasets: [
            {
                label: "Error Percentage (%)",
                data: stats.categories.datasets.error_percentages,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    const answerDistributionData = {
        labels: stats.answer_distribution.labels,
        datasets: [
            {
                label: "Answers Selected",
                data: stats.answer_distribution.datasets.counts,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                ],
                hoverOffset: 30,
            },
        ],
    };

    const topicAccuracyData = {
        labels: stats.topic_accuracy.labels,
        datasets: [
            {
                label: "Correct",
                data: stats.topic_accuracy.datasets.correct,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                fill: true,
                tension: 0.3,
            },
            {
                label: "Incorrect",
                data: stats.topic_accuracy.datasets.incorrect,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true,
                tension: 0.3,
            },
            {
                label: "Accuracy %",
                data: stats.topic_accuracy.datasets.accuracy_percentage,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                fill: false,
                tension: 0.3,
                yAxisID: "y1",
            },
        ],
    };

    return (
        <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
            <h2>Overall Stats</h2>
            <ul>
                <li>Total Answers: {stats.overall.total_answers}</li>
                <li>Total Errors: {stats.overall.total_errors}</li>
                <li>Accuracy: {stats.overall.accuracy}%</li>
                <li>Average Time: {stats.overall.average_time_seconds} sec</li>
            </ul>

            <h2>Category Error Percentage</h2>
            <Bar data={categoryErrorChartData} />

            <h2>Answer Distribution</h2>
            <Pie data={answerDistributionData} />

            <h2>Topic Accuracy</h2>
            <Line data={topicAccuracyData} options={topicAccuracyOptions} />
        </div>
    );
};

export default StatisticsDashboard;
