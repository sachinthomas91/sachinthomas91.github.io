document.addEventListener('DOMContentLoaded', () => {
    const values = [
        "Trusted",
        "Reliable",
        "Secure",
        "Governed",
        "Accessible"
    ];

    const textElement = document.getElementById('value-text');
    let currentIndex = 0;

    function animateText() {
        // Set the text content with a wrapper for the underline
        textElement.innerHTML = `<span class="value-inner">${values[currentIndex]}</span>`;

        // Remove exit class if present and add visible class to fade in
        textElement.classList.remove('exit');

        // Small delay to ensure the browser registers the class removal before adding 'visible'
        // This is important for the transition to work correctly if we were looping immediately,
        // but here we have a distinct exit phase.
        requestAnimationFrame(() => {
            textElement.classList.add('visible');
        });

        // Hold for 3.5 seconds, then exit
        setTimeout(() => {
            textElement.classList.remove('visible');
            textElement.classList.add('exit');

            // Wait for exit transition (0.5s) to complete before showing next word
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % values.length;
                animateText();
            }, 500); // Matches CSS transition duration

        }, 3500); // Hold time
    }

    // Start the animation
    animateText();
});
