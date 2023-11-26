async function runPuppeteer() {
    const inputURL = document.getElementById('inputValue').value;
    var instances = [
        {
          "el1": "A"
        },
        {
          "el2": "B"
        }
      ];
    try {
      // Initiate Puppeteer execution on the server
      await fetch(`/runPuppeteer?instances=${encodeURIComponent(JSON.stringify(instances))}&inputURL=${encodeURIComponent(inputURL)}`);
    } catch (error) {
      console.error('Error initiating Puppeteer execution:', error);
      alert('Error initiating Puppeteer execution. Check the console for details.');
    }

    const ws = new WebSocket(`ws://localhost:3000`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateProgress(data.progress);

      // If the progress message indicates completion, close the WebSocket connection
      if (data.progress.includes('completed successfully')) {
        ws.close();
      }
    };
  }

  function updateProgress(progress) {
    document.getElementById('progress-Spot').innerText += `${progress}\n`;
  }