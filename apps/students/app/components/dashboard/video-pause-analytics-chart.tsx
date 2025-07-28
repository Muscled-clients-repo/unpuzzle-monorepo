"use client";
import { useEffect, useRef } from "react";
import { Chart, ChartOptions, ChartData } from "chart.js";
import "chart.js/auto"; // Ensure all chart elements are registered

const PauseSummaryChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "#00AFF0");
      gradient.addColorStop(1, "#FFFFFF");

      const data: ChartData = {
        labels: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
        ],
        datasets: [
          {
            label: "Pause Summary...",
            data: [35, 25, 14, 24, 29, 21, 27, 19, 16],
            borderColor: "#00AFF0", // Blue line
            backgroundColor: gradient, // Gradient fill
            fill: true, // Fill the area under the line
            tension: 0.3,
          },
        ],
      };

      const options: ChartOptions = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return tooltipItem.raw + " %";
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time",
            },
            grid: {
              display: false, // Remove the X-axis grid lines
            },
          },
          y: {
            min: 0,
            max: 35,
            ticks: {
              stepSize: 5,
            },
            grid: {
              display: false, // Remove the Y-axis grid lines
            },
          },
        },
        elements: {
          line: {
            borderWidth: 1,
          },
          point: {
            radius: 0,
            hoverRadius: 0,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
      };

      const myChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      });

      // Cleanup chart on component unmount
      return () => {
        myChart.destroy();
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef} width="400" height="416"></canvas>
    </div>
  );
};

export default PauseSummaryChart;
