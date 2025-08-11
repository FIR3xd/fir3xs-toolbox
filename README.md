# EV Torque Calculator Platinum ⚡️

Welcome to the **EV Torque Calculator Platinum** — your go-to web tool for visualizing electric motor torque curves with precision, presets, and customizability. Perfect for nerds, EV enthusiasts, and anyone who loves that sweet torque graph action.

---

## What Is This?

This project lets you:

- Pick from preset electric motor torque curves (including meme motors like the *some random ahh electric scooter*).
- Customize your own torque curve using intuitive sliders.
- Adjust max torque, max power, max RPM, and calculation precision.
- Generate a detailed torque table output.
- Visualize the torque curve on a sleek chart.
- Export your torque data as a text file.

---

## Features

- **Custom Torque Curve Sliders:** Tweak ramp-up, plateau, and falloff parameters to craft your ideal torque curve.
- **Multiple Preset Motor Curves:** From Tesla to Porsche Taycan, and even the Scala 1.0TSI for that meme factor.
- **Precision Control:** Control the RPM step size for your torque calculations.
- **Live Graph Rendering:** Instant visual feedback on your torque curve.
- **Export Capability:** Download your torque table for offline use or sharing.

---

## How to Use

1. Open `index.html` in your favorite modern browser (Chrome, Firefox, Edge, Safari).
2. Select a preset motor curve or toggle to custom curve sliders.
3. Adjust max torque, power, max RPM, and precision sliders as needed.
4. Hit **Calculate Torque Table**.
5. View the torque data and graph.
6. Optionally, check the box to export the torque table as a `.txt` file.

---

## Project Structure

- `index.html` — Main web page with all input forms and output areas.
- `css/bootstrap.css` & `css/custom.css` — Styling & layout.
- `js/torqueCalculator.js` — Main script controlling form input, calculations, and graph rendering.
- `js/engineCurves.js` — Contains preset torque curve functions.
- `js/graphRenderer.js` — Handles Chart.js graph drawing.

---

## Dependencies

- [Bootstrap 5](https://getbootstrap.com/)
- [Chart.js](https://www.chartjs.org/)

---

## License

This project is open-source — do whatever you want, just don’t be a jerk.

---

Made with 💙 by FIR3x — because I was too lazy to calculate torque curves using a Windows calculator.
