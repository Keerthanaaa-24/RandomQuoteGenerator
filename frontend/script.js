async function generateQuote() {
    generateBtn.disabled = true;
    loadingState.classList.add('active');
    errorMessage.classList.remove('show');
    try {
        const response = await fetch("http://localhost:5000/api/getQuote", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (data.quote) {
            quoteText.textContent = data.quote;
        } else {
            throw new Error("No quote received from server");
        }
    }
    catch (error) {
        console.error(error);
        errorMessage.textContent = `⚠️ ${error.message}`;
        errorMessage.classList.add('show');
        quoteText.textContent = 'Failed to generate quote. Please try again.';
    } finally {
        generateBtn.disabled = false;
        loadingState.classList.remove('active');
    }
}
