const ticketSalesData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Domestic",
        data: [2000, 3000, 2500, 2000, 1500, 2500, 2000],
        backgroundColor: "#1B3A4B",
      },
      {
        label: "International",
        data: [1500, 1000, 1500, 1000, 1500, 1000, 1500],
        backgroundColor: "#ECEFF1",
      },
    ],
  };

  const ticketSalesOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 4000,
        ticks: {
          stepSize: 1000,
          callback: (value: string | number) => `${Number(value) / 1000}K`,
        },
      },
    },
  };

  const flightsScheduleData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Domestic",
        data: [150, 100, 120, 110, 170, 140, 130, 150],
        borderColor: "#457B9D",
        backgroundColor: "#ECEFF1",
        fill: true,
      },
      {
        label: "International",
        data: [120, 90, 100, 80, 110, 100, 90, 120],
        borderColor: "#1B3A4B",
        backgroundColor: "rgba(27, 58, 75, 0.2)",
        fill: true,
      },
    ],
  };

  const flightsScheduleOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 200,
        ticks: {
          stepSize: 50,
        },
      },
    },
  };

  export { ticketSalesData, ticketSalesOptions, flightsScheduleData, flightsScheduleOptions };