import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend } from 'recharts';
import colors from '../../utils/colors';
import './PickupDistributionChart.css';

const PickupDistributionChart = ({ data, containerWidth = 600 }) => {
  const calculateCumulative = () => {
    let cumulative = 0;
    return data.map(item => {
      if (item.day === "Ikke hentet") return { ...item, cumulativePercentage: null };
      
      cumulative += item.percentage;
      return {
        ...item,
        cumulativePercentage: cumulative
      };
    });
  };
  
  const dataWithCumulative = calculateCumulative();
  
  // Highlight the day with highest pickup percentage
  const pickupData = dataWithCumulative.filter(item => item.day !== "Ikke hentet");
  const maxPickupItem = pickupData.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current, { percentage: 0 });
  
  const totalPickedUp = pickupData.reduce((sum, item) => sum + item.percentage, 0);
  const notPickedUp = data.find(item => item.day === "Ikke hentet")?.percentage || 0;
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      
      // more descriptive day label
      let dayLabel = item.day;
      if (item.day !== "Ikke hentet") {
        //  description for which day has most pickups
        if (item.day === maxPickupItem.day) {
          dayLabel = `${item.day} (Mest populær hentedag!)`;
        }
      }
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{dayLabel}</p>
          <p className="tooltip-item">
            <span className="tooltip-label">Prosentandel:</span>
            <span className="tooltip-value" style={{ color: item.day === "Ikke hentet" ? colors.error : colors.primary }}>
              {item.percentage}%
            </span>
          </p>
          {item.cumulativePercentage !== null && (
            <p className="tooltip-item">
              <span className="tooltip-label">Totalt hentet til nå:</span>
              <span className="tooltip-value" style={{ color: colors.secondary }}>
                {item.cumulativePercentage}%
              </span>
            </p>
          )}
          <p className="tooltip-item">
            <span className="tooltip-label">Antall:</span>
            <span className="tooltip-value">
              {item.count} {item.count === 1 ? 'reservasjon' : 'reservasjoner'}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomBarLabel = (props) => {
    const { x, y, width, value, index } = props;
    const radius = 10;
    const isMaxDay = dataWithCumulative[index]?.day === maxPickupItem.day;
    
    return (
      <g>
        <text 
          x={x + width / 2} 
          y={y - radius} 
          fill="#384255" 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{
            fontSize: containerWidth < 500 ? '10px' : '12px',
            fontWeight: isMaxDay ? '700' : '500'
          }}
        >
          {value}%
        </text>
      </g>
    );
  };

  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    const isMaxDay = payload.value === maxPickupItem.day;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill={isMaxDay ? colors.primary : colors.neutral[700]}
          style={{
            fontSize: containerWidth < 500 ? '10px' : '12px',
            fontWeight: isMaxDay ? '700' : '500'
          }}
        >
          {payload.value}
        </text>
        {isMaxDay && (
          <text 
            x={0} 
            y={18} 
            dy={16} 
            textAnchor="middle" 
            fill={colors.primary}
            style={{
              fontSize: containerWidth < 500 ? '8px' : '10px',
              fontWeight: '500'
            }}
          >
            ★ Mest populær
          </text>
        )}
      </g>
    );
  };


    

  
  return (
    <div className="pickup-distribution-chart">
     
      <div className="chart-container" style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataWithCumulative}
            margin={{ 
              top: 30, 
              right: containerWidth < 500 ? 10 : 30, 
              left: containerWidth < 500 ? 10 : 20, 
              bottom: 60 
            }}
            barCategoryGap={containerWidth < 500 ? 3 : 8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.neutral[200]} />
            <XAxis 
              dataKey="day" 
              tick={<CustomXAxisTick />}
              tickMargin={10}
              height={60}
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              tick={{ 
                fill: colors.neutral[700],
                fontSize: containerWidth < 500 ? 10 : 12
              }}
              domain={[0, 100]}
              allowDecimals={false}
              label={{ 
                value: 'Prosentandel', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: colors.neutral[700], fontSize: containerWidth < 500 ? 10 : 12 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="percentage" 
              name="Prosentandel hentet"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            >
              <LabelList 
                dataKey="percentage" 
                position="top" 
                content={renderCustomBarLabel} 
              />
              {dataWithCumulative.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.day === "Ikke hentet" 
                    ? colors.error 
                    : entry.day === maxPickupItem.day
                      ? colors.primary
                      : entry.percentage > 15
                        ? colors.primary
                        : colors.primaryLight
                  }
                  stroke={entry.day === "Ikke hentet" ? colors.error : colors.primary}
                  strokeWidth={0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Oppsummering med forbedret lesbarhet */}
      <div className="distribution-insights">
        <div className="insight-metric">
          <span className="insight-value">{totalPickedUp}%</span>
          <span className="insight-label">hentes totalt</span>
        </div>
        
        <div className="insight-metric">
          <span className="insight-value pickup-days">
            {dataWithCumulative
              .filter(item => item.day !== "Ikke hentet" && item.percentage >= 5)
              .length || 0}
          </span>
          <span className="insight-label">dager med betydelig aktivitet</span>
        </div>
        
        <div className="insight-metric">
          <span className="insight-value not-picked" style={{ color: colors.error }}>
            {notPickedUp}%
          </span>
          <span className="insight-label">hentes aldri</span>
        </div>
      </div>
    </div>
  );
};

PickupDistributionChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired
    })
  ),
  containerWidth: PropTypes.number
};

PickupDistributionChart.defaultProps = {
  data: [],
  containerWidth: 600
};

export default PickupDistributionChart;