// src/components/chart/ScatterPlot.jsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell, ZAxis } from 'recharts';
import colors from '../../utils/colors';
import './BarChart.css';

const ScatterPlot = ({ containerWidth = 600, containerHeight = 400 }) => {
  //  data
  const scatterData = [
    { x: 1600, y: 1.0, title: 'Tørt land', author: 'Jørn Lier Horst' },
    { x: 1500, y: 1.2, title: 'Kongen av Os', author: 'Jo Nesbø' },
    { x: 1450, y: 1.5, title: 'Sjøfareren', author: 'Erika Fatland' },
    { x: 1300, y: 1.8, title: 'Skriket', author: 'Jørn Lier Horst og Jan-Erik Fjell' },
    { x: 1200, y: 2.1, title: 'Råsterk på et år', author: 'Jørgine Massa Vasstrand' },
    { x: 900, y: 2.8, title: 'Lur familiemat', author: 'Ida Gran-Jansen' },
    { x: 800, y: 3.2, title: '23 meter offside (Pondus)', author: 'Frode Øverli' },
    { x: 600, y: 3.9, title: 'Felix har følelser', author: 'Charlotte Mjelde' },
    { x: 400, y: 4.5, title: 'Juleroser', author: 'Herborg Kråkevik' },
    { x: 250, y: 5.3, title: 'Søvngjengeren', author: 'Lars Kepler' }
  ];
  
  const getPointSize = (value) => {
    return 30 + (value / 1600) * 30;
  };
  
  const getPointColor = (xValue, yValue) => {
    const xNorm = xValue / 1700;
    const yNorm = yValue / 6;
    
    const blendFactor = (xNorm * 0.7) + ((1 - yNorm) * 0.3);
    
    const primary = hexToRgb(colors.primary);
    const secondary = hexToRgb(colors.secondary);
    
    const r = Math.round(secondary.r + (primary.r - secondary.r) * blendFactor);
    const g = Math.round(secondary.g + (primary.g - secondary.g) * blendFactor);
    const b = Math.round(secondary.b + (primary.b - secondary.b) * blendFactor);
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pointColor = getPointColor(data.x, data.y);
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title" style={{ color: colors.primary }}>{data.title}</p>
          <p>
            <span className="tooltip-label">Forfatter:</span>
            <span className="tooltip-value" style={{ color: colors.neutral[900] }}>{data.author}</span>
          </p>
          <p>
            <span className="tooltip-label">Antall på venteliste:</span>
            <span className="tooltip-value" style={{ color: pointColor }}>
              {data.x > 999 ? `${(data.x/1000).toFixed(1)}k` : data.x}
            </span>
          </p>
          <p>
            <span className="tooltip-label">Dager på hentehylla:</span>
            <span className="tooltip-value" style={{ color: pointColor }}>
              {data.y.toFixed(1)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getMargins = () => {
    if (containerWidth < 500) {
      return { top: 20, right: 30, left: 40, bottom: 60 };
    } else if (containerWidth < 768) {
      return { top: 20, right: 40, left: 50, bottom: 60 };
    }
    return { top: 20, right: 50, left: 60, bottom: 60 };
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={getMargins()}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.1} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={true} 
            horizontal={true} 
            stroke={colors.neutral[200]} 
            opacity={0.7}
          />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[0, 1700]}
            tick={{ 
              fontSize: containerWidth < 500 ? 10 : 12,
              fill: colors.neutral[700]
            }}
            tickFormatter={(value) => value > 999 ? `${(value/1000).toFixed(1)}k` : value}
            height={40}
            stroke={colors.neutral[200]}
            axisLine={{ stroke: colors.neutral[200] }}
          >
            <Label 
              value="Antall lånere på venteliste" 
              position="bottom" 
              style={{ 
                fill: colors.neutral[700], 
                fontSize: containerWidth < 500 ? '10px' : '12px',
                fontWeight: 500
              }}
              offset={20}
            />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="y" 
            domain={[0, 6]}
            tick={{ 
              fontSize: containerWidth < 500 ? 10 : 12,
              fill: colors.neutral[700]
            }}
            tickFormatter={(value) => value.toFixed(1)}
            width={55}
            stroke={colors.neutral[200]}
            axisLine={{ stroke: colors.neutral[200] }}
            tickLine={{ stroke: colors.neutral[200] }}
          >
            <Label 
              value="Dager på hentehylla" 
              position="insideLeft"
              angle={-90} 
              style={{ 
                fill: colors.neutral[700], 
                fontSize: containerWidth < 500 ? '10px' : '12px',
                fontWeight: 500
              }}
              offset={-40}
            />
          </YAxis>
          <ZAxis 
            type="number" 
            range={[40, 600]} 
            dataKey={(data) => getPointSize(data.x)} 
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{
              stroke: colors.primary,
              strokeDasharray: '3 3',
              strokeWidth: 1,
              opacity: 0.7
            }}
          />
          <Scatter 
            name="Bok Popularitet" 
            data={scatterData}
            shape="circle"
            legendType="circle"
          >
            {scatterData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getPointColor(entry.x, entry.y)}
                fillOpacity={0.85}
                stroke={colors.neutral[100]}
                strokeWidth={2}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;