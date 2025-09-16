import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Plotly from "plotly.js-dist-min";

interface PressureChartProps {
  pressureData: any | null;
}

export default function PressureChart({ pressureData }: PressureChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Create a simple pressure distribution chart
    let xValues: number[] = [];
    let yValues: number[] = [];
    
    if (pressureData && Array.isArray(pressureData.points)) {
      // Use actual data if available
      xValues = pressureData.points.map((p: any, i: number) => i);
      yValues = pressureData.points.map((p: any) => p.pressure);
    } else {
      // Generate demo data if no real data
      for (let i = 0; i < 50; i++) {
        xValues.push(i);
        // Generate a smooth curve that looks like a pressure distribution
        const x = i / 50;
        yValues.push(
          -3000 * Math.sin(x * Math.PI) +
          1000 * Math.sin(x * 6 * Math.PI) +
          500 * Math.random() - 250
        );
      }
    }
    
    const data = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#3B82F6',
        width: 2
      },
      fill: 'tozeroy',
      fillcolor: 'rgba(59, 130, 246, 0.2)'
    }];
    
    const layout = {
      margin: { t: 5, r: 10, l: 40, b: 30 },
      paper_bgcolor: '#1E1E1E',
      plot_bgcolor: '#1E1E1E',
      font: {
        color: '#E5E7EB',
        family: 'Inter, sans-serif'
      },
      xaxis: {
        title: 'Surface Position',
        gridcolor: '#333333',
        zerolinecolor: '#444444'
      },
      yaxis: {
        title: 'Pressure (Pa)',
        gridcolor: '#333333',
        zerolinecolor: '#444444'
      },
      autosize: true,
      height: 180
    };
    
    Plotly.newPlot(chartRef.current, data, layout, {
      responsive: true,
      displayModeBar: false
    });
    
    // Cleanup
    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [pressureData]);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-3">PRESSURE DISTRIBUTION</h3>
      <Card className="bg-dark-bg border-dark-border">
        <CardContent className="p-3">
          <div ref={chartRef} className="w-full h-44"></div>
        </CardContent>
      </Card>
    </div>
  );
}
