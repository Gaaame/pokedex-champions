import React from "react";
import "../css/Stats.css";

const Stats = ({ stats }) => {
  const statList = [
    {
      name: "HP",
      value: stats.hp,
    },
    {
      name: "Attack",
      value: stats.attack,
    },
    {
      name: "Defense",
      value: stats.defence,
    },
    {
      name: "Sp. Attack",
      value: stats.splAttack,
    },
    {
      name: "Sp. Defense",
      value: stats.splDefence,
    },
    {
      name: "Speed",
      value: stats.speed,
    },
  ];

  return (
    <div className="stats">
      {statList.map((stat) => (
        <div className="stat" key={stat.name}>
          <div className="stat-info">
            <span className="stat-name">{stat.name}</span>
            <span className="stat-value">{stat.value}</span>
          </div>

          <div className="stat-bar">
            <div
              className="stat-bar_fill"
              style={{
                width: `${Math.min((stat.value / 150) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
