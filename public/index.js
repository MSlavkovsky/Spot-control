document.getElementById('runPuppeteer').addEventListener('click', async () => {
    var inputValue = document.getElementById('textInput').value;

    alert(inputValue);

    var object = [
        {
            "el1": "A"
        },
        {
            "el2": "B"
        }
    ];

    try {
        const response = await fetch(`/run-puppeteer?inputValue=${encodeURIComponent(JSON.stringify(object))}`);
      //  const result = await response.text();
      //  console.log('Puppeteer result:', result);
    } catch (error) {
        console.error('Error running Puppeteer:', error);
    }
});