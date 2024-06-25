import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import axiosInstance from '~/axiosConfig';

const Charts = () => {
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        fontFamily: 'Satoshi, sans-serif',
        type: 'donut',
      },
      labels: [],
      legend: {
        show: false,
        position: 'bottom',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: 'transparent',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 2600,
          options: {
            chart: {
              width: 380,
            },
          },
        },
        {
          breakpoint: 640,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/salaries/total_work_hours_all_users');
        const data = response.data;

        if (data && data.total_work_hours_by_user) {
          const series = [];
          const labels = [];

          for (const userName in data.total_work_hours_by_user) {
            series.push(data.total_work_hours_by_user[userName]);
            labels.push(`${userName}`);
          }

          setState((prevState) => ({
            ...prevState,
            series: series,
            options: {
              ...prevState.options,
              labels: labels,
              colors: generateRandomColors(series),
            },
          }));
        } else {
          console.error('Unexpected data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(color);
    }
    return colors;
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Top staff</h5>
        </div>
      </div>
      <div className="mb-2">
        <div id="charts" className="mx-auto flex justify-center">
          <ReactApexChart options={state.options} series={state.series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {state.options.labels &&
          state.options.labels.map((label, index) => (
            <div key={index} className="sm:w-1/2 w-full px-8">
              <div className="flex w-full items-center">
                <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span>{label}</span>
                  <span>{state.series[index]} hours</span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Charts;
