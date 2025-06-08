let chartInstance = null;
let progressChartInstance = null;

async function getLeetCodeData() {
  const username = document.getElementById("username").value.trim();
  const resultDiv = document.getElementById("results");
  const chartCanvas = document.getElementById("difficultyChart");

  if (!username) {
    alert("Please enter a username");
    return;
  }

  resultDiv.innerHTML = "Loading...";
  if (chartInstance) chartInstance.destroy();
  if (progressChartInstance) progressChartInstance.destroy();

  try {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const data = await response.json();

    if (data.status === "error") {
      resultDiv.innerHTML = `<p>User not found</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <h2>📊 Stats for <strong>${username}</strong></h2>
      <ul>
        <li><strong>Total Solved:</strong> ${data.totalSolved} / ${data.totalQuestions}</li>
        <li><strong>Easy:</strong> ${data.easySolved} / ${data.totalEasy}</li>
        <li><strong>Medium:</strong> ${data.mediumSolved} / ${data.totalMedium}</li>
        <li><strong>Hard:</strong> ${data.hardSolved} / ${data.totalHard}</li>
        <li><strong>Ranking:</strong> ${data.ranking}</li>
        <li><strong>Contribution Points:</strong> ${data.contributionPoints}</li>
      </ul>
    `;

    // Doughnut Chart
    chartInstance = new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          label: 'Solved Problems',
          data: [data.easySolved, data.mediumSolved, data.hardSolved],
          backgroundColor: ['#00c853', '#ffab00', '#d50000'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Solved Problems by Difficulty'
          }
        }
      }
    });

    // Simulated Progress Chart
    const progressLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const progressData = [10, 25, 40, 60, 85, data.totalSolved];

    const progressContainer = document.getElementById("progressChartContainer");
    progressContainer.innerHTML = '<canvas id="progressChart" width="400" height="300"></canvas>';

    const progressCanvas = document.getElementById("progressChart");
    progressChartInstance = new Chart(progressCanvas, {
      type: 'bar',
      data: {
        labels: progressLabels,
        datasets: [{
          label: 'Problems Solved Over Time',
          data: progressData,
          backgroundColor: '#42a5f5',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Leaderboard
    // const usernames = [username, "lee215", "rajatbhardwaj007"];
    // Promise.all(
    //   usernames.map(user =>
    //     fetch(`https://leetcode-stats-api.herokuapp.com/${user}`).then(res => res.json())
    //   )
    // ).then(results => {
    //   const tbody = document.getElementById("leaderboard-body");
    //   tbody.innerHTML = "";
    //   results.forEach(userData => {
    //     const row = `
    //       <tr>
    //         <td>${userData.username || 'N/A'}</td>
    //         <td>${userData.totalSolved}</td>
    //         <td>${userData.ranking}</td>
    //       </tr>
    //     `;
    //     tbody.innerHTML += row;
    //   });
    // });

  } catch (error) {
    console.error("Error:", error);
    resultDiv.innerHTML = "<p>Failed to fetch data. Try again later.</p>";
  }
}

function downloadChart() {
  const canvas = document.getElementById('difficultyChart');
  const link = document.createElement('a');
  link.download = 'leetcode-metrics-chart.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
